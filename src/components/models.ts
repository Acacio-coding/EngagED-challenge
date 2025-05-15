export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: Origin;
  location: Location;
  image: string;
  created: string;
}

export interface Location {
  name: string;
}

export interface Origin {
  name: string;
}
