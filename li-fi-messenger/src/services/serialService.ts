/**
 * Web Serial API Service for Arduino Communication
 *
 * Implements real physical USB serial communication with Arduino Uno at 9600 baud.
 * Operates in Chromium-based browsers (Google Chrome, Microsoft Edge, Opera).
 */

import { ConnectionState, SerialLogEntry } from '../types';
import { encodeSerialPayload } from './lifiProtocol';

// Augment navigator for TypeScript Web Serial types
declare global {
  interface Navigator {
    serial?: {
      requestPort(options?: SerialPortRequestOptions): Promise<SerialPort>;
      getPorts(): Promise<SerialPort[]>;
      addEventListener(type: string, listener: (event: Event) => void): void;
      removeEventListener(type: string, listener: (event: Event) => void): void;
    };
  }

  interface SerialPortRequestOptions {
    filters?: Array<{
      usbVendorId?: number;
      usbProductId?: number;
    }>;
  }

  interface SerialOptions {
    baudRate: number;
    dataBits?: 7 | 8;
    stopBits?: 1 | 2;
    parity?: 'none' | 'even' | 'mark' | 'odd' | 'space';
    bufferSize?: number;
    flowControl?: 'none' | 'hardware';
  }

  interface SerialPortInfo {
    usbVendorId?: number;
    usbProductId?: number;
  }

  interface SerialPort {
    open(options: SerialOptions): Promise<void>;
    close(): Promise<void>;
    readable: ReadableStream<Uint8Array> | null;
    writable: WritableStream<Uint8Array> | null;
    getInfo(): SerialPortInfo;
    forget?(): Promise<void>;
  }
}

export type SerialStateListener = (state: ConnectionState, message?: string) => void;
export type SerialLogListener = (entry: SerialLogEntry) => void;
export type SerialDataListener = (data: string) => void;

class SerialService {
  private port: SerialPort | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
  private isReading = false;
  private state: ConnectionState = 'disconnected';

  private stateListeners: Set<SerialStateListener> = new Set();
  private logListeners: Set<SerialLogListener> = new Set();
  private dataListeners: Set<SerialDataListener> = new Set();

  constructor() {
    if (this.isSupported()) {
      navigator.serial?.addEventListener('disconnect', (event) => {
        this.addLog('warning', 'USB Serial device disconnected by host/cable.');
        this.disconnect();
      });
    }
  }

  /**
   * Check if the current browser environment supports the Web Serial API
   */
  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'serial' in navigator && !!navigator.serial;
  }

  public getState(): ConnectionState {
    return this.state;
  }

  public getPortInfo(): SerialPortInfo | null {
    if (!this.port) return null;
    try {
      return this.port.getInfo();
    } catch {
      return null;
    }
  }

  public subscribeState(listener: SerialStateListener): () => void {
    this.stateListeners.add(listener);
    listener(this.state);
    return () => this.stateListeners.delete(listener);
  }

  public subscribeLogs(listener: SerialLogListener): () => void {
    this.logListeners.add(listener);
    return () => this.logListeners.delete(listener);
  }

  public subscribeData(listener: SerialDataListener): () => void {
    this.dataListeners.add(listener);
    return () => this.dataListeners.delete(listener);
  }

  private setState(state: ConnectionState, message?: string) {
    this.state = state;
    this.stateListeners.forEach((fn) => fn(state, message));
  }

  private addLog(
    type: 'tx' | 'rx' | 'info' | 'error' | 'warning',
    data: string,
    bytesCount?: number
  ) {
    const entry: SerialLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
      }),
      type,
      data,
      bytesCount,
    };
    this.logListeners.forEach((fn) => fn(entry));
  }

  /**
   * Connect to an Arduino via Web Serial at 9600 baud
   */
  public async connect(): Promise<boolean> {
    if (!this.isSupported()) {
      const err = 'Web Serial API is not supported in this browser. Please use Google Chrome or Microsoft Edge on Windows.';
      this.setState('error', err);
      this.addLog('error', err);
      return false;
    }

    try {
      this.setState('connecting', 'Requesting USB Serial port...');
      this.addLog('info', 'Opening browser device selector dialog. Please choose your Arduino Uno COM port.');

      // Request port selection from user
      this.port = await navigator.serial!.requestPort();

      const info = this.port.getInfo();
      const vid = info.usbVendorId ? `0x${info.usbVendorId.toString(16).padStart(4, '0')}` : 'Unknown';
      const pid = info.usbProductId ? `0x${info.usbProductId.toString(16).padStart(4, '0')}` : 'Unknown';
      this.addLog('info', `Port selected. Vendor ID: ${vid}, Product ID: ${pid}`);

      // Open port with 9600 baud, 8N1
      await this.port.open({
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        bufferSize: 255,
      });

      this.setState('connected', 'Connected to Arduino Uno at 9600 baud');
      this.addLog('info', 'Serial connection established at 9600 baud (8-N-1). Ready to transmit.');

      // Start asynchronous background reader loop
      this.startReading();

      return true;
    } catch (error: any) {
      const message = error?.message || 'Failed to open serial port';
      this.setState('error', message);
      this.addLog('error', `Connection error: ${message}`);
      this.cleanup();
      return false;
    }
  }

  /**
   * Send a UTF-8 string to the Arduino, appending '\n' as required by 9600 baud serial protocol
   */
  public async sendMessage(message: string): Promise<boolean> {
    if (this.state !== 'connected' || !this.port || !this.port.writable) {
      this.addLog('error', 'Cannot send: Arduino is not connected. Click "Connect Arduino" first.');
      return false;
    }

    try {
      const encoded = encodeSerialPayload(message);
      this.writer = this.port.writable.getWriter();
      await this.writer.write(encoded);
      this.writer.releaseLock();
      this.writer = null;

      // Log successful transmission
      const displayPayload = message.replace(/\n/g, '\\n');
      this.addLog('tx', `Sent [${displayPayload}]`, encoded.length);
      return true;
    } catch (error: any) {
      if (this.writer) {
        try {
          this.writer.releaseLock();
        } catch {}
        this.writer = null;
      }
      const message = error?.message || 'Write operation failed';
      this.addLog('error', `Send failed: ${message}`);
      return false;
    }
  }

  /**
   * Continuously read incoming serial data from Arduino
   */
  private async startReading() {
    if (!this.port || !this.port.readable) return;
    this.isReading = true;

    const decoder = new TextDecoder();
    let accumulated = '';

    while (this.port && this.port.readable && this.isReading) {
      try {
        this.reader = this.port.readable.getReader();
        while (true) {
          const { value, done } = await this.reader.read();
          if (done) {
            break;
          }
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            accumulated += chunk;

            // Split on newline
            if (accumulated.includes('\n')) {
              const lines = accumulated.split('\n');
              accumulated = lines.pop() || '';
              for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.length > 0) {
                  this.addLog('rx', trimmed, new TextEncoder().encode(trimmed).length);
                  this.dataListeners.forEach((fn) => fn(trimmed));
                }
              }
            }
          }
        }
      } catch (error: any) {
        if (this.isReading) {
          this.addLog('warning', `Serial read paused: ${error?.message || 'Stream closed'}`);
        }
        break;
      } finally {
        if (this.reader) {
          try {
            this.reader.releaseLock();
          } catch {}
          this.reader = null;
        }
      }
    }
  }

  /**
   * Disconnect and release serial port
   */
  public async disconnect(): Promise<void> {
    this.isReading = false;

    if (this.reader) {
      try {
        await this.reader.cancel();
        this.reader.releaseLock();
      } catch {}
      this.reader = null;
    }

    if (this.writer) {
      try {
        this.writer.releaseLock();
      } catch {}
      this.writer = null;
    }

    if (this.port) {
      try {
        await this.port.close();
      } catch (error: any) {
        console.warn('Error closing port:', error);
      }
      this.port = null;
    }

    this.cleanup();
    this.setState('disconnected', 'Disconnected from serial device');
    this.addLog('info', 'Serial port closed cleanly.');
  }

  private cleanup() {
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.isReading = false;
  }
}

// Export singleton instance
export const serialService = new SerialService();
