import {
  LayoutDashboard,
  CalendarDays,
  Trophy,
  ListTree,
  MapPin,
  Users,
  UserCog,
  User,
  Gamepad2,
  Badge,
  type LucideIcon,
} from 'lucide-react';

export interface NavSection {
  label: string;
  items: NavItem[];
}

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export const adminNavSections: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    ],
  },
  {
    label: 'League Setup',
    items: [
      { to: '/admin/seasons', label: 'Seasons', icon: CalendarDays },
      { to: '/admin/tournaments', label: 'Tournaments', icon: Trophy },
      { to: '/admin/divisions', label: 'Divisions', icon: ListTree },
      { to: '/admin/venues', label: 'Venues', icon: MapPin },
    ],
  },
  {
    label: 'Teams & People',
    items: [
      { to: '/admin/teams', label: 'Teams', icon: Users },
      { to: '/admin/coaches', label: 'Coaches', icon: UserCog },
      { to: '/admin/players', label: 'Players', icon: User },
      { to: '/admin/referees', label: 'Referees', icon: Badge },
    ],
  },
  {
    label: 'Competition',
    items: [
      { to: '/admin/games', label: 'Games', icon: Gamepad2 },
    ],
  },
];
