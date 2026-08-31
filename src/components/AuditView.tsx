import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  CheckCircle,
  XCircle,
  History,
  RefreshCw
} from 'lucide-react';
import { AuditLogEntry, UserRole } from '../types';
import { ENTERPRISE_ROLES } from '../data/roles';
import { formatRelativeTime, getClassificationBadgeColor, getDepartmentBadgeColor } from '../utils/ragHelpers';

interface AuditViewProps {
  currentRole: UserRole;
}

export const AuditView: React.FC<AuditViewProps> = ({ currentRole }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterRole] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rag/audit-logs');
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
    const interval = setInterval(fetchAuditLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesRole = filterRole === 'All' || log.userRole === filterRole;
    const matchesStatus = filterStatus === 'All' || log.status === filterStatus;
    const matchesSearch =
      !searchQuery ||
      (log.queryText && log.queryText.toLowerCase().includes(searchQuery.toLowerCase())) ||
      log.docsAccessed.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesRole && matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-[rgb(96,60,96)] p-6 rounded-2xl border border-black/15 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-white" />
            Enterprise RBAC Matrix & Access Audit Logs
          </h2>
          <p className="text-xs text-white/90 font-medium mt-1">
            Zero-Trust access control policies and immutable forensic audit trail of all vector document queries and retrieval actions.
          </p>
        </div>

        <button
          onClick={fetchAuditLogs}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black hover:bg-black/80 text-white text-xs font-bold border border-white/25 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-white ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Audit Trail</span>
        </button>
      </div>

      {/* RBAC Role Clearance Matrix */}
      <div className="bg-[rgb(96,60,96)] rounded-2xl border border-black/15 shadow-xl overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-white" />
              Role-Based Document Security Clearance Matrix
            </h3>
            <p className="text-xs text-white/90 font-medium mt-0.5">
              Defines which enterprise roles are authorized to query and retrieve specific document classification tiers.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/20 bg-black">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/20 text-white font-bold bg-black">
                <th className="py-3 px-4">Role & Persona</th>
                <th className="py-3 px-4">Department Scope</th>
                <th className="py-3 px-3 text-center">Public</th>
                <th className="py-3 px-3 text-center">Internal</th>
                <th className="py-3 px-3 text-center">Confidential</th>
                <th className="py-3 px-3 text-center">Restricted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/15">
              {Object.values(ENTERPRISE_ROLES).map(role => {
                const isCurrent = role.id === currentRole.id;
                return (
                  <tr
                    key={role.id}
                    className={`transition-colors ${
                      isCurrent ? 'bg-black/80 border-l-4 border-l-white' : 'hover:bg-black/40'
                    }`}
                  >
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={role.avatar}
                        alt={role.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-white/40"
                      />
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {role.name}
                          {isCurrent && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-black text-white border border-white/30 font-bold">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-white/80">{role.title}</div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md border font-bold bg-black text-white border-white/20`}>
                        {role.department}
                      </span>
                    </td>

                    {/* Public */}
                    <td className="py-3 px-3 text-center">
                      {role.allowedClassifications.includes('Public') ? (
                        <CheckCircle className="w-4 h-4 text-white mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-white/30 mx-auto" />
                      )}
                    </td>

                    {/* Internal */}
                    <td className="py-3 px-3 text-center">
                      {role.allowedClassifications.includes('Internal') ? (
                        <CheckCircle className="w-4 h-4 text-white mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-white/30 mx-auto" />
                      )}
                    </td>

                    {/* Confidential */}
                    <td className="py-3 px-3 text-center">
                      {role.allowedClassifications.includes('Confidential') ? (
                        <CheckCircle className="w-4 h-4 text-white mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-white/30 mx-auto" />
                      )}
                    </td>

                    {/* Restricted */}
                    <td className="py-3 px-3 text-center">
                      {role.allowedClassifications.includes('Restricted') ? (
                        <CheckCircle className="w-4 h-4 text-white mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-white/30 mx-auto" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensic Audit Log Table */}
      <div className="bg-[rgb(96,60,96)] rounded-2xl border border-black/15 shadow-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <History className="w-4 h-4 text-white" />
              Live Access & Query Audit Log
            </h3>
            <p className="text-xs text-white/90 font-medium mt-0.5">
              Tracks all vector search lookups, accessed documents, and permission evaluations in real time.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search audit queries..."
              className="bg-black border border-white/30 text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-white text-xs placeholder-white/70 font-medium"
            />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-black border border-white/30 text-white rounded-xl px-3 py-1.5 focus:outline-none text-xs font-bold cursor-pointer"
            >
              <option value="All" className="bg-[rgb(96,60,96)] text-white">All Statuses</option>
              <option value="allowed" className="bg-[rgb(96,60,96)] text-white">Allowed</option>
              <option value="partially_filtered" className="bg-[rgb(96,60,96)] text-white">Partially Filtered</option>
              <option value="denied" className="bg-[rgb(96,60,96)] text-white">Denied</option>
            </select>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-white/90 text-xs font-medium bg-black rounded-xl border border-white/10">
            No audit logs match current filters. Ask questions in the Assistant tab to generate access logs!
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/20 bg-black">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/20 text-white font-bold bg-black">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">User Role</th>
                  <th className="py-2.5 px-3">Action & Query</th>
                  <th className="py-2.5 px-3">Documents Accessed</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/15 font-mono text-[11px]">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-black/60 transition-colors">
                    <td className="py-3 px-3 text-white/80 whitespace-nowrap">
                      {formatRelativeTime(log.timestamp)}
                    </td>

                    <td className="py-3 px-3 font-sans">
                      <span className="font-bold text-white">
                        {ENTERPRISE_ROLES[log.userRole]?.name || log.userRole}
                      </span>
                      <span className="text-[10px] text-white/70 block font-mono">
                        ({ENTERPRISE_ROLES[log.userRole]?.title})
                      </span>
                    </td>

                    <td className="py-3 px-3 font-sans max-w-xs">
                      {log.queryText ? (
                        <div className="text-white font-medium line-clamp-2">"{log.queryText}"</div>
                      ) : (
                        <span className="text-white/80 uppercase font-mono text-[10px]">
                          {log.action}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 font-sans">
                      {log.docsAccessed.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {log.docsAccessed.map((d, dIdx) => (
                            <span
                              key={dIdx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-black text-white border border-white/25 font-medium"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-white/60 text-[10px]">None</span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      {log.status === 'allowed' ? (
                        <span className="px-2 py-0.5 rounded-md bg-black text-white border border-white/30 text-[10px] font-bold font-sans">
                          Allowed ({log.chunksMatched} chunks)
                        </span>
                      ) : log.status === 'partially_filtered' ? (
                        <span className="px-2 py-0.5 rounded-md bg-black text-white border border-white/30 text-[10px] font-bold font-sans">
                          Partially Filtered
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-black text-white border border-white/25 text-[10px] font-bold font-sans">
                          Access Denied
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

