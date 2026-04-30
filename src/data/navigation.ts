export type NavigationItem = {
  label: string;
  href: string;
  key?: string;
};

export const navigationItems: NavigationItem[] = [
  { label: 'Home', href: '/', key: 'home' },
  { label: 'About', href: '/about/', key: 'about' },
  { label: 'Features', href: '/features/', key: 'features' },
  { label: 'Game', href: '/game/', key: 'game' },
  { label: 'Media', href: '/media/', key: 'media' },
  { label: 'Devlog', href: '/devlog/', key: 'devlog' },
  { label: 'Links', href: '/links/', key: 'links' },
  { label: 'Contact', href: '/contact/', key: 'contact' }
];

export const footerLinks: NavigationItem[] = [
  { label: 'Steam', href: '/steam/' },
  { label: 'Join Discord', href: 'https://discord.gg/9HEBafkKgs' },
  { label: 'YouTube', href: '/youtube/' },
  { label: 'Contact', href: '/contact/' }
];
