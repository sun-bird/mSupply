import type { ReactNode } from 'react';

export interface SubNavItem {
  label: string;
  href: string;
  onClick?: () => void;
}

export interface NavItem {
  label: string;
  icon: ReactNode;
  href: string;
  onClick?: () => void;
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
  logoUrl?: string;
}
