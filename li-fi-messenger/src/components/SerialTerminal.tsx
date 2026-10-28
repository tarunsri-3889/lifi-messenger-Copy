/**
 * Live Serial Terminal & Telemetry Monitor
 * Logs all bidirectional USB serial communication (TX packets, RX responses, system events)
 */

import React, { useState, useRef, useEffect } from 'react';
import { SerialLogEntry } from '../types';
import {
  Terminal,
  Trash2,
  Copy,
  Check,
  ArrowUpRight,
  ArrowDownLeft,
  Info,
  AlertCircle,
  Pause,
  Play,
  Send,
} from 'lucide-react';

interface SerialTerminalProps {
  logs: SerialLogEntry[];
  onClearLogs: () => void;
  onSendRaw: (raw: string) => Promise<boolean>;
  isConnected: boolean;
}

export const SerialTerminal: React.FC<SerialTerminalProps> = ({
  logs,
  onClearLogs,
  onSendRaw,
  isConnected,
}) => {
  const [filter, setFilter] = useState<'all' | 'tx' | 'rx'>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new logs arrive
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.type === filter;
  });

  const handleCopyLogs = () => {
    const text = logs
      .map((l) => `[${l.timestamp}] [${l.type.toUpperCase()}] ${l.data}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    await onSendRaw(manualInput);
    setManualInput('');
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
      {/* Terminal Title Bar */}
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold tracking-tight">
            Serial Telemetry Monitor (COM Port)
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {logs.length} events logged
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Filter Segmented Control */}
          <div className="flex items-center bg-slate-800 rounded p-0.5 border border-slate-700 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-0.5 rounded transition-colors ${
                filter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('tx')}
              className={`px-2 py-0.5 rounded transition-colors ${
                filter === 'tx' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              TX Only
            </button>
            <button
              onClick={() => setFilter('rx')}
              className={`px-2 py-0.5 rounded transition-colors ${
                filter === 'rx' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              RX Only
            </button>
          </div>

          {/* Auto-scroll toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1.5 rounded border border-slate-700 text-xs transition-colors ${
              autoScroll ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
            }`}
            title={autoScroll ? 'Auto-scroll Enabled' : 'Auto-scroll Paused'}
          >
            {autoScroll ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Copy logs */}
          <button
            onClick={handleCopyLogs}
            disabled={logs.length === 0}
            className="p-1.5 rounded border border-slate-700 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-40"
            title="Copy all serial logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Clear logs */}
          <button
            onClick={onClearLogs}
            disabled={logs.length === 0}
            className="p-1.5 rounded border border-slate-700 text-xs text-slate-300 hover:text-rose-400 hover:bg-slate-800 transition-colors disabled:opacity-40"
            title="Clear serial logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Log Window */}
      <div
        ref={logContainerRef}
        className="flex-1 bg-slate-950 p-4 font-mono text-xs overflow-y-auto space-y-1.5 text-slate-300 select-text"
      >
        {filteredLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12">
            <Terminal className="w-8 h-8 mb-2 opacity-40 text-slate-400" />
            <p>Serial monitor is empty.</p>
            <p className="text-[11px] text-slate-600 mt-1">
              Connect to Arduino and send a message to observe physical USB data exchange.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            return (
              <div
                key={log.id}
                className="flex items-start gap-2.5 py-0.5 border-b border-slate-900/60 leading-relaxed hover:bg-slate-900/40 px-1 rounded"
              >
                {/* Timestamp */}
                <span className="text-slate-500 tabular-nums shrink-0 select-none">
                  {log.timestamp}
                </span>

                {/* Packet Type Indicator */}
                {log.type === 'tx' ? (
                  <span className="text-blue-400 font-bold flex items-center gap-1 shrink-0">
                    <ArrowUpRight className="w-3 h-3" />
                    [TX]
                  </span>
                ) : log.type === 'rx' ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                    <ArrowDownLeft className="w-3 h-3" />
                    [RX]
                  </span>
                ) : log.type === 'error' ? (
                  <span className="text-rose-400 font-bold flex items-center gap-1 shrink-0">
                    <AlertCircle className="w-3 h-3" />
                    [ERR]
                  </span>
                ) : log.type === 'warning' ? (
                  <span className="text-amber-400 font-bold flex items-center gap-1 shrink-0">
                    [WARN]
                  </span>
                ) : (
                  <span className="text-slate-400 font-bold flex items-center gap-1 shrink-0">
                    <Info className="w-3 h-3" />
                    [SYS]
                  </span>
                )}

                {/* Message Data */}
                <span
                  className={`flex-1 break-all ${
                    log.type === 'tx'
                      ? 'text-cyan-200'
                      : log.type === 'rx'
                      ? 'text-emerald-300'
                      : log.type === 'error'
                      ? 'text-rose-300'
                      : log.type === 'warning'
                      ? 'text-amber-300'
                      : 'text-slate-400'
                  }`}
                >
                  {log.data}
                </span>

                {/* Byte Count Tag */}
                {log.bytesCount !== undefined && (
                  <span className="text-slate-500 text-[10px] shrink-0 tabular-nums">
                    {log.bytesCount}B
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Manual Serial Send Bar at bottom */}
      <form
        onSubmit={handleManualSend}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
      >
        <span className="text-xs font-mono text-slate-400 shrink-0">
          Raw Serial TX:
        </span>
        <input
          type="text"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          placeholder={
            isConnected
              ? 'Send raw text or command directly to Arduino at 9600 baud...'
              : 'Connect Arduino first to send raw serial commands'
          }
          disabled={!isConnected}
          className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 disabled:opacity-40"
        />
        <button
          type="submit"
          disabled={!isConnected || !manualInput.trim()}
          className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded flex items-center gap-1 transition-colors"
        >
          <Send className="w-3 h-3" />
          Send
        </button>
      </form>
    </div>
  );
};
