/**
 * Connection & Hardware Status Panel
 * Manages USB Web Serial connection, port discovery, and hardware telemetry.
 */

import React from 'react';
import { ConnectionState } from '../types';
import {
  Usb,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  RefreshCw,
  PowerOff,
  Cpu,
} from 'lucide-react';

interface ConnectionPanelProps {
  connectionState: ConnectionState;
  statusMessage?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  isSupported: boolean;
  portInfo: any;
}

export const ConnectionPanel: React.FC<ConnectionPanelProps> = ({
  connectionState,
  statusMessage,
  onConnect,
  onDisconnect,
  isSupported,
  portInfo,
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Usb className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-900">
            Hardware Serial Link (USB)
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-500">
          Standard: 9600 Baud · 8N1
        </span>
      </div>

      {/* Browser Support Warning if not Chromium */}
      {!isSupported && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-md flex items-start gap-2 text-xs text-rose-800">
          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Web Serial API Not Supported:</span>
            <p className="mt-0.5">
              Your current browser does not support the Web Serial API. Please open this app in{' '}
              <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong> on Windows to communicate directly with your Arduino Uno over USB.
            </p>
          </div>
        </div>
      )}

      {/* Connection State Card */}
      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            {connectionState === 'connected' ? (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            ) : connectionState === 'connecting' ? (
              <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
            ) : connectionState === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            ) : (
              <div className="w-3 h-3 rounded-full bg-slate-400" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Status: {connectionState}
              </span>
              {connectionState === 'connected' && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono bg-emerald-100 text-emerald-800 rounded">
                  PORT OPEN
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {statusMessage ||
                (connectionState === 'connected'
                  ? 'Active bidirectional serial stream to Arduino Uno.'
                  : 'Arduino disconnected. Ready for USB connection at 9600 baud.')}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {connectionState === 'connected' ? (
            <button
              onClick={onDisconnect}
              className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded transition-colors flex items-center gap-1.5"
            >
              <PowerOff className="w-3.5 h-3.5" />
              Disconnect
            </button>
          ) : (
            <button
              onClick={onConnect}
              disabled={!isSupported || connectionState === 'connecting'}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded shadow-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Usb className="w-3.5 h-3.5" />
              Connect Arduino
            </button>
          )}
        </div>
      </div>

      {/* Telemetry specs grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs font-mono">
        <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-400 block uppercase">BAUD RATE</span>
          <span className="font-bold text-slate-800">9600 bps</span>
        </div>
        <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-400 block uppercase">DATA FRAMING</span>
          <span className="font-bold text-slate-800">8-N-1 / UTF-8</span>
        </div>
        <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-400 block uppercase">I2C BUS ADDR</span>
          <span className="font-bold text-slate-800">0x27 (A4/A5)</span>
        </div>
        <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-400 block uppercase">TERMINATION</span>
          <span className="font-bold text-slate-800">\n (0x0A)</span>
        </div>
      </div>

      {/* Windows Troubleshooting Quick Tip */}
      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
        <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>
          <strong>Windows Tip:</strong> If the COM port cannot be opened, ensure the <em>Arduino IDE Serial Monitor</em> is closed, as Windows COM ports are strictly single-client.
        </span>
      </div>
    </div>
  );
};
