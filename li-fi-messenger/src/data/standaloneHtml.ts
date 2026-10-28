/**
 * Standalone Single-File Version (Pure HTML, CSS, JavaScript)
 *
 * This enables the user to run Li-Fi Messenger on any Windows laptop
 * simply by saving this as an `index.html` file and opening it in Chrome or Edge,
 * with zero build tools, node_modules, or servers required!
 */

export const STANDALONE_HTML_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Li-Fi Messenger - Arduino 16x2 LCD Serial Controller</title>
  <style>
    :root {
      --navy-900: #0a192f;
      --navy-800: #112240;
      --navy-700: #233554;
      --blue-600: #2563eb;
      --blue-500: #3b82f6;
      --slate-100: #f1f5f9;
      --slate-200: #e2e8f0;
      --slate-300: #cbd5e1;
      --slate-600: #475569;
      --slate-800: #1e293b;
      --lcd-blue-bg: #002f7a;
      --lcd-blue-char: #e0f2fe;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      line-height: 1.5;
    }

    /* Top Bar */
    header {
      background: #0f172a;
      color: white;
      padding: 0 1.5rem;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #1e293b;
    }
    .brand {
      font-weight: 700;
      font-size: 1.15rem;
      letter-spacing: -0.02em;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .badge-specs {
      font-family: monospace;
      font-size: 0.75rem;
      color: #94a3b8;
    }

    /* Layout */
    .container {
      max-width: 1080px;
      margin: 1.5rem auto;
      padding: 0 1rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .card {
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .card-header {
      padding: 0.75rem 1.25rem;
      background: #f8fafc;
      border-bottom: 1px solid var(--slate-200);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .card-body {
      padding: 1.25rem;
    }

    /* 16x2 LCD Bezel Simulation */
    .lcd-hardware-frame {
      background: #091b33;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 1.25rem;
      position: relative;
    }
    .screw {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #1e293b;
      border: 1px solid #b45309;
      position: absolute;
    }
    .screw.tl { top: 8px; left: 8px; }
    .screw.tr { top: 8px; right: 8px; }
    .screw.bl { bottom: 8px; left: 8px; }
    .screw.br { bottom: 8px; right: 8px; }

    .lcd-bezel {
      background: #1e293b;
      border: 2px solid #475569;
      border-radius: 4px;
      padding: 0.75rem;
    }
    .lcd-screen {
      background: var(--lcd-blue-bg);
      border-radius: 4px;
      padding: 0.75rem 0.5rem;
      box-shadow: inset 0 2px 6px rgba(0,0,0,0.6);
    }
    .lcd-row {
      display: flex;
      justify-content: space-between;
      gap: 2px;
      margin-bottom: 6px;
    }
    .lcd-row:last-child { margin-bottom: 0; }
    .lcd-cell {
      flex: 1;
      aspect-ratio: 5 / 8;
      background: rgba(0, 55, 143, 0.5);
      border-radius: 1px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "Courier New", Courier, monospace;
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--lcd-blue-char);
      text-shadow: 0 0 3px rgba(224, 242, 254, 0.8);
      user-select: none;
    }

    /* Inputs & Buttons */
    .input-group {
      margin-bottom: 1rem;
    }
    .input-label-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.4rem;
      font-size: 0.85rem;
      font-weight: 500;
    }
    .char-badge {
      font-family: monospace;
      font-size: 0.8rem;
      background: var(--slate-100);
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      border: 1px solid var(--slate-200);
    }
    input[type="text"] {
      width: 100%;
      padding: 0.75rem 1rem;
      font-family: monospace;
      font-size: 1.1rem;
      border: 1px solid var(--slate-300);
      border-radius: 6px;
      outline: none;
    }
    input[type="text"]:focus {
      border-color: var(--blue-500);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .btn-row {
      display: flex;
      gap: 0.75rem;
      margin-top: 1rem;
      align-items: center;
      justify-content: flex-end;
    }
    button {
      padding: 0.6rem 1.25rem;
      font-size: 0.85rem;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      border: none;
      transition: all 0.15s ease;
    }
    .btn-primary { background: var(--blue-600); color: white; }
    .btn-primary:hover { background: var(--blue-500); }
    .btn-secondary { background: var(--slate-100); color: var(--slate-800); border: 1px solid var(--slate-200); }
    .btn-secondary:hover { background: var(--slate-200); }
    .btn-danger { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .btn-danger:hover { background: #fecaca; }

    /* Serial Monitor */
    .terminal-body {
      background: #020617;
      color: #94a3b8;
      font-family: monospace;
      font-size: 0.8rem;
      height: 220px;
      overflow-y: auto;
      padding: 0.75rem;
    }
    .term-line { margin-bottom: 0.25rem; word-break: break-all; }
    .term-tx { color: #38bdf8; }
    .term-rx { color: #4ade80; }
    .term-err { color: #f87171; }
    .term-info { color: #94a3b8; }

    /* Status indicator */
    .status-strip {
      padding: 0.75rem 1.25rem;
      background: #f8fafc;
      border-radius: 6px;
      border: 1px solid var(--slate-200);
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      font-size: 0.85rem;
    }
    .status-dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #94a3b8;
      margin-right: 6px;
    }
    .status-dot.connected { background: #22c55e; box-shadow: 0 0 6px #22c55e; }
  </style>
</head>
<body>

  <header>
    <div class="brand">
      <span>Li-Fi Messenger</span>
    </div>
    <div class="badge-specs">
      USB Web Serial · 9600 Baud · 16x2 I2C LCD (0x27)
    </div>
  </header>

  <div class="container">
    <!-- Hardware Link Bar -->
    <div class="status-strip">
      <div>
        <span id="statusDot" class="status-dot"></span>
        <span id="statusText">Status: Disconnected</span>
      </div>
      <div>
        <button id="connectBtn" class="btn-primary" onclick="toggleConnection()">Connect Arduino</button>
      </div>
    </div>

    <!-- 16x2 LCD Screen Preview -->
    <div class="card">
      <div class="card-header">
        <span>16x2 Character LCD Preview (I2C 0x27)</span>
        <span style="font-family: monospace; font-size: 0.75rem; color: #64748b;">Row 1 & Row 2</span>
      </div>
      <div class="card-body">
        <div class="lcd-hardware-frame">
          <div class="screw tl"></div>
          <div class="screw tr"></div>
          <div class="screw bl"></div>
          <div class="screw br"></div>
          <div class="lcd-bezel">
            <div class="lcd-screen">
              <div id="lcdRow0" class="lcd-row"></div>
              <div id="lcdRow1" class="lcd-row"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message Controls -->
    <div class="card">
      <div class="card-header">
        <span>Message Controller</span>
      </div>
      <div class="card-body">
        <div class="input-group">
          <div class="input-label-row">
            <span>Message (Max 32 characters for 16x2 display):</span>
            <span id="charCount" class="char-badge">0 / 32</span>
          </div>
          <input
            type="text"
            id="msgInput"
            maxlength="32"
            placeholder="Type message for Arduino LCD..."
            oninput="handleInput(this.value)"
            onkeydown="if(event.key === 'Enter') sendMessage()"
          />
        </div>

        <div class="btn-row">
          <button class="btn-secondary" onclick="clearMessage()">Clear</button>
          <button class="btn-primary" onclick="sendMessage()">Send Message</button>
        </div>
      </div>
    </div>

    <!-- Serial Monitor -->
    <div class="card">
      <div class="card-header">
        <span>USB Serial Monitor (9600 Baud)</span>
        <button class="btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="clearLogs()">Clear Log</button>
      </div>
      <div id="terminal" class="terminal-body">
        <div class="term-line term-info">[SYSTEM] Li-Fi Messenger initialized. Ready for Web Serial.</div>
      </div>
    </div>
  </div>

  <script>
    let port = null;
    let writer = null;
    let reader = null;
    let isConnected = false;

    // Build the 16 cells for each row in DOM
    const row0 = document.getElementById('lcdRow0');
    const row1 = document.getElementById('lcdRow1');
    for (let i = 0; i < 16; i++) {
      const c0 = document.createElement('div');
      c0.className = 'lcd-cell';
      c0.id = 'c0_' + i;
      c0.innerHTML = '&nbsp;';
      row0.appendChild(c0);

      const c1 = document.createElement('div');
      c1.className = 'lcd-cell';
      c1.id = 'c1_' + i;
      c1.innerHTML = '&nbsp;';
      row1.appendChild(c1);
    }

    function updateLcd(text) {
      const line1 = text.slice(0, 16).padEnd(16, ' ');
      const line2 = text.slice(16, 32).padEnd(16, ' ');
      for (let i = 0; i < 16; i++) {
        document.getElementById('c0_' + i).innerHTML = line1[i] === ' ' ? '&nbsp;' : line1[i];
        document.getElementById('c1_' + i).innerHTML = line2[i] === ' ' ? '&nbsp;' : line2[i];
      }
    }

    function handleInput(val) {
      document.getElementById('charCount').innerText = val.length + ' / 32';
      updateLcd(val);
    }

    function clearMessage() {
      document.getElementById('msgInput').value = '';
      handleInput('');
      document.getElementById('msgInput').focus();
    }

    function log(type, msg) {
      const term = document.getElementById('terminal');
      const time = new Date().toLocaleTimeString();
      const div = document.createElement('div');
      div.className = 'term-line term-' + type;
      div.innerText = '[' + time + '] [' + type.toUpperCase() + '] ' + msg;
      term.appendChild(div);
      term.scrollTop = term.scrollHeight;
    }

    function clearLogs() {
      document.getElementById('terminal').innerHTML = '';
    }

    async function toggleConnection() {
      if (isConnected) {
        disconnectArduino();
      } else {
        connectArduino();
      }
    }

    async function connectArduino() {
      if (!('serial' in navigator)) {
        alert('Web Serial API is not supported in this browser. Please open this page in Google Chrome or Microsoft Edge.');
        log('err', 'Web Serial API unsupported in current browser');
        return;
      }
      try {
        log('info', 'Requesting serial port at 9600 baud...');
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600, dataBits: 8, stopBits: 1, parity: 'none' });
        isConnected = true;
        document.getElementById('statusDot').className = 'status-dot connected';
        document.getElementById('statusText').innerText = 'Status: Connected to Arduino Uno (9600 baud)';
        document.getElementById('connectBtn').className = 'btn-danger';
        document.getElementById('connectBtn').innerText = 'Disconnect';
        log('info', 'Serial connection established at 9600 baud.');
        readLoop();
      } catch (err) {
        log('err', 'Connection failed: ' + err.message);
      }
    }

    async function readLoop() {
      const decoder = new TextDecoder();
      let buffer = '';
      while (port && port.readable && isConnected) {
        try {
          reader = port.readable.getReader();
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            if (value) {
              buffer += decoder.decode(value);
              if (buffer.includes('\\n')) {
                const parts = buffer.split('\\n');
                buffer = parts.pop();
                for (const p of parts) {
                  if (p.trim()) log('rx', p.trim());
                }
              }
            }
          }
        } catch (err) {
          if (isConnected) log('err', 'Read error: ' + err.message);
          break;
        } finally {
          if (reader) {
            reader.releaseLock();
            reader = null;
          }
        }
      }
    }

    async function sendMessage() {
      const text = document.getElementById('msgInput').value;
      if (!text) return;
      if (!isConnected || !port || !port.writable) {
        log('err', 'Cannot send: Arduino is not connected. Click "Connect Arduino" first.');
        return;
      }
      try {
        writer = port.writable.getWriter();
        const encoder = new TextEncoder();
        await writer.write(encoder.encode(text + '\\n'));
        writer.releaseLock();
        writer = null;
        log('tx', text);
      } catch (err) {
        if (writer) {
          try { writer.releaseLock(); } catch(e) {}
          writer = null;
        }
        log('err', 'Write failed: ' + err.message);
      }
    }

    async function disconnectArduino() {
      isConnected = false;
      if (reader) {
        try { await reader.cancel(); } catch(e) {}
      }
      if (port) {
        try { await port.close(); } catch(e) {}
        port = null;
      }
      document.getElementById('statusDot').className = 'status-dot';
      document.getElementById('statusText').innerText = 'Status: Disconnected';
      document.getElementById('connectBtn').className = 'btn-primary';
      document.getElementById('connectBtn').innerText = 'Connect Arduino';
      log('info', 'Serial port disconnected.');
    }
  </script>
</body>
</html>`;
