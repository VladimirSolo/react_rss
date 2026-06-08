export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
}

export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface ApiResponse {
  info: ApiInfo;
  results: Character[];
}

export interface FormSubmission {
  id: string;
  name: string;
  age: number;
  email: string;
  gender: string;
  country: string;
  image: string;
  submittedAt: number;
}
