/**
 * Li-Fi Messenger Data Types and Interfaces
 */

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export type LcdTheme = 'blue' | 'green' | 'amber';

export interface SerialLogEntry {
  id: string;
  timestamp: string;
  type: 'tx' | 'rx' | 'info' | 'error' | 'warning';
  data: string;
  bytesCount?: number;
}

export interface ArduinoPortInfo {
  usbVendorId?: number;
  usbProductId?: number;
  displayName?: string;
}

export interface LcdDisplayState {
  line1: string; // Exactly up to 16 chars
  line2: string; // Exactly up to 16 chars
  backlight: boolean;
  cursorVisible: boolean;
  theme: LcdTheme;
}
