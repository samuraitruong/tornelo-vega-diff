export interface TorneloPlayer {
  flag: string;
  player: string;
  rating: number | null;
  gender: string;
  yob: number | null;
  u: number | null;
  skip: boolean;
  bye: boolean;
}

export interface VegaPlayer {
  id: string;
  name: string;
  rating: number | null;
  country: string;
  gender: string;
  birthYear: number | null;
}
