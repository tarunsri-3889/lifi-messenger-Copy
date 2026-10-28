/**
 * Complete, Tested Arduino C++ (.ino) Code for Arduino Uno + 16x2 I2C LCD
 * Address: 0x27
 * SDA: A4, SCL: A5, 5V, GND
 * Baud: 9600
 */

export const ARDUINO_SKETCH_INO = `/*
  ==============================================================
  Li-Fi Messenger - Arduino Uno 16x2 I2C LCD Display Controller
  ==============================================================
  Hardware:
    - Microcontroller : Arduino Uno R3 (ATmega328P)
    - Display         : 16x2 Character LCD with PCF8574 I2C Backpack
    - I2C Address     : 0x27 (Default for PCF8574T)
    - I2C Connections : SDA -> A4, SCL -> A5, VCC -> 5V, GND -> GND
    - Baud Rate       : 9600 baud (8-N-1)
    - Message Delim   : Newline '\\n' (0x0A)
    - Max Length      : 32 characters (16 characters per row)

  Future Li-Fi Upgrade:
    This code includes modular hook functions for Phase 2:
    Optical LED pulse transmission and LDR optical receiver decoding.
  ==============================================================
*/

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Initialize 16x2 LCD at I2C address 0x27
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Serial receive buffer (32 chars + 1 null terminator)
const int MAX_MSG_LENGTH = 32;
char serialBuffer[MAX_MSG_LENGTH + 1];
int bufferIndex = 0;

// LED Status Indicator (Pin 13 onboard LED)
const int STATUS_LED_PIN = 13;

void setup() {
  pinMode(STATUS_LED_PIN, OUTPUT);
  digitalWrite(STATUS_LED_PIN, LOW);

  // Initialize Hardware Serial at 9600 baud
  Serial.begin(9600);
  while (!Serial) {
    ; // Wait for serial port to connect (native USB boards)
  }

  // Initialize 16x2 I2C LCD
  lcd.init();
  lcd.backlight();
  lcd.clear();

  // Startup splash screen
  lcd.setCursor(0, 0);
  lcd.print("Li-Fi Messenger");
  lcd.setCursor(0, 1);
  lcd.print("Waiting USB Data");

  // Send ready handshake back over USB Serial
  Serial.println("OK:Arduino Ready (9600 baud, LCD 0x27)");
}

void loop() {
  // Listen for incoming serial bytes from laptop Web Serial
  while (Serial.available() > 0) {
    char inChar = (char)Serial.read();

    // Check for frame delimiter: Newline '\\n' or Carriage Return '\\r'
    if (inChar == '\\n' || inChar == '\\r') {
      if (bufferIndex > 0) {
        serialBuffer[bufferIndex] = '\\0'; // Null-terminate string
        processMessage(serialBuffer);
        bufferIndex = 0; // Reset buffer for next packet
      }
    } else {
      // Accumulate up to 32 characters
      if (bufferIndex < MAX_MSG_LENGTH) {
        serialBuffer[bufferIndex] = inChar;
        bufferIndex++;
      }
      // If client sends more than 32 characters without newline, ignore overflow safely
    }
  }
}

/**
 * Format and render message across two 16-character rows
 */
void processMessage(const char* message) {
  // Blink status LED upon packet arrival
  digitalWrite(STATUS_LED_PIN, HIGH);

  lcd.clear();

  int len = strlen(message);
  char line1[17];
  char line2[17];

  // Initialize empty buffers
  memset(line1, 0, sizeof(line1));
  memset(line2, 0, sizeof(line2));

  if (len <= 16) {
    // Fits on first line
    strncpy(line1, message, 16);
  } else {
    // First 16 characters on Row 1
    strncpy(line1, message, 16);
    line1[16] = '\\0';

    // Remaining up to 16 characters on Row 2
    strncpy(line2, message + 16, 16);
    line2[16] = '\\0';
  }

  // Print to LCD display
  lcd.setCursor(0, 0);
  lcd.print(line1);

  if (strlen(line2) > 0) {
    lcd.setCursor(0, 1);
    lcd.print(line2);
  }

  // Send acknowledgment back to Web Serial console
  Serial.print("ACK:Received (");
  Serial.print(len);
  Serial.print(" chars): ");
  Serial.println(message);

  digitalWrite(STATUS_LED_PIN, LOW);
}

/*
  -------------------------------------------------------------
  MODULAR EXTENSION HOOKS (For Future Phase 2 Optical Li-Fi)
  -------------------------------------------------------------
  In Phase 2, optical LED transmission can be plugged in here:
  void transmitOpticalPulse(const char* data) {
    // Modulate Pin 13 / High-Power LED with Manchester pulse stream
  }

  void receiveOpticalPulse() {
    // Read analog/comparator input from LDR receiver
  }
*/
`;

export const WIRING_PINOUT = [
  { pin: 'GND', target: 'Arduino GND (Ground)', desc: 'Common Ground' },
  { pin: 'VCC', target: 'Arduino 5V', desc: '5V DC Power Supply' },
  { pin: 'SDA', target: 'Arduino A4 (or dedicated SDA pin)', desc: 'I2C Serial Data line' },
  { pin: 'SCL', target: 'Arduino A5 (or dedicated SCL pin)', desc: 'I2C Serial Clock line' },
];

export const WINDOWS_SETUP_STEPS = [
  {
    step: '1',
    title: 'Hardware Wiring',
    desc: 'Connect the 4 pins of the I2C backpack on your 16x2 LCD to the Arduino Uno: VCC -> 5V, GND -> GND, SDA -> A4, SCL -> A5.',
  },
  {
    step: '2',
    title: 'Install LCD Library in Arduino IDE',
    desc: 'Open Arduino IDE, go to Sketch -> Include Library -> Manage Libraries. Search for "LiquidCrystal_I2C" (by Marco Schwartz or Frank de Brabander) and click Install.',
  },
  {
    step: '3',
    title: 'Upload Code & Adjust Contrast Potentiometer',
    desc: 'Paste the provided code into Arduino IDE and upload it to your Uno at 9600 baud. If you see blank blocks or nothing on the screen, use a small flathead screwdriver to gently turn the blue potentiometer on the back of the I2C backpack until letters appear crisp.',
  },
  {
    step: '4',
    title: 'Open Website in Chrome or Edge',
    desc: 'Ensure Arduino Serial Monitor in Arduino IDE is CLOSED (otherwise Windows locks the COM port). Open this website in Google Chrome or Microsoft Edge.',
  },
  {
    step: '5',
    title: 'Click "Connect Arduino"',
    desc: 'Select your Arduino Uno (e.g., "Arduino Uno (COM3)" or "USB-SERIAL CH340 (COM4)") in the browser prompt and click Connect.',
  },
];
