export type MediaItem = {
  title: string;
  type: 'Screenshot' | 'Trailer' | 'Key Art' | 'UI';
  status: 'Available' | 'Coming Later';
  description: string;
  accent: string;
};

export const mediaItems: MediaItem[] = [
  {
    title: 'Crash Site Establishment',
    type: 'Screenshot',
    status: 'Coming Later',
    description: 'A first look at the fragile landing zone that becomes the center of the colony.',
    accent: 'Landing Zone'
  },
  {
    title: 'Colony Systems Overview',
    type: 'UI',
    status: 'Coming Later',
    description: 'Interface-focused media showing how the player reads colony state, pressure, and priorities.',
    accent: 'Command UI'
  },
  {
    title: 'Automation and Logistics',
    type: 'Screenshot',
    status: 'Coming Later',
    description: 'Future screenshots showing production, stockpiles, hauling, and colony-scale logistics.',
    accent: 'Infrastructure'
  },
  {
    title: 'Official Gameplay Trailer',
    type: 'Trailer',
    status: 'Coming Later',
    description: 'The future public trailer destination once gameplay footage is ready for wider visibility.',
    accent: 'Video'
  },
  {
    title: 'Key Art and Capsules',
    type: 'Key Art',
    status: 'Coming Later',
    description: 'Future brand art, social graphics, store capsules, and press-safe visual assets.',
    accent: 'Brand Assets'
  }
];
