/**
 * Li-Fi Messenger Top Navigation Bar
 * Follows strict 3-zone contract:
 * Zone 1: Wordmark brand
 * Zone 2: Navigation anchor links
 * Zone 3: Connection status CTA
 */

import React from 'react';
import { ConnectionState } from '../types';
import { Radio, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface NavbarProps {
  connectionState: ConnectionState;
  onConnect: () => void;
  onDisconnect: () => void;
  activeTab: 'controller' | 'terminal' | 'arduino' | 'protocol';
  setActiveTab: (tab: 'controller' | 'terminal' | 'arduino' | 'protocol') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  connectionState,
  onConnect,
  onDisconnect,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              Li-Fi Messenger
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('controller')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'controller'
                ? 'text-white border-b-2 border-blue-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            LCD Controller
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'terminal'
                ? 'text-white border-b-2 border-blue-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Serial Monitor
          </button>
          <button
            onClick={() => setActiveTab('arduino')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'arduino'
                ? 'text-white border-b-2 border-blue-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Arduino Setup & Code
          </button>
          <button
            onClick={() => setActiveTab('protocol')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'protocol'
                ? 'text-white border-b-2 border-blue-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Li-Fi Architecture
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {connectionState === 'connected' ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                COM Connected · 9600
              </span>
              <button
                onClick={onDisconnect}
                className="px-3.5 py-1.5 text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 rounded transition-colors whitespace-nowrap"
              >
                Disconnect
              </button>
            </div>
          ) : connectionState === 'connecting' ? (
            <button
              disabled
              className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 rounded flex items-center gap-2 cursor-wait whitespace-nowrap"
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Opening Port...
            </button>
          ) : (
            <button
              onClick={onConnect}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded transition-colors shadow-sm whitespace-nowrap flex items-center gap-2"
            >
              <Radio className="w-3.5 h-3.5" />
              Connect Arduino
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
