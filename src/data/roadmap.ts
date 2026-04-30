export type RoadmapGroup = {
  label: string;
  description: string;
  items: string[];
};

export const roadmapGroups: RoadmapGroup[] = [
  {
    label: 'Now',
    description: 'Current development focus areas that shape the playable foundation.',
    items: [
      'Blueprint placement polish',
      'Core colony job loop',
      'Power visibility and feedback',
      'Early survival flow'
    ]
  },
  {
    label: 'Next',
    description: 'Systems planned after the current foundation stabilizes.',
    items: [
      'Research and unlock flow',
      'Markdown-driven public updates',
      'Improved media gallery',
      'Stockpile and logistics clarity'
    ]
  },
  {
    label: 'Later',
    description: 'Longer-term public-facing milestones that should arrive when the game is ready for wider visibility.',
    items: [
      'Steam page and wishlist campaign',
      'Closed alpha tester dashboard',
      'Press kit asset downloads',
      'Expanded world and enemy pressure systems'
    ]
  },
  {
    label: 'Completed',
    description: 'Public site foundations that are already in place.',
    items: [
      'Official website hub',
      'Modular Astro foundation',
      'Markdown-powered devlog system',
      'Website build validation'
    ]
  }
];
