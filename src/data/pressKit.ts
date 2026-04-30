export type PressFact = {
  label: string;
  value: string;
};

export type PressAssetGroup = {
  title: string;
  description: string;
  status: string;
};

export const pressFacts: PressFact[] = [
  { label: 'Game', value: 'Kelaris' },
  { label: 'Genre', value: 'Sci-fi colony survival sim' },
  { label: 'Platform', value: 'PC' },
  { label: 'Status', value: 'In development' },
  { label: 'Developer', value: 'Glass Anvil Studios' },
  { label: 'Website', value: 'kelaris.io' }
];

export const pressAssets: PressAssetGroup[] = [
  {
    title: 'Screenshots',
    description: 'Gameplay screenshots and UI images for future articles, posts, and store pages.',
    status: 'Coming later'
  },
  {
    title: 'Logos and key art',
    description: 'Transparent logos, capsule art, social images, and brand-safe visual assets.',
    status: 'Coming later'
  },
  {
    title: 'Trailer and video',
    description: 'Embeddable trailers and gameplay clips when public video content is ready.',
    status: 'Coming later'
  }
];
