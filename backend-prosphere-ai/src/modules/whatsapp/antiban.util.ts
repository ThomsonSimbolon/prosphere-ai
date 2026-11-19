/**
 * ProSphere AI WhatsApp Anti-Ban & Humanization Utility Engine
 */

export class AntiBanUtil {
  /**
   * 1. Spintax Parser
   * Converts {Halo|Hai|Selamat pagi} into randomly chosen words.
   * Supports nested spintax patterns.
   */
  static parseSpintax(text: string): string {
    const spintaxRegex = /\{([^{}]+)\}/;
    let match: RegExpExecArray | null;

    while ((match = spintaxRegex.exec(text)) !== null) {
      const choices = match[1].split('|');
      const randomChoice = choices[Math.floor(Math.random() * choices.length)];
      text = text.replace(match[0], randomChoice);
    }

    return text;
  }

  /**
   * 2. Variable Replacer
   * Replaces dynamic placeholders like {{name}}, {{phone}}, etc.
   */
  static replaceVariables(text: string, vars: Record<string, string>): string {
    let result = text;
    for (const [key, value] of Object.entries(vars)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'gi');
      result = result.replace(regex, value);
    }
    return result;
  }

  /**
   * 3. Gaussian / Random Jitter Generator
   * Adds human variance to fixed interval delays to break bot detection.
   * E.g. baseDelay = 5s -> returns 5200ms - 8500ms
   */
  static getHumanJitterMs(baseSeconds: number, minJitter = 800, maxJitter = 3500): number {
    const baseMs = Math.max(baseSeconds, 2) * 1000;
    const jitter = Math.floor(Math.random() * (maxJitter - minJitter + 1)) + minJitter;
    return baseMs + jitter;
  }

  /**
   * 4. Typing Duration Estimator
   * Calculates realistic typing duration based on message length.
   * Typical human types 200 - 350 characters per minute (~30-50ms per char).
   */
  static calculateTypingDurationMs(textLength: number): number {
    const minDuration = 1200; // minimum 1.2s typing
    const maxDuration = 4500; // maximum 4.5s typing
    const calculated = Math.floor(textLength * 35);
    return Math.min(Math.max(calculated, minDuration), maxDuration);
  }

  /**
   * Helper sleep function
   */
  static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
