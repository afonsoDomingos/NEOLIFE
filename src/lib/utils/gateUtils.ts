/**
 * Gate Utility Functions
 * Manages the gate system for protecting pillar content
 */

export interface GateData {
  completed: boolean;
  timestamp: number;
  email: string;
  name: string;
  phone: string;
  country: string;
}

const GATE_STORAGE_KEY = 'neolife_gate_completed';
const GATE_TIMESTAMP_KEY = 'neolife_gate_timestamp';
const GATE_EMAIL_KEY = 'neolife_gate_email';
const GATE_NAME_KEY = 'neolife_gate_name';
const GATE_PHONE_KEY = 'neolife_gate_phone';
const GATE_COUNTRY_KEY = 'neolife_gate_country';

// Gate expires after 30 days (in milliseconds)
const GATE_EXPIRY_DAYS = 30;
const GATE_EXPIRY_MS = GATE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

/**
 * Check if the user has completed the gate and it's still valid
 */
export function isGateValid(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const completed = localStorage.getItem(GATE_STORAGE_KEY);
    const timestamp = localStorage.getItem(GATE_TIMESTAMP_KEY);

    if (!completed || completed !== 'true' || !timestamp) {
      return false;
    }

    const gateTime = parseInt(timestamp, 10);
    const now = Date.now();
    const isExpired = now - gateTime > GATE_EXPIRY_MS;

    if (isExpired) {
      // Clear expired gate data
      clearGateData();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking gate status:', error);
    return false;
  }
}

/**
 * Get gate data from localStorage
 */
export function getGateData(): GateData | null {
  if (typeof window === 'undefined') return null;

  try {
    const completed = localStorage.getItem(GATE_STORAGE_KEY);
    const timestamp = localStorage.getItem(GATE_TIMESTAMP_KEY);
    const email = localStorage.getItem(GATE_EMAIL_KEY);
    const name = localStorage.getItem(GATE_NAME_KEY);
    const phone = localStorage.getItem(GATE_PHONE_KEY);
    const country = localStorage.getItem(GATE_COUNTRY_KEY);

    if (!completed || completed !== 'true' || !timestamp) {
      return null;
    }

    const gateTime = parseInt(timestamp, 10);
    const now = Date.now();
    const isExpired = now - gateTime > GATE_EXPIRY_MS;

    if (isExpired) {
      clearGateData();
      return null;
    }

    return {
      completed: true,
      timestamp: gateTime,
      email: email || '',
      name: name || '',
      phone: phone || '',
      country: country || '',
    };
  } catch (error) {
    console.error('Error getting gate data:', error);
    return null;
  }
}

/**
 * Clear gate data from localStorage
 */
export function clearGateData(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(GATE_STORAGE_KEY);
    localStorage.removeItem(GATE_TIMESTAMP_KEY);
    localStorage.removeItem(GATE_EMAIL_KEY);
    localStorage.removeItem(GATE_NAME_KEY);
    localStorage.removeItem(GATE_PHONE_KEY);
    localStorage.removeItem(GATE_COUNTRY_KEY);
  } catch (error) {
    console.error('Error clearing gate data:', error);
  }
}

/**
 * Redirect to gate page if not validated
 * @param pillar - The pillar being accessed (saude, business, experiencias)
 * @param currentPath - The current path to redirect back to after gate
 */
export function requireGate(pillar: string, currentPath: string): void {
  if (typeof window === 'undefined') return;

  if (!isGateValid()) {
    const gateUrl = `/gate?pillar=${pillar}&redirect=${encodeURIComponent(currentPath)}`;
    window.location.href = gateUrl;
  }
}

/**
 * Get remaining days until gate expires
 */
export function getGateRemainingDays(): number {
  const gateData = getGateData();
  if (!gateData) return 0;

  const now = Date.now();
  const elapsed = now - gateData.timestamp;
  const remaining = GATE_EXPIRY_MS - elapsed;
  const days = Math.ceil(remaining / (24 * 60 * 60 * 1000));

  return Math.max(0, days);
}