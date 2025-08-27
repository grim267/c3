import React, { useState } from 'react';
import { Shield, Smartphone, Mail, Key, QrCode, Copy, CheckCircle } from 'lucide-react';
import { generateTOTPConfig, generateBackupCodes, validateTOTPCode, formatSecretForDisplay } from '../utils/mfaUtils';

interface MFASetupProps {
  userId: string;
  userEmail: string;
  onMFAEnabled: () => void;
}

export function MFASetup({ userId, userEmail, onMFAEnabled }: MFASetupProps) {
  const [selectedMethod, setSelectedMethod] = useState<'totp' | 'sms' | 'email'>('totp');
  const [step, setStep] = useState<'select' | 'setup' | 'verify' | 'complete'>('select');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleMethodSelect = async (method: 'totp' | 'sms' | 'email') => {
    setSelectedMethod(method);
    setError('');
    
    if (method === 'totp') {
      try {
        setIsGenerating(true);
        const totpConfig = await generateTOTPConfig(userId, userEmail);
        setTotpSecret(totpConfig.secret);
        setQrCodeDataUrl(totpConfig.qrCodeUrl);
        setStep('setup');
      } catch (err) {
        setError('Failed to generate QR code. Please try again.');
        console.error('QR code generation error:', err);
      } finally {
        setIsGenerating(false);
      }
    } else {
      setStep('setup');
    }
  };


  const handleVerify = () => {
    setError('');
    
    if (!validateTOTPCode(verificationCode)) {
      setError('Please enter a valid 6-digit code');
      return;
    }
    
    // In production, verify the code with backend using the secret
    if (verificationCode.length === 6) {
      const codes = generateBackupCodes(10);
      setBackupCodes(codes);
      setStep('complete');
      
      // Save MFA configuration
      // In production, call API to enable MFA
      setTimeout(() => {
        onMFAEnabled();
      }, 2000);
    } else {
      setError('Invalid verification code');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
    });
  };

  const copyAllBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    copyToClipboard(codesText);
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

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-900/30 border border-red-700/50 rounded-lg p-3 text-red-300 text-sm">
          {error}
        </div>
      )}
      {step === 'select' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Choose Authentication Method</h3>
          
          <button
            onClick={() => handleMethodSelect('totp')}
            disabled={isGenerating}
            className="w-full p-4 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 rounded-lg border border-gray-600 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <QrCode className={`h-6 w-6 ${isGenerating ? 'text-gray-400' : 'text-green-400'}`} />
              <div>
                <div className="text-white font-medium">Authenticator App (Recommended)</div>
                <div className="text-gray-400 text-sm">
                  {isGenerating ? 'Generating QR code...' : 'Use Google Authenticator, Authy, or similar'}
                </div>
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
            <div className="bg-white p-4 rounded-lg inline-block mb-4">
              {qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="MFA QR Code" 
                  className="w-48 h-48"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Scan this QR code with your authenticator app
            </p>
            
            {/* Manual Entry Option */}
            {totpSecret && (
              <div className="mt-4 p-3 bg-gray-900 rounded-lg">
                <p className="text-gray-300 text-xs mb-2">Can't scan? Enter this code manually:</p>
                <div className="flex items-center justify-center space-x-2">
                  <code className="text-blue-400 font-mono text-sm bg-gray-800 px-2 py-1 rounded">
                    {formatSecretForDisplay(totpSecret)}
                  </code>
                  <button
                    onClick={() => copyToClipboard(totpSecret)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="Copy secret"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
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
              onClick={copyAllBackupCodes}
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