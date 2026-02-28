import {
  Home,
  FileText,
  Library,
  Briefcase,
  User,
  Bot,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  /** i18n key under the "Navigation" namespace, e.g. "home" -> t("home") */
  titleKey: string;
  /** Fallback English label (used before i18n is wired up) */
  label: string;
  icon: LucideIcon;
  /** Optional description key for command palette */
  descriptionKey?: string;
}

/**
 * Single source of truth for all navigation items.
 * Used by: Navigation bar, MobileMenu, CommandPalette
 */
export const navigation: NavItem[] = [
  { href: '/', titleKey: 'home', label: 'Home', icon: Home },
  { href: '/blog', titleKey: 'blog', label: 'Blog', icon: FileText },
  { href: '/snippets', titleKey: 'knowledge', label: 'Knowledge', icon: Library },
  { href: '/projects', titleKey: 'projects', label: 'Projects', icon: Briefcase },
  { href: '/ask', titleKey: 'askAI', label: 'Ask Kokoron', icon: Bot, descriptionKey: 'askAIDesc' },
  { href: '/about', titleKey: 'about', label: 'About', icon: User },
];
