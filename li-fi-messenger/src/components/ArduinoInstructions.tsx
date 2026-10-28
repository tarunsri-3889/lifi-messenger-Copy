/**
 * Arduino Setup, Wiring Diagram, C++ (.ino) Code, and Local Windows Guide
 */

import React, { useState } from 'react';
import { ARDUINO_SKETCH_INO, WIRING_PINOUT, WINDOWS_SETUP_STEPS } from '../data/arduinoCode';
import {
  Code,
  Copy,
  Check,
  Download,
  Cpu,
  Layers,
  HelpCircle,
  ExternalLink,
  Info,
  Radio,
  Lightbulb,
} from 'lucide-react';

export const ArduinoInstructions: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeSection, setActiveSection] = useState<'code' | 'wiring' | 'windows' | 'lifi'>('code');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ARDUINO_SKETCH_INO);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadIno = () => {
    const blob = new Blob([ARDUINO_SKETCH_INO], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LiFi_Messenger_Arduino.ino';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      {/* Subnav header */}
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-900">
            Hardware & Arduino Integration Guide
          </h2>
        </div>

        {/* Segmented Tab Bar */}
        <div className="flex items-center bg-white border border-slate-200 rounded p-0.5 text-xs">
          <button
            onClick={() => setActiveSection('code')}
            className={`px-3 py-1 font-medium rounded transition-colors ${
              activeSection === 'code' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Arduino (.ino) Sketch
          </button>
          <button
            onClick={() => setActiveSection('wiring')}
            className={`px-3 py-1 font-medium rounded transition-colors ${
              activeSection === 'wiring' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            I2C Wiring Pinout
          </button>
          <button
            onClick={() => setActiveSection('windows')}
            className={`px-3 py-1 font-medium rounded transition-colors ${
              activeSection === 'windows' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Local Windows Setup
          </button>
          <button
            onClick={() => setActiveSection('lifi')}
            className={`px-3 py-1 font-medium rounded transition-colors ${
              activeSection === 'lifi' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Modular Li-Fi Roadmap
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* TAB 1: ARDUINO INO SKETCH */}
        {activeSection === 'code' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Arduino Uno + 16x2 I2C LCD Source Code
                </h3>
                <p className="text-xs text-slate-500">
                  Pre-configured for I2C address <code className="font-mono text-slate-800">0x27</code>, 9600 baud, 32-character buffer, and automatic 2-line splitting.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadIno}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  Download .ino
                </button>
                <button
                  onClick={handleCopyCode}
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
            </div>

            {/* Code Display */}
            <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
              <div className="px-4 py-2 bg-slate-900 text-slate-400 font-mono text-[11px] flex justify-between items-center border-b border-slate-800">
                <span>LiFi_Messenger_Arduino.ino</span>
                <span>C++ / Arduino Uno</span>
              </div>
              <pre className="p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-[480px] leading-relaxed selection:bg-blue-800">
                <code>{ARDUINO_SKETCH_INO}</code>
              </pre>
            </div>
          </div>
        )}

        {/* TAB 2: WIRING PINOUT */}
        {activeSection === 'wiring' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Hardware Connections: Arduino Uno to 16x2 I2C LCD
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                The 1602 LCD module uses a 4-pin PCF8574 I2C backpack. Only 4 jumper wires are required.
              </p>
            </div>

            {/* Pinout Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 text-slate-700 uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">I2C LCD Pin</th>
                    <th className="px-4 py-3">Arduino Uno Pin</th>
                    <th className="px-4 py-3">Function / Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {WIRING_PINOUT.map((item) => (
                    <tr key={item.pin} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-blue-700">{item.pin}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900 bg-blue-50/50">
                        {item.target}
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-sans">{item.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Critical Potentiometer Note */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3 text-xs text-amber-900">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Essential Contrast Adjustment:</span>
                <p className="mt-1 leading-relaxed">
                  Almost all new 16x2 I2C LCDs ship with the blue contrast trimmer pot turned fully to zero or max, resulting in a blank blue screen or solid white blocks. Use a small screwdriver to turn the blue potentiometer on the back of the LCD until characters appear crisp and sharp.
                </p>
              </div>
            </div>

            {/* Address 0x27 Verification */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
              <span className="font-semibold text-slate-800">Why Address 0x27?</span>
              <p className="text-slate-600 leading-relaxed">
                Standard PCF8574 backpack chips (marked PCF8574T) use factory I2C address <code className="font-mono text-slate-800 font-bold">0x27</code>. (Backpacks marked PCF8574AT use 0x3F). Your sketch is configured specifically for <code className="font-mono text-slate-800 font-bold">0x27</code>.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: LOCAL WINDOWS SETUP */}
        {activeSection === 'windows' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                How to Run Li-Fi Messenger Locally on Windows
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                No phone, no Bluetooth, and no cloud server required. Direct local USB connection via Chrome or Edge.
              </p>
            </div>

            {/* Step-by-step checklist */}
            <div className="space-y-3">
              {WINDOWS_SETUP_STEPS.map((step) => (
                <div
                  key={step.step}
                  className="p-4 rounded-lg border border-slate-200 bg-white flex items-start gap-3.5 hover:border-blue-200 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold font-mono text-xs flex items-center justify-center shrink-0">
                    {step.step}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-slate-900">{step.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Browser security notice */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-600" />
                Windows USB Security Requirements:
              </span>
              <p className="leading-relaxed text-blue-800">
                Web Serial is a W3C web standard supported out-of-the-box in Google Chrome and Microsoft Edge on Windows 10 & 11. It operates securely on <code className="font-mono bg-blue-100 px-1 py-0.5 rounded">localhost</code> or HTTPS origins. You do not need to install browser plugins or bridge software.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: MODULAR LIFI ROADMAP */}
        {activeSection === 'lifi' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Modular Architecture: Current Release & Optical Li-Fi Roadmap
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Engineered with modular abstraction boundaries so future optical transmission plugs in without altering the messaging engine.
              </p>
            </div>

            {/* Clear Status Notice as instructed */}
            <div className="p-4 bg-slate-900 text-white rounded-lg space-y-2 border border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Radio className="w-4 h-4" />
                <span>Current Implementation Scope</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Phase 1 (Active):</strong> USB Serial Communication to Arduino Uno and 16×2 I2C LCD display module. Real physical byte transfer occurs over the USB cable at 9600 baud.
              </p>
              <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700 text-xs text-amber-200">
                <strong>Clarification Note:</strong> Optical Li-Fi (free-space light pulse modulation) is <strong>not yet claimed as physically implemented</strong> in this release. The codebase and Arduino firmware have been modularized specifically so that Phase 2 can swap in an optical transceiver without refactoring the display or web UI.
              </div>
            </div>

            {/* Architecture layers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-[10px] text-slate-400 uppercase">LAYER 1</div>
                <div className="font-bold text-slate-900">Web Application & UI</div>
                <p className="text-slate-600 font-sans text-xs">
                  Message input (32 chars max), character formatting, 16x2 LCD preview simulator, and serial telemetry monitor.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 space-y-2">
                <div className="text-[10px] text-blue-500 uppercase">LAYER 2 (MODULAR)</div>
                <div className="font-bold text-blue-900">Protocol Framing Layer</div>
                <p className="text-blue-800 font-sans text-xs">
                  Encapsulates UTF-8 payload with newline termination. Modular hooks ready for future Manchester encoding or pulse-width keying.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-[10px] text-slate-400 uppercase">LAYER 3</div>
                <div className="font-bold text-slate-900">Physical Transceiver</div>
                <p className="text-slate-600 font-sans text-xs">
                  <strong>Now:</strong> USB Serial CDC (9600 baud) to 16x2 I2C LCD.<br />
                  <strong>Future Phase 2:</strong> High-power White LED transmitter to LDR optical sensor receiver.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
