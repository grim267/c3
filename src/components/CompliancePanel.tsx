import React, { useState, useEffect } from 'react';
import { Shield, FileText, Clock, AlertTriangle, CheckCircle, Eye, Lock } from 'lucide-react';

interface ComplianceEvent {
  id: string;
  timestamp: Date;
  auditType: 'hipaa' | 'gdpr' | 'access_control' | 'data_retention';
  userId?: string;
  resourceType: 'patient_data' | 'medical_device' | 'admin_system';
  action: string;
  result: 'allowed' | 'denied' | 'flagged';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  complianceStatus: 'compliant' | 'violation' | 'review_required';
  details: string;
}

export function CompliancePanel() {
  const [complianceEvents, setComplianceEvents] = useState<ComplianceEvent[]>([]);
  const [selectedAuditType, setSelectedAuditType] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('24h');

  useEffect(() => {
    // Generate sample compliance events for demonstration
    generateSampleEvents();
    
    // Set up periodic compliance monitoring
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        generateComplianceEvent();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const generateSampleEvents = () => {
    const sampleEvents: ComplianceEvent[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 3600000),
        auditType: 'hipaa',
        userId: 'user123',
        resourceType: 'patient_data',
        action: 'Patient record accessed',
        result: 'allowed',
        riskLevel: 'low',
        complianceStatus: 'compliant',
        details: 'Authorized access to patient medical records with proper authentication'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 7200000),
        auditType: 'gdpr',
        resourceType: 'patient_data',
        action: 'Data export requested',
        result: 'flagged',
        riskLevel: 'medium',
        complianceStatus: 'review_required',
        details: 'Large data export request requires manual review for GDPR compliance'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 1800000),
        auditType: 'access_control',
        userId: 'user456',
        resourceType: 'medical_device',
        action: 'Unauthorized device access attempt',
        result: 'denied',
        riskLevel: 'high',
        complianceStatus: 'violation',
        details: 'Attempted access to MRI control system without proper clearance'
      }
    ];
    setComplianceEvents(sampleEvents);
  };

  const generateComplianceEvent = () => {
    const auditTypes = ['hipaa', 'gdpr', 'access_control', 'data_retention'] as const;
    const resourceTypes = ['patient_data', 'medical_device', 'admin_system'] as const;
    const actions = [
      'Patient record accessed',
      'Medical device configuration changed',
      'Data backup initiated',
      'User permissions modified',
      'Audit log reviewed',
      'Data retention policy applied'
    ];
    const results = ['allowed', 'denied', 'flagged'] as const;
    const riskLevels = ['low', 'medium', 'high', 'critical'] as const;
    const complianceStatuses = ['compliant', 'violation', 'review_required'] as const;

    const newEvent: ComplianceEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date(),
      auditType: auditTypes[Math.floor(Math.random() * auditTypes.length)],
      userId: `user${Math.floor(Math.random() * 1000)}`,
      resourceType: resourceTypes[Math.floor(Math.random() * resourceTypes.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      result: results[Math.floor(Math.random() * results.length)],
      riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      complianceStatus: complianceStatuses[Math.floor(Math.random() * complianceStatuses.length)],
      details: 'Automated compliance monitoring event'
    };

    setComplianceEvents(prev => [newEvent, ...prev.slice(0, 49)]);
  };

  const getAuditTypeColor = (type: string) => {
    switch (type) {
      case 'hipaa':
        return 'text-blue-400 bg-blue-900/30';
      case 'gdpr':
        return 'text-purple-400 bg-purple-900/30';
      case 'access_control':
        return 'text-orange-400 bg-orange-900/30';
      case 'data_retention':
        return 'text-green-400 bg-green-900/30';
      default:
        return 'text-gray-400 bg-gray-900/30';
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-400';
      case 'violation':
        return 'text-red-400';
      case 'review_required':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-500';
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const filteredEvents = complianceEvents.filter(event => {
    if (selectedAuditType === 'all') return true;
    return event.auditType === selectedAuditType;
  });

  const complianceStats = {
    total: complianceEvents.length,
    compliant: complianceEvents.filter(e => e.complianceStatus === 'compliant').length,
    violations: complianceEvents.filter(e => e.complianceStatus === 'violation').length,
    reviewRequired: complianceEvents.filter(e => e.complianceStatus === 'review_required').length,
    hipaaEvents: complianceEvents.filter(e => e.auditType === 'hipaa').length,
    gdprEvents: complianceEvents.filter(e => e.auditType === 'gdpr').length
  };

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Shield className="h-6 w-6 text-blue-400 mr-2" />
            Healthcare Compliance Monitoring
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm">HIPAA/GDPR Monitoring Active</span>
          </div>
        </div>

        {/* Compliance Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-900/30 rounded-lg p-4 border border-green-700/50">
            <div className="text-green-400 text-2xl font-bold">{complianceStats.compliant}</div>
            <div className="text-gray-400 text-sm">Compliant Events</div>
          </div>
          <div className="bg-red-900/30 rounded-lg p-4 border border-red-700/50">
            <div className="text-red-400 text-2xl font-bold">{complianceStats.violations}</div>
            <div className="text-gray-400 text-sm">Violations</div>
          </div>
          <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700/50">
            <div className="text-blue-400 text-2xl font-bold">{complianceStats.hipaaEvents}</div>
            <div className="text-gray-400 text-sm">HIPAA Events</div>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700/50">
            <div className="text-purple-400 text-2xl font-bold">{complianceStats.gdprEvents}</div>
            <div className="text-gray-400 text-sm">GDPR Events</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          <select
            value={selectedAuditType}
            onChange={(e) => setSelectedAuditType(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Audit Types</option>
            <option value="hipaa">HIPAA</option>
            <option value="gdpr">GDPR</option>
            <option value="access_control">Access Control</option>
            <option value="data_retention">Data Retention</option>
          </select>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Compliance Events */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Compliance Audit Trail</h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-gray-900 rounded-lg p-4 border border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getAuditTypeColor(event.auditType)}`}>
                      {event.auditType.toUpperCase()}
                    </span>
                    <span className={`text-xs font-medium ${getComplianceStatusColor(event.complianceStatus)}`}>
                      {event.complianceStatus.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`text-xs font-medium ${getRiskLevelColor(event.riskLevel)}`}>
                      {event.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                  <p className="text-white text-sm font-medium">{event.action}</p>
                  <p className="text-gray-300 text-sm mt-1">{event.details}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {event.timestamp.toLocaleString()}
                    </span>
                    {event.userId && (
                      <span>User: {event.userId}</span>
                    )}
                    <span className="capitalize">{event.resourceType.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {event.result === 'allowed' && <CheckCircle className="h-5 w-5 text-green-400" />}
                  {event.result === 'denied' && <XCircle className="h-5 w-5 text-red-400" />}
                  {event.result === 'flagged' && <AlertTriangle className="h-5 w-5 text-yellow-400" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Requirements */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Healthcare Compliance Requirements</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* HIPAA Requirements */}
          <div className="space-y-4">
            <h4 className="text-blue-400 font-medium flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              HIPAA Requirements
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 bg-gray-900 rounded">
                <span className="text-gray-300">Access Controls</span>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-900 rounded">
                <span className="text-gray-300">Audit Logs</span>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-900 rounded">
                <span className="text-gray-300">Data Encryption</span>
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-900 rounded">
                <span className="text-gray-300">Multi-Factor Auth</span>
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* GDPR Requirements */}
          <div className="space-y-4">
            <h4 className="text-purple-400 font-medium flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              GDPR Requirements
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 bg-gray-900 rounded">
                <span className="text-gray-300">Data Minimization</span>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-900 rounded">
                <span className="text-gray-300">Consent Management</span>
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-900 rounded">
                <span className="text-gray-300">Right to Erasure</span>
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-900 rounded">
                <span className="text-gray-300">Data Portability</span>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function generateComplianceEvent() {
    const newEvent: ComplianceEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date(),
      auditType: ['hipaa', 'gdpr', 'access_control'][Math.floor(Math.random() * 3)] as any,
      userId: `user${Math.floor(Math.random() * 1000)}`,
      resourceType: ['patient_data', 'medical_device', 'admin_system'][Math.floor(Math.random() * 3)] as any,
      action: 'Automated compliance check',
      result: ['allowed', 'denied', 'flagged'][Math.floor(Math.random() * 3)] as any,
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
      complianceStatus: ['compliant', 'violation', 'review_required'][Math.floor(Math.random() * 3)] as any,
      details: 'Real-time compliance monitoring event'
    };

    setComplianceEvents(prev => [newEvent, ...prev.slice(0, 49)]);
  }
}