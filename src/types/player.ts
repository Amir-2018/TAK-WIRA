export interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  age: number;
  nationality: string;
  height: string;
  weight: string;
  image?: string;
}

export type PlayerFormData = Omit<Player, 'id'>;

