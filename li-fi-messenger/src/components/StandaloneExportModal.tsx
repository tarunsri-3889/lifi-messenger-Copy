/**
 * Standalone Source Code Export Modal
 * Allows user to view or download a complete single-file HTML version of Li-Fi Messenger.
 */

import React, { useState } from 'react';
import { STANDALONE_HTML_CODE } from '../data/standaloneHtml';
import { X, Download, Copy, Check, FileCode, CheckCircle2 } from 'lucide-react';

interface StandaloneExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneExportModal: React.FC<StandaloneExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(STANDALONE_HTML_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([STANDALONE_HTML_CODE], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lifi-messenger.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Single-File HTML Export (Zero Dependencies)
              </h3>
              <p className="text-xs text-slate-500">
                Standalone HTML + CSS + JS file. Double-click or open in Chrome/Edge on Windows.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Contains 100% self-contained HTML, CSS, and Web Serial API JavaScript.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 font-medium flex items-center gap-1 shadow-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium flex items-center gap-1 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download .html
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 p-4 bg-slate-950 overflow-y-auto font-mono text-xs text-slate-300">
          <pre className="leading-relaxed">
            <code>{STANDALONE_HTML_CODE}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
