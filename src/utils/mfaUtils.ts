import QRCode from 'qrcode';

export interface TOTPConfig {
  secret: string;
  issuer: string;
  accountName: string;
  qrCodeUrl: string;
}

/**
 * Generate a random base32 secret for TOTP
 */
export function generateTOTPSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return secret;
}

/**
 * Generate TOTP configuration with QR code
 */
export async function generateTOTPConfig(
  userId: string, 
  userEmail: string,
  issuer: string = 'Healthcare SOC'
): Promise<TOTPConfig> {
  const secret = generateTOTPSecret();
  const accountName = `${issuer}:${userEmail}`;
  
  // Create TOTP URL according to RFC 6238
  const totpUrl = `otpauth://totp/${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
  
  try {
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(totpUrl, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    });
    
    return {
      secret,
      issuer,
      accountName,
      qrCodeUrl: qrCodeDataUrl
    };
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate backup codes for MFA recovery
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  
  for (let i = 0; i < count; i++) {
    // Generate 8-character alphanumeric code
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code);
  }
  
  return codes;
}

/**
 * Validate TOTP code format
 */
export function validateTOTPCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}

/**
 * Simple TOTP verification (for demo purposes)
 * In production, use a proper TOTP library like 'otplib'
 */
export function verifyTOTPCode(secret: string, code: string): boolean {
  // This is a simplified verification for demo purposes
  // In production, implement proper TOTP algorithm or use otplib
  
  if (!validateTOTPCode(code)) {
    return false;
  }
  
  // For demo, accept any 6-digit code
  // In production, calculate TOTP based on current time and secret
  return true;
}

/**
 * Format secret for display (with spaces for readability)
 */
export function formatSecretForDisplay(secret: string): string {
  return secret.replace(/(.{4})/g, '$1 ').trim();
}