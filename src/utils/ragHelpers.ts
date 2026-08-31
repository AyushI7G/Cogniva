import { ClassificationLevel, Department, UserRoleId } from '../types';

export function getClassificationBadgeColor(classification: ClassificationLevel): string {
  switch (classification) {
    case 'Restricted':
      return 'bg-black text-white border-black font-bold';
    case 'Confidential':
      return 'bg-black/80 text-white border-black/50 font-semibold';
    case 'Internal':
      return 'bg-white text-black border-black/40 font-medium';
    case 'Public':
      return 'bg-white text-black border-black/20';
    default:
      return 'bg-white text-black border-black/20';
  }
}

export function getDepartmentBadgeColor(dept: Department): string {
  return 'bg-black text-white border-black/30';
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffSeconds < 60) return 'Just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    return `${Math.floor(diffSeconds / 86400)}d ago`;
  } catch {
    return 'Recently';
  }
}


