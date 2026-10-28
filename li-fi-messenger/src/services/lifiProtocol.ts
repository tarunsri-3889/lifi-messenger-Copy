/**
 * Li-Fi Messenger - Modular Protocol Architecture
 *
 * Current Phase: Phase 1 (USB Serial Direct Transport to Arduino Uno & 16x2 LCD)
 * Note: Optical Li-Fi light transmission is NOT yet physically implemented in this phase.
 *
 * This module is architected with clear abstraction boundaries so that a future
 * update can seamlessly route the payload through optical LED pulse modulation
 * and photodiode/LDR reception without altering the application UI or message logic.
 */

export interface FormattedLcdLines {
  line1: string; // 16 chars
  line2: string; // 16 chars
  rawMessage: string;
}

/**
 * Splits and formats up to 32 characters across two 16-character LCD lines.
 * Handles space wrapping or hard cutoffs to ensure clean display formatting.
 */
export function formatMessageForLcd(input: string): FormattedLcdLines {
  const sanitized = input.slice(0, 32);

  // If message contains explicit newline, split on newline
  if (sanitized.includes('\n')) {
    const parts = sanitized.split('\n');
    const line1 = (parts[0] || '').slice(0, 16);
    const line2 = (parts[1] || '').slice(0, 16);
    return {
      line1,
      line2,
      rawMessage: sanitized,
    };
  }

  // If 16 chars or fewer, it fits on line 1
  if (sanitized.length <= 16) {
    return {
      line1: sanitized,
      line2: '',
      rawMessage: sanitized,
    };
  }

  // If greater than 16 chars, perform smart word boundary split if possible
  const candidateSplit = sanitized.lastIndexOf(' ', 16);
  if (candidateSplit > 6) {
    const line1 = sanitized.slice(0, candidateSplit);
    const line2 = sanitized.slice(candidateSplit + 1).slice(0, 16);
    return {
      line1,
      line2,
      rawMessage: sanitized,
    };
  }

  // Hard 16/16 character cutoff
  return {
    line1: sanitized.slice(0, 16),
    line2: sanitized.slice(16, 32),
    rawMessage: sanitized,
  };
}

/**
 * Encodes the text message into the serial frame format.
 * Current format: Raw UTF-8 bytes terminated by '\n' (0x0A) at 9600 baud.
 */
export function encodeSerialPayload(text: string): Uint8Array {
  // Guarantee newline termination
  const cleanText = text.replace(/[\r\n]+$/, '');
  const framedMessage = cleanText + '\n';
  return new TextEncoder().encode(framedMessage);
}

/**
 * Future Phase 2 Optical Li-Fi Protocol Blueprint:
 *
 * In Phase 2:
 * 1. Transmitter: Arduino digital pin modulates a high-brightness LED via PWM or OOK
 *    (On-Off Keying) / Manchester encoding.
 * 2. Receiver: An LDR (Light Dependent Resistor) or high-speed photodiode with an LM393
 *    comparator detects optical light pulses and decodes back to ASCII characters.
 *
 * Optical Frame Structure (Reserved for Phase 2):
 * [0xAA 0x55 (Preamble)] [Length (1 byte)] [Payload (1-32 bytes)] [CRC8 (1 byte)]
 */
export const LIFI_PROTOCOL_METADATA = {
  currentPhase: 'Phase 1 - USB CDC Serial to 16x2 I2C LCD',
  isOpticalImplemented: false,
  baudRate: 9600,
  maxPayloadLength: 32,
  characterEncoding: 'UTF-8',
  frameDelimiter: '\\n (0x0A)',
  hardware: {
    microcontroller: 'Arduino Uno R3 (ATmega328P)',
    display: '16x2 Character LCD with PCF8574 I2C Backpack',
    i2cAddress: '0x27',
    sdaPin: 'A4',
    sclPin: 'A5',
    voltage: '5V DC',
  },
  futureOpticalUpgrade: {
    plannedPhase: 'Phase 2',
    transmitterElement: '5mm / 10mm High-Intensity White or Infrared LED',
    receiverElement: 'LDR Photoresistor / BPW34 Photodiode with Op-Amp / LM393',
    modulationScheme: 'Manchester Encoding / Asynchronous Optical OOK',
  },
};
