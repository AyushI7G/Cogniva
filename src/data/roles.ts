import { UserRole, UserRoleId } from '../types';
import { FACELESS_AVATARS } from '../utils/avatars';

export const ENTERPRISE_ROLES: Record<UserRoleId, UserRole> = {
  super_admin: {
    id: 'super_admin',
    name: 'Elena Rostova',
    title: 'Chief Information Officer (CIO)',
    department: 'Executive',
    allowedClassifications: ['Public', 'Internal', 'Confidential', 'Restricted'],
    allowedDepartments: ['All', 'Engineering', 'HR', 'Legal', 'Finance', 'Security', 'Executive', 'Sales'],
    avatar: FACELESS_AVATARS.super_admin,
    color: 'emerald',
    description: 'Full unconstrained access to all company documents, vector vaults, and confidential financial/legal records.'
  },
  security_officer: {
    id: 'security_officer',
    name: 'Marcus Chen',
    title: 'Chief Information Security Officer (CISO)',
    department: 'Security',
    allowedClassifications: ['Public', 'Internal', 'Confidential'],
    allowedDepartments: ['All', 'Engineering', 'Security', 'Legal'],
    avatar: FACELESS_AVATARS.security_officer,
    color: 'indigo',
    description: 'Access to security policies, architecture docs, audit reports, and compliance frameworks.'
  },
  eng_lead: {
    id: 'eng_lead',
    name: 'David Kim',
    title: 'Principal Software Architect',
    department: 'Engineering',
    allowedClassifications: ['Public', 'Internal'],
    allowedDepartments: ['All', 'Engineering', 'Security'],
    avatar: FACELESS_AVATARS.eng_lead,
    color: 'blue',
    description: 'Access to system architectures, API specifications, coding standards, and internal engineering runbooks.'
  },
  hr_director: {
    id: 'hr_director',
    name: 'Sarah Jenkins',
    title: 'Head of People Operations',
    department: 'HR',
    allowedClassifications: ['Public', 'Internal', 'Confidential'],
    allowedDepartments: ['All', 'HR', 'Legal'],
    avatar: FACELESS_AVATARS.hr_director,
    color: 'purple',
    description: 'Access to employee handbooks, compensation guidelines, confidential personnel policies, and benefits.'
  },
  sales_rep: {
    id: 'sales_rep',
    name: 'Liam Vance',
    title: 'Senior Enterprise Account Executive',
    department: 'Sales',
    allowedClassifications: ['Public', 'Internal'],
    allowedDepartments: ['All', 'Sales', 'Executive'],
    avatar: FACELESS_AVATARS.sales_rep,
    color: 'amber',
    description: 'Access to pricing tiers, customer battlecards, sales playbooks, and non-confidential product roadmaps.'
  },
  guest: {
    id: 'guest',
    name: 'Alex Rivera',
    title: 'External Contractor / Guest',
    department: 'Engineering',
    allowedClassifications: ['Public'],
    allowedDepartments: ['All', 'Engineering'],
    avatar: FACELESS_AVATARS.guest,
    color: 'slate',
    description: 'Restricted view. Can only query public guides and open documentation.'
  }
};
