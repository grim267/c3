import React, { useState } from 'react';
import { Shield, Smartphone, Mail, Key, QrCode, Copy, CheckCircle } from 'lucide-react';

interface MFASetupProps {
  userId: string;
  onMFAEnabled: () => void;
}

export function MFASetup({ userId, onMFAEnabled }: MFASetupProps) {
  const [selectedMethod, setSelectedMethod] = useState<'totp' | 'sms' | 'email'>('totp');
  const [step, setStep] = useState<'select' | 'setup' | 'verify' | 'complete'>('select');
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleMethodSelect = (method: 'totp' | 'sms' | 'email') => {
    setSelectedMethod(method);
    setStep('setup');
    
    if (method === 'totp') {
      // Generate QR code for TOTP setup
      const secret = generateTOTPSecret();
      const qrCodeUrl = `otpauth://totp/Healthcare%20SOC:${userId}?secret=${secret}&issuer=Healthcare%20SOC`;
      setQrCode(qrCodeUrl);
    }
  };

  const generateTOTPSecret = () => {
    // In production, use a proper TOTP library
    return 'JBSWY3DPEHPK3PXP'; // Example secret
  };

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  };

  const handleVerify = () => {
    // In production, verify the code with backend
    if (verificationCode.length === 6) {
      const codes = generateBackupCodes();
      setBackupCodes(codes);
      setStep('complete');
      
      // Save MFA configuration
      // In production, call API to enable MFA
      setTimeout(() => {
        onMFAEnabled();
      }, 2000);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <Shield className="h-12 w-12 text-blue-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">Enable Multi-Factor Authentication</h2>
        <p className="text-gray-400 text-sm mt-2">
          Required for HIPAA compliance and enhanced security
        </p>
      </div>

      {step === 'select' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Choose Authentication Method</h3>
          
          <button
            onClick={() => handleMethodSelect('totp')}
            className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <QrCode className="h-6 w-6 text-green-400" />
              <div>
                <div className="text-white font-medium">Authenticator App (Recommended)</div>
                <div className="text-gray-400 text-sm">Use Google Authenticator, Authy, or similar</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleMethodSelect('sms')}
            className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <Smartphone className="h-6 w-6 text-blue-400" />
              <div>
                <div className="text-white font-medium">SMS Text Message</div>
                <div className="text-gray-400 text-sm">Receive codes via text message</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleMethodSelect('email')}
            className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <Mail className="h-6 w-6 text-purple-400" />
              <div>
                <div className="text-white font-medium">Email Verification</div>
                <div className="text-gray-400 text-sm">Receive codes via email</div>
              </div>
            </div>
          </button>
        </div>
      )}

      {step === 'setup' && selectedMethod === 'totp' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Scan QR Code</h3>
            <div className="bg-white p-4 rounded-lg inline-block">
              <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                <QrCode className="h-16 w-16 text-gray-400" />
                <span className="text-xs text-gray-500 ml-2">QR Code Here</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Scan this QR code with your authenticator app
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter verification code from your app
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center text-lg tracking-widest"
              placeholder="000000"
              maxLength={6}
            />
          </div>
          
          <button
            onClick={handleVerify}
            disabled={verificationCode.length !== 6}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors"
          >
            Verify & Enable MFA
          </button>
        </div>
      )}

      {step === 'complete' && (
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto" />
          <h3 className="text-lg font-semibold text-white">MFA Successfully Enabled!</h3>
          
          <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4">
            <h4 className="text-yellow-300 font-medium mb-2">Save Your Backup Codes</h4>
            <p className="text-yellow-200 text-sm mb-3">
              Store these codes securely. You can use them if you lose access to your authenticator.
            </p>
            <div className="grid grid-cols-2 gap-2 font-mono text-sm">
              {backupCodes.map((code, index) => (
                <div key={index} className="bg-gray-700 p-2 rounded text-center text-white">
                  {code}
                </div>
              ))}
            </div>
            <button className="mt-3 text-yellow-300 hover:text-yellow-200 text-sm flex items-center mx-auto">
              <Copy className="h-4 w-4 mr-1" />
              Copy All Codes
            </button>
          </div>
          
          <p className="text-gray-400 text-sm">
            Your account is now protected with multi-factor authentication
          </p>
        </div>
      )}
    </div>
  );
}