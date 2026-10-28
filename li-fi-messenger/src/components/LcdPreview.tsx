/**
 * Visual Preview of the 16x2 I2C Character LCD
 * Realistic simulation of HD44780 / PCF8574 module with 16 columns and 2 rows
 */

import React, { useState } from 'react';
import { LcdTheme } from '../types';
import { Sun, Moon, Sparkles, Monitor } from 'lucide-react';

interface LcdPreviewProps {
  line1: string;
  line2: string;
  theme: LcdTheme;
  setTheme: (theme: LcdTheme) => void;
  backlight: boolean;
  setBacklight: (val: boolean) => void;
  cursorVisible: boolean;
  setCursorVisible: (val: boolean) => void;
  lastSentTimestamp?: string;
}

export const LcdPreview: React.FC<LcdPreviewProps> = ({
  line1,
  line2,
  theme,
  setTheme,
  backlight,
  setBacklight,
  cursorVisible,
  setCursorVisible,
  lastSentTimestamp,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  // Normalize lines to 16 characters for the visual grid
  const paddedLine1 = line1.padEnd(16, ' ').slice(0, 16);
  const paddedLine2 = line2.padEnd(16, ' ').slice(0, 16);

  // Active cursor position: directly after the last non-space character
  const cursorRow = line2.length > 0 ? 1 : 0;
  const cursorCol = line2.length > 0 ? Math.min(15, line2.length) : Math.min(15, line1.length);

  // Visual theme styles
  const themeStyles = {
    blue: {
      screenBg: backlight ? 'bg-[#002f7a]' : 'bg-[#001333]',
      charColor: backlight ? 'text-[#e0f2fe]' : 'text-[#38537a]',
      charShadow: backlight ? 'drop-shadow-[0_0_2px_rgba(186,230,253,0.8)]' : '',
      cellBg: backlight ? 'bg-[#00378f]/50' : 'bg-[#001c45]/40',
      activeCell: 'border border-cyan-400/40',
      boardBg: 'bg-slate-900',
    },
    green: {
      screenBg: backlight ? 'bg-[#738e12]' : 'bg-[#2e3b05]',
      charColor: backlight ? 'text-[#142003]' : 'text-[#1c2405]',
      charShadow: '',
      cellBg: backlight ? 'bg-[#829e16]/60' : 'bg-[#364408]/50',
      activeCell: 'border border-black/30',
      boardBg: 'bg-slate-900',
    },
    amber: {
      screenBg: backlight ? 'bg-[#854d0e]' : 'bg-[#291804]',
      charColor: backlight ? 'text-[#fef08a]' : 'text-[#713f12]',
      charShadow: backlight ? 'drop-shadow-[0_0_2px_rgba(254,240,138,0.8)]' : '',
      cellBg: backlight ? 'bg-[#9a5b12]/50' : 'bg-[#3b2207]/40',
      activeCell: 'border border-amber-300/40',
      boardBg: 'bg-slate-900',
    },
  }[theme];

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      {/* Panel Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-900">
            16×2 Character LCD Preview (I2C 0x27)
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            · 32 Chars (2 Rows × 16 Cols)
          </span>
        </div>

        {/* Display Controls */}
        <div className="flex items-center gap-3">
          {/* Backlight Theme Selector */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded p-0.5">
            <button
              onClick={() => setTheme('blue')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                theme === 'blue'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Modern White on Blue Backlight"
            >
              Navy Blue
            </button>
            <button
              onClick={() => setTheme('green')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                theme === 'green'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Classic Yellow-Green LCD"
            >
              Yellow-Green
            </button>
          </div>

          {/* Backlight Power Toggle */}
          <button
            onClick={() => setBacklight(!backlight)}
            className={`p-1.5 text-xs font-medium rounded border transition-colors flex items-center gap-1 ${
              backlight
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
            }`}
            title={backlight ? 'Turn Backlight Off' : 'Turn Backlight On'}
          >
            {backlight ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span className="text-[11px] font-mono">{backlight ? 'LIGHT ON' : 'LIGHT OFF'}</span>
          </button>

          {/* Cursor Toggle */}
          <button
            onClick={() => setCursorVisible(!cursorVisible)}
            className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors ${
              cursorVisible
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
            }`}
          >
            CURSOR: {cursorVisible ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Physical Hardware Frame Simulation */}
      <div className="p-6 sm:p-8 bg-slate-950 flex flex-col items-center justify-center">
        {/* PCB Board Container */}
        <div className="relative w-full max-w-2xl bg-[#091b33] rounded-lg p-5 sm:p-7 border border-slate-700 shadow-2xl">
          {/* 4 Corner Screw Holes with Brass Ring Details */}
          <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 rounded-full bg-slate-800 border border-amber-600/70 flex items-center justify-center shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          </div>
          <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 rounded-full bg-slate-800 border border-amber-600/70 flex items-center justify-center shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          </div>
          <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 rounded-full bg-slate-800 border border-amber-600/70 flex items-center justify-center shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          </div>
          <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 rounded-full bg-slate-800 border border-amber-600/70 flex items-center justify-center shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          </div>

          {/* PCB Traces & Header Labels */}
          <div className="flex justify-between items-center mb-3 text-[10px] font-mono text-slate-400">
            <span className="tracking-widest">1602A I2C MODULE · PCF8574</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">ADDR: 0x27</span>
              <span>·</span>
              <span className="text-blue-400">9600 BAUD</span>
            </div>
          </div>

          {/* Metallic Bezel Rim */}
          <div className="bg-[#1e293b] p-3 sm:p-4 rounded border-2 border-slate-600 shadow-inner">
            {/* Inner LCD Glass Window */}
            <div
              className={`relative ${themeStyles.screenBg} transition-colors duration-200 rounded p-3 sm:p-4 shadow-inset overflow-x-auto`}
              style={{
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.6)',
              }}
            >
              {/* Subtle glass reflection gradient */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                aria-hidden="true"
              />

              {/* Row 1: 16 Character Cells */}
              <div className="flex justify-between gap-1 mb-2">
                {paddedLine1.split('').map((char, colIdx) => {
                  const isCursor = cursorVisible && cursorRow === 0 && cursorCol === colIdx;
                  return (
                    <div
                      key={`r0-c${colIdx}`}
                      onMouseEnter={() => setHoveredCell({ row: 0, col: colIdx })}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`relative flex-1 aspect-[5/8] min-w-[14px] sm:min-w-[20px] max-w-[26px] ${themeStyles.cellBg} rounded-xs flex items-center justify-center transition-all select-none`}
                    >
                      <span
                        className={`font-mono text-sm sm:text-lg font-bold leading-none ${themeStyles.charColor} ${themeStyles.charShadow}`}
                        style={{ fontFamily: '"JetBrains Mono", monospace' }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                      {isCursor && (
                        <span className="absolute bottom-0.5 inset-x-0.5 h-0.5 bg-cyan-300 animate-pulse" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Row 2: 16 Character Cells */}
              <div className="flex justify-between gap-1">
                {paddedLine2.split('').map((char, colIdx) => {
                  const isCursor = cursorVisible && cursorRow === 1 && cursorCol === colIdx;
                  return (
                    <div
                      key={`r1-c${colIdx}`}
                      onMouseEnter={() => setHoveredCell({ row: 1, col: colIdx })}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`relative flex-1 aspect-[5/8] min-w-[14px] sm:min-w-[20px] max-w-[26px] ${themeStyles.cellBg} rounded-xs flex items-center justify-center transition-all select-none`}
                    >
                      <span
                        className={`font-mono text-sm sm:text-lg font-bold leading-none ${themeStyles.charColor} ${themeStyles.charShadow}`}
                        style={{ fontFamily: '"JetBrains Mono", monospace' }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                      {isCursor && (
                        <span className="absolute bottom-0.5 inset-x-0.5 h-0.5 bg-cyan-300 animate-pulse" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Module Subtitle & Pin Header Visual */}
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-semibold">I2C PINS:</span>
              <span>GND · VCC (+5V) · SDA (A4) · SCL (A5)</span>
            </div>
            {hoveredCell ? (
              <span className="text-blue-300">
                Cell: Row {hoveredCell.row + 1}, Col {hoveredCell.col + 1} (
                {hoveredCell.row === 0 ? hoveredCell.col : 16 + hoveredCell.col}/32)
              </span>
            ) : (
              <span>Physical Address 0x27</span>
            )}
          </div>
        </div>
      </div>

      {/* Row breakdown info strip */}
      <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
        <div className="flex items-center gap-4 font-mono">
          <div>
            <span className="text-slate-400">ROW 1 (Chars 1-16):</span>{' '}
            <span className="font-semibold text-slate-800">
              "{line1.slice(0, 16) || '(empty)'}"
            </span>
          </div>
          <div>
            <span className="text-slate-400">ROW 2 (Chars 17-32):</span>{' '}
            <span className="font-semibold text-slate-800">
              "{line2.slice(0, 16) || '(empty)'}"
            </span>
          </div>
        </div>

        {lastSentTimestamp && (
          <div className="text-slate-500 font-mono">
            Last Transmitted: {lastSentTimestamp}
          </div>
        )}
      </div>
    </div>
  );
};
