import type { ReactNode } from 'react';

export interface SubNavItem {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  /** MUI SvgIcon component */
  icon: ReactNode;
  href: string;
  children?: SubNavItem[];
}

export interface PrimaryAction {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
}

export interface ComboAction {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

export interface ViewHeaderProps {
  title: string;
  onBack?: () => void;
  primaryAction?: PrimaryAction;
  comboActions?: ComboAction[];
}

export interface ViewFooterProps {
  storeName?: string;
  userName?: string;
  syncedAt?: string;
  isOnline?: boolean;
}

export interface NavLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  activePath?: string;
  headerProps?: ViewHeaderProps;
  footerProps?: ViewFooterProps;
}
