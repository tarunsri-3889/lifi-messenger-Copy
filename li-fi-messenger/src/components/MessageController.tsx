/**
 * Message Input Controller
 * Controls text payload (max 32 characters), send and clear triggers, and quick presets.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, CornerDownLeft, Sparkles, AlertCircle } from 'lucide-react';
import { formatMessageForLcd } from '../services/lifiProtocol';
import { ConnectionState } from '../types';

interface MessageControllerProps {
  message: string;
  setMessage: (msg: string) => void;
  onSendMessage: (msg: string) => Promise<boolean>;
  connectionState: ConnectionState;
  onConnect: () => void;
}

const PRESET_MESSAGES = [
  'HELLO ARDUINO!',
  'LI-FI TEST 01',
  'USB 9600 BAUD OK',
  '16x2 LCD ACTIVE',
  'SDA:A4  SCL:A5',
  'SYSTEM READY',
];

export const MessageController: React.FC<MessageControllerProps> = ({
  message,
  setMessage,
  onSendMessage,
  connectionState,
  onConnect,
}) => {
  const [clearOnSend, setClearOnSend] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const charCount = message.length;
  const remainingChars = 32 - charCount;
  const { line1, line2 } = formatMessageForLcd(message);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, 32);
    setMessage(val);
  };

  const handleClear = () => {
    setMessage('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    setIsSending(true);
    const success = await onSendMessage(message);
    setIsSending(false);

    if (success && clearOnSend) {
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header and Live Count */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Message Input</h2>
          <p className="text-xs text-slate-500">
            Transmits UTF-8 text with newline termination (<code className="font-mono text-slate-700">\n</code>) at 9600 baud.
          </p>
        </div>

        {/* Character Counter with visual fullness indicator */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span
            className={`font-semibold tabular-nums px-2 py-0.5 rounded border ${
              charCount === 32
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : charCount > 16
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {charCount} / 32 Chars
          </span>
          <span className="text-slate-400">({remainingChars} left)</span>
        </div>
      </div>

      {/* Main Input Field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          maxLength={32}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type message for 16x2 LCD (e.g. HELLO WORLD)..."
          className="w-full px-4 py-3 text-base sm:text-lg font-mono text-slate-900 bg-white border border-slate-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400 placeholder:font-sans"
        />

        {charCount > 0 && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
            title="Clear text"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Split preview bar showing line allocation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
        <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
          <div className="text-slate-400 mb-1 flex justify-between">
            <span>ROW 1 ALLOCATION (Chars 1–16):</span>
            <span className="text-slate-500 font-semibold">{line1.length}/16</span>
          </div>
          <div className="text-slate-900 font-bold bg-white px-2 py-1.5 rounded border border-slate-200 truncate min-h-[30px] flex items-center">
            {line1 || <span className="text-slate-400 font-normal italic">Empty row</span>}
          </div>
        </div>

        <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
          <div className="text-slate-400 mb-1 flex justify-between">
            <span>ROW 2 ALLOCATION (Chars 17–32):</span>
            <span className="text-slate-500 font-semibold">{line2.length}/16</span>
          </div>
          <div className="text-slate-900 font-bold bg-white px-2 py-1.5 rounded border border-slate-200 truncate min-h-[30px] flex items-center">
            {line2 || <span className="text-slate-400 font-normal italic">Empty row</span>}
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Quick Preset Messages</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_MESSAGES.map((preset) => (
            <button
              key={preset}
              onClick={() => setMessage(preset)}
              className="px-2.5 py-1 text-xs font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Action Controls & Options */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-xs text-slate-600 select-none cursor-pointer">
          <input
            type="checkbox"
            checked={clearOnSend}
            onChange={(e) => setClearOnSend(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Auto-clear input field after sending</span>
        </label>

        <div className="flex items-center gap-3">
          <button
            onClick={handleClear}
            disabled={charCount === 0}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded border border-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>

          {connectionState !== 'connected' ? (
            <button
              onClick={onConnect}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded shadow-sm transition-all flex items-center gap-2"
            >
              Connect to Send
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={charCount === 0 || isSending}
              className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Transmitting...' : 'Send Message'}</span>
              <span className="hidden sm:inline text-xs font-normal text-blue-200">
                [Enter]
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Disconnected Notice banner */}
      {connectionState !== 'connected' && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2.5 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold">Arduino Not Connected:</span>
            <p className="text-amber-700">
              Your preview updates instantly above. To send this text to the real 16x2 LCD over USB, click "Connect Arduino" and select your COM port.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
