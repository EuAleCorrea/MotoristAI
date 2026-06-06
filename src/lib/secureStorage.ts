import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const STORAGE_PREFIX = 'motoristai_secure_';
const APP_SALT = 'motoristai_v2_salt';
const ALGO = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;

let cachedKey: CryptoKey | null = null;

function getDeviceFingerprint(): string {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'web';
  let hash = 0;
  for (let i = 0; i < ua.length; i++) {
    hash = (hash << 5) - hash + ua.charCodeAt(i);
    hash |= 0;
  }
  return `dev_${Math.abs(hash).toString(36)}`;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getEncryptionKey(): Promise<CryptoKey | null> {
  if (cachedKey) return cachedKey;
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    console.warn('[SecureStorage] crypto.subtle indisponível — usando fallback localStorage');
    return null;
  }
  try {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(getDeviceFingerprint() + APP_SALT),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    cachedKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: enc.encode(APP_SALT),
        iterations: 100_000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: ALGO, length: KEY_LENGTH },
      false,
      ['encrypt', 'decrypt']
    );
    return cachedKey;
  } catch (err) {
    console.error('[SecureStorage] Erro ao derivar chave:', err);
    return null;
  }
}

async function encrypt(plain: string): Promise<string | null> {
  const key = await getEncryptionKey();
  if (!key) return null;
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const cipher = await crypto.subtle.encrypt({ name: ALGO, iv }, key, enc.encode(plain));
  const cipherBytes = new Uint8Array(cipher);
  const combined = new Uint8Array(iv.length + cipherBytes.length);
  combined.set(iv, 0);
  combined.set(cipherBytes, iv.length);
  return bytesToBase64(combined);
}

async function decrypt(payload: string): Promise<string | null> {
  const key = await getEncryptionKey();
  if (!key) return null;
  try {
    const combined = base64ToBytes(payload);
    const iv = combined.slice(0, IV_LENGTH);
    const cipherBytes = combined.slice(IV_LENGTH);
    const plain = await crypto.subtle.decrypt({ name: ALGO, iv }, key, cipherBytes);
    return new TextDecoder().decode(plain);
  } catch (err) {
    console.error('[SecureStorage] Erro ao decifrar:', err);
    return null;
  }
}

function localSet(key: string, value: string): void {
  localStorage.setItem(STORAGE_PREFIX + key, value);
}

function localGet(key: string): string | null {
  return localStorage.getItem(STORAGE_PREFIX + key);
}

function localRemove(key: string): void {
  localStorage.removeItem(STORAGE_PREFIX + key);
}

export async function secureSet(key: string, value: string): Promise<void> {
  const encrypted = await encrypt(value);
  if (Capacitor.isNativePlatform() && encrypted !== null) {
    await Preferences.set({ key: STORAGE_PREFIX + key, value: encrypted });
    localRemove(key);
  } else if (encrypted !== null) {
    localSet(key, encrypted);
  } else {
    localSet(key, value);
    console.warn(`[SecureStorage] Salvando ${key} sem criptografia (fallback)`);
  }
}

export async function secureGet(key: string): Promise<string | null> {
  if (Capacitor.isNativePlatform()) {
    const { value } = await Preferences.get({ key: STORAGE_PREFIX + key });
    if (value) {
      const decrypted = await decrypt(value);
      if (decrypted) return decrypted;
    }
  }
  const fallback = localGet(key);
  if (fallback) {
    return decrypt(fallback);
  }
  return null;
}

export async function secureRemove(key: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    await Preferences.remove({ key: STORAGE_PREFIX + key });
  }
  localRemove(key);
}
