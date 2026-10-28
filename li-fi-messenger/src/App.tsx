/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LcdPreview } from './components/LcdPreview';
import { MessageController } from './components/MessageController';
import { ConnectionPanel } from './components/ConnectionPanel';
import { SerialTerminal } from './components/SerialTerminal';
import { ArduinoInstructions } from './components/ArduinoInstructions';
import { StandaloneExportModal } from './components/StandaloneExportModal';
import { serialService } from './services/serialService';
import { formatMessageForLcd } from './services/lifiProtocol';
import { ConnectionState, LcdTheme, SerialLogEntry } from './types';
import {
  Monitor,
  Terminal,
  Cpu,
  FileCode,
  Radio,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';

export default function App() {
  const [message, setMessage] = useState<string>('HELLO ARDUINO!');
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [lcdTheme, setLcdTheme] = useState<LcdTheme>('blue');
  const [backlight, setBacklight] = useState<boolean>(true);
  const [cursorVisible, setCursorVisible] = useState<boolean>(true);
  const [logs, setLogs] = useState<SerialLogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'controller' | 'terminal' | 'arduino' | 'protocol'>('controller');
  const [lastSentTimestamp, setLastSentTimestamp] = useState<string>('');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  // Subscribe to Web Serial events
  useEffect(() => {
    setIsSupported(serialService.isSupported());

    const unsubState = serialService.subscribeState((state, msg) => {
      setConnectionState(state);
      if (msg) setStatusMessage(msg);
    });

    const unsubLogs = serialService.subscribeLogs((entry) => {
      setLogs((prev) => [...prev.slice(-300), entry]);
    });

    // Initial greeting in log
    setLogs([
      {
        id: 'init-1',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        type: 'info',
        data: 'Li-Fi Messenger loaded. Web Serial API ready for Arduino Uno.',
      },
    ]);

    return () => {
      unsubState();
      unsubLogs();
    };
  }, []);

  const handleConnect = async () => {
    await serialService.connect();
  };

  const handleDisconnect = async () => {
    await serialService.disconnect();
  };

  const handleSendMessage = async (text: string): Promise<boolean> => {
    const success = await serialService.sendMessage(text);
    if (success) {
      setLastSentTimestamp(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }
    return success;
  };

  const handleSendRaw = async (raw: string): Promise<boolean> => {
    return await serialService.sendMessage(raw);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const { line1, line2 } = formatMessageForLcd(message);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* 3-Zone Navigation Header */}
      <Navbar
        connectionState={connectionState}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Sub-header telemetry ribbon */}
      <div className="bg-slate-900 border-b border-slate-800 text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="text-white font-semibold">HARDWARE TARGET:</span>
            <span className="text-blue-400">Arduino Uno R3</span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span>16x2 I2C LCD</span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span>Address: 0x27</span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span>9600 Baud</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 font-medium"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Standalone Single-File HTML Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs for Mobile / Quick Switch */}
        <div className="flex md:hidden items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('controller')}
            className={`px-3 py-1.5 font-medium rounded whitespace-nowrap ${
              activeTab === 'controller' ? 'bg-blue-600 text-white' : 'text-slate-600'
            }`}
          >
            LCD Controller
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1.5 font-medium rounded whitespace-nowrap ${
              activeTab === 'terminal' ? 'bg-blue-600 text-white' : 'text-slate-600'
            }`}
          >
            Serial Monitor
          </button>
          <button
            onClick={() => setActiveTab('arduino')}
            className={`px-3 py-1.5 font-medium rounded whitespace-nowrap ${
              activeTab === 'arduino' ? 'bg-blue-600 text-white' : 'text-slate-600'
            }`}
          >
            Arduino Setup
          </button>
          <button
            onClick={() => setActiveTab('protocol')}
            className={`px-3 py-1.5 font-medium rounded whitespace-nowrap ${
              activeTab === 'protocol' ? 'bg-blue-600 text-white' : 'text-slate-600'
            }`}
          >
            Li-Fi Specs
          </button>
        </div>

        {/* TAB: CONTROLLER (Default primary view) */}
        {activeTab === 'controller' && (
          <div className="space-y-6">
            {/* Top row: 16x2 LCD Preview */}
            <LcdPreview
              line1={line1}
              line2={line2}
              theme={lcdTheme}
              setTheme={setLcdTheme}
              backlight={backlight}
              setBacklight={setBacklight}
              cursorVisible={cursorVisible}
              setCursorVisible={setCursorVisible}
              lastSentTimestamp={lastSentTimestamp}
            />

            {/* Split row: Message Controller & Serial Connection Info */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <MessageController
                  message={message}
                  setMessage={setMessage}
                  onSendMessage={handleSendMessage}
                  connectionState={connectionState}
                  onConnect={handleConnect}
                />
              </div>

              <div className="lg:col-span-5 space-y-6">
                <ConnectionPanel
                  connectionState={connectionState}
                  statusMessage={statusMessage}
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                  isSupported={isSupported}
                  portInfo={serialService.getPortInfo()}
                />

                {/* Quick Hardware Pinout Summary */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span>Quick Pinout Reference:</span>
                    <button
                      onClick={() => setActiveTab('arduino')}
                      className="text-blue-600 hover:text-blue-800 flex items-center font-normal"
                    >
                      Full Guide <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-700">
                    <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                      <strong>SDA:</strong> Arduino Uno A4
                    </div>
                    <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                      <strong>SCL:</strong> Arduino Uno A5
                    </div>
                    <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                      <strong>VCC:</strong> Arduino Uno 5V
                    </div>
                    <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                      <strong>GND:</strong> Arduino Uno GND
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: SERIAL TERMINAL */}
        {activeTab === 'terminal' && (
          <div className="space-y-6">
            <ConnectionPanel
              connectionState={connectionState}
              statusMessage={statusMessage}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              isSupported={isSupported}
              portInfo={serialService.getPortInfo()}
            />

            <SerialTerminal
              logs={logs}
              onClearLogs={handleClearLogs}
              onSendRaw={handleSendRaw}
              isConnected={connectionState === 'connected'}
            />
          </div>
        )}

        {/* TAB: ARDUINO INSTRUCTIONS */}
        {(activeTab === 'arduino' || activeTab === 'protocol') && (
          <ArduinoInstructions />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-slate-200">Li-Fi Messenger</span>
            <span>·</span>
            <span>Arduino Uno & 16×2 I2C LCD Module (0x27)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Runs locally on Windows in Chrome/Edge</span>
            <span>·</span>
            <span>No Phone or Cloud Required</span>
          </div>
        </div>
      </footer>

      {/* Standalone Single-File Modal */}
      <StandaloneExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
