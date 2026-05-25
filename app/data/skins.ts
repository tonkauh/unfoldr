export interface Skin {
  id: string;
  name: string;
  type: 'FREE' | 'PREMIUM';
  price?: string;
  colors: {
    bg: string;
    paper: string;
    text: string;
    accent: string;
    ribbon: string;
  };
  texture?: string;
}

export const SKINS: Skin[] = [
  {
    id: 'classic',
    name: 'Classic Pastel',
    type: 'FREE',
    colors: {
      bg: '#F7F3F0',
      paper: '#FFFDFB',
      text: '#5D554D',
      accent: '#8A817C',
      ribbon: '#D4AF37',
    },
    texture: 'handmade-paper',
  },
  {
    id: 'retro',
    name: 'Retro Matte',
    type: 'FREE',
    colors: {
      bg: '#D1D5DB',
      paper: '#FFFFFF',
      text: '#1F2937',
      accent: '#DC2626',
      ribbon: '#EF4444',
    },
    texture: 'pinstripe',
  },
  {
    id: 'artisanal',
    name: 'Artisanal Kraft',
    type: 'PREMIUM',
    price: '$1.99',
    colors: {
      bg: '#2B2621',
      paper: '#C69C6D',
      text: '#1A1410',
      accent: '#4A3728',
      ribbon: '#3E2723',
    },
    texture: 'kraft-paper',
  },
  {
    id: 'midnight',
    name: 'Midnight Holograph',
    type: 'PREMIUM',
    price: '$1.99',
    colors: {
      bg: '#0A0A0A',
      paper: '#1F1F1F',
      text: '#E0E7FF',
      accent: '#6366F1',
      ribbon: '#C026D3',
    },
    texture: 'noise',
  },
];
