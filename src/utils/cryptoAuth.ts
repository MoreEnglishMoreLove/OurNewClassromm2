import { StudentActivation, GeneratedCodeRecord } from '../types';

// Strict Admin PIN requested by Teacher Jaidaa Saqer
export const TEACHER_ADMIN_PIN = 'b13a15m17';

// Teacher WhatsApp official contact
export const TEACHER_WHATSAPP_NUMBER = '963933036079';
export const TEACHER_WHATSAPP_DISPLAY = '+963 933 036 079';
export const TEACHER_NAME = 'جيداء صقر';
export const TEACHER_NAME_EN = 'T. Jaidaa Saqer';

// Secret cryptographic salt embedded directly in the application
const SECRET_SALT = 'JAIDAA_SAQER_MEML_SECURE_SALT_V2026_MATH_AUTH';

// Safe Base32 character set (excluding 0, O, 1, I to avoid student reading confusion)
const CHARSET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/**
 * Normalizes Arabic and English names so minor spelling/diacritics differences
 * between teacher and student (e.g. أ / ا / ة / ه) evaluate identically.
 */
export function normalizeStudentName(name: string): string {
  if (!name) return '';
  let normalized = name.trim().toLowerCase();

  // Remove Arabic diacritics / tashkeel & tatweel
  normalized = normalized.replace(/[\u064B-\u065F\u0670\u0640]/g, '');

  // Normalize Alef forms (أ, إ, آ, ٱ -> ا)
  normalized = normalized.replace(/[أإآٱ]/g, 'ا');

  // Normalize Taa Marbuta (ة -> ه)
  normalized = normalized.replace(/ة/g, 'ه');

  // Normalize Yaa (ى -> ي)
  normalized = normalized.replace(/ى/g, 'ي');

  // Collapse consecutive whitespaces into a single space
  normalized = normalized.replace(/\s+/g, ' ');

  return normalized.trim();
}

/**
 * Computes a robust 64-bit deterministic hash combining Murmur/FNV algorithms
 * with the secret salt and student name.
 */
function computeDeterministicHash(input: string): [number, number] {
  let h1 = 0x811c9dc5; // 32-bit FNV offset basis
  let h2 = 0x9e3779b9; // Golden ratio fractional constant

  const combined = `${SECRET_SALT}:${input}:${SECRET_SALT.split('').reverse().join('')}`;

  for (let i = 0; i < combined.length; i++) {
    const charCode = combined.charCodeAt(i);

    // Mix into h1
    h1 ^= charCode;
    h1 = Math.imul(h1, 0x01000193); // FNV prime
    h1 = (h1 << 13) | (h1 >>> 19);

    // Mix into h2 with position-dependent non-linear shift
    h2 ^= charCode + (i * 31);
    h2 = Math.imul(h2, 0x85ebca6b);
    h2 = (h2 << 17) | (h2 >>> 15);
  }

  // Final avalanche mixing
  h1 ^= h2 >>> 16;
  h1 = Math.imul(h1, 0x85ebca6b);
  h1 ^= h1 >>> 13;
  h1 = Math.imul(h1, 0xc2b2ae35);
  h1 ^= h1 >>> 16;

  h2 ^= h1 >>> 15;
  h2 = Math.imul(h2, 0x27d4eb2d);
  h2 ^= h2 >>> 15;

  return [h1 >>> 0, h2 >>> 0];
}

/**
 * Generates the exclusive mathematical code for the student:
 * Format: MEML-XXXX-XXXX
 */
export function generateActivationCode(studentName: string): string {
  const normalized = normalizeStudentName(studentName);
  if (!normalized || normalized.length < 2) {
    return '';
  }

  const [h1, h2] = computeDeterministicHash(normalized);

  // Extract 8 characters from the 32-character safe base32 alphabet
  const chars: string[] = [];
  let tempH1 = h1;
  let tempH2 = h2;

  // 4 characters from first hash
  for (let i = 0; i < 4; i++) {
    chars.push(CHARSET[tempH1 % CHARSET.length]);
    tempH1 = Math.floor(tempH1 / CHARSET.length);
  }

  // 4 characters from second hash
  for (let i = 0; i < 4; i++) {
    chars.push(CHARSET[tempH2 % CHARSET.length]);
    tempH2 = Math.floor(tempH2 / CHARSET.length);
  }

  const part1 = chars.slice(0, 4).join('');
  const part2 = chars.slice(4, 8).join('');

  return `MEML-${part1}-${part2}`;
}

/**
 * Verifies if the provided code mathematically matches the student's name
 */
export function verifyActivationCode(studentName: string, code: string): boolean {
  if (!studentName || !code) return false;
  const expected = generateActivationCode(studentName);
  if (!expected) return false;

  const cleanProvided = code.trim().toUpperCase().replace(/\s+/g, '');
  const cleanExpected = expected.trim().toUpperCase().replace(/\s+/g, '');

  return cleanProvided === cleanExpected;
}

/**
 * Device-binding generator and retrieval
 */
export function getOrCreateDeviceId(): string {
  const KEY = 'meml_device_fingerprint';
  let deviceId = localStorage.getItem(KEY);
  if (!deviceId) {
    const randomPart = Math.random().toString(36).substring(2, 12);
    const timePart = Date.now().toString(36);
    deviceId = `dev_${timePart}_${randomPart}`;
    localStorage.setItem(KEY, deviceId);
  }
  return deviceId;
}

/**
 * Activate student session for 180 days (6 months)
 */
const SESSION_STORAGE_KEY = 'meml_student_activation_session';
const TEACHER_CODES_HISTORY_KEY = 'meml_teacher_generated_codes';

export function saveActivation(studentName: string, code: string): StudentActivation {
  const now = Date.now();
  const SIX_MONTHS_MS = 180 * 24 * 60 * 60 * 1000; // 180 days
  const deviceId = getOrCreateDeviceId();

  const activation: StudentActivation = {
    studentName: studentName.trim(),
    normalizedName: normalizeStudentName(studentName),
    code: code.trim().toUpperCase(),
    activatedAt: now,
    expiresAt: now + SIX_MONTHS_MS,
    deviceId: deviceId,
  };

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(activation));
  return activation;
}

export function getActiveSession(): {
  isValid: boolean;
  isExpired: boolean;
  activation: StudentActivation | null;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
} {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) {
      return { isValid: false, isExpired: false, activation: null, daysRemaining: 0, hoursRemaining: 0, minutesRemaining: 0 };
    }

    const activation: StudentActivation = JSON.parse(stored);
    const now = Date.now();

    // Verify mathematical integrity of stored code
    const isCodeValid = verifyActivationCode(activation.studentName, activation.code);
    const isDeviceMatched = activation.deviceId === getOrCreateDeviceId();

    if (!isCodeValid || !isDeviceMatched) {
      return { isValid: false, isExpired: false, activation: null, daysRemaining: 0, hoursRemaining: 0, minutesRemaining: 0 };
    }

    const diff = activation.expiresAt - now;
    if (diff <= 0) {
      return { isValid: false, isExpired: true, activation, daysRemaining: 0, hoursRemaining: 0, minutesRemaining: 0 };
    }

    const daysRemaining = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hoursRemaining = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutesRemaining = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));

    return {
      isValid: true,
      isExpired: false,
      activation,
      daysRemaining,
      hoursRemaining,
      minutesRemaining,
    };
  } catch (e) {
    console.error('Error parsing session', e);
    return { isValid: false, isExpired: false, activation: null, daysRemaining: 0, hoursRemaining: 0, minutesRemaining: 0 };
  }
}

export function logoutStudent(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

/**
 * Teacher history helper
 */
export function getTeacherCodesHistory(): GeneratedCodeRecord[] {
  try {
    const stored = localStorage.getItem(TEACHER_CODES_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

export function saveTeacherCodeToHistory(studentName: string, code: string, notes?: string): GeneratedCodeRecord[] {
  const list = getTeacherCodesHistory();
  const newRecord: GeneratedCodeRecord = {
    id: `code_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    studentName: studentName.trim(),
    normalizedName: normalizeStudentName(studentName),
    code,
    createdAt: Date.now(),
    notes,
  };

  const updated = [newRecord, ...list.filter(r => r.normalizedName !== newRecord.normalizedName)];
  localStorage.setItem(TEACHER_CODES_HISTORY_KEY, JSON.stringify(updated.slice(0, 100)));
  return updated;
}

export function deleteTeacherCodeFromHistory(id: string): GeneratedCodeRecord[] {
  const list = getTeacherCodesHistory();
  const updated = list.filter(item => item.id !== id);
  localStorage.setItem(TEACHER_CODES_HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Builds WhatsApp message URLs
 */
export function getStudentWhatsAppRequestUrl(studentName?: string): string {
  const base = `https://wa.me/${TEACHER_WHATSAPP_NUMBER}`;
  const namePart = studentName ? `اسمي الكامل هو: ${studentName.trim()}` : `اسمي الكامل هو: `;
  const message = `السلام عليكم ورحمة الله وبركاته، أستاذة جيداء صقر.\nأرغب في الحصول على كود تفعيل لتطبيق MORE ENGLISH MORE LOVE،\n${namePart}.\nشكراً جزيلاً!`;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function getTeacherWhatsAppSendCodeUrl(studentName: string, code: string): string {
  const base = `https://wa.me/${TEACHER_WHATSAPP_NUMBER}`;
  const message = `أهلاً بك يا ${studentName.trim()} في تطبيق MORE ENGLISH MORE LOVE بإشراف المعلمة جيداء صقر!\n\nكود التفعيل الحصري الخاص بك:\n🔑 ${code}\n\nمدة الصلاحية: 6 أشهر (180 يوماً).\nطريقة التفعيل: افتح التطبيق واكتب اسمك مطابقاً والكود لفتح المنهاج على جهازك.\nبالتوفيق والنجاح دائماً! 🌟`;
  return `${base}?text=${encodeURIComponent(message)}`;
}
