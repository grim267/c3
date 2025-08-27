// Healthcare-specific type definitions for HIPAA/GDPR compliance

export interface PatientDataAccess {
  id: string;
  userId: string;
  patientId: string;
  accessType: 'view' | 'edit' | 'create' | 'delete';
  dataType: 'medical_record' | 'billing' | 'imaging' | 'lab_results';
  justification: string;
  accessedAt: Date;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
}

export interface MFAConfig {
  id: string;
  userId: string;
  method: 'totp' | 'sms' | 'email' | 'hardware_token';
  isEnabled: boolean;
  backupCodes: string[];
  lastUsed?: Date;
  createdAt: Date;
}

export interface ComplianceAudit {
  id: string;
  auditType: 'hipaa' | 'gdpr' | 'access_control' | 'data_retention';
  userId?: string;
  resourceId: string;
  resourceType: 'patient_data' | 'medical_device' | 'admin_system';
  action: string;
  result: 'allowed' | 'denied' | 'flagged';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  complianceStatus: 'compliant' | 'violation' | 'review_required';
  details: Record<string, any>;
  timestamp: Date;
}

export interface DataRetentionPolicy {
  id: string;
  dataType: string;
  retentionPeriod: number; // days
  autoDelete: boolean;
  encryptionRequired: boolean;
  accessLoggingRequired: boolean;
  gdprApplicable: boolean;
  hipaaApplicable: boolean;
}

export interface ConsentManagement {
  id: string;
  patientId: string;
  consentType: 'data_processing' | 'marketing' | 'research' | 'sharing';
  granted: boolean;
  grantedAt?: Date;
  revokedAt?: Date;
  expiresAt?: Date;
  legalBasis: string;
  processingPurpose: string;
}