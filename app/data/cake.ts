export interface CakeConfig {
  flavor: string;
  icingColor: string;
  topping: 'sprinkles' | 'none';
  candleCount: number;
}

export const CAKE_FLAVORS = [
  { id: 'vanilla', name: 'Vanilla', color: '#FFFDFB' },
  { id: 'chocolate', name: 'Chocolate', color: '#4E342E' },
  { id: 'strawberry', name: 'Strawberry', color: '#FFB5C2' },
  { id: 'matcha', name: 'Matcha', color: '#8F9779' },
];

export const ICING_COLORS = [
  { id: 'white', color: '#FFFFFF' },
  { id: 'pink', color: '#F9A8D4' },
  { id: 'yellow', color: '#FDE047' },
  { id: 'blue', color: '#7DD3FC' },
];
