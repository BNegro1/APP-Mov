export interface Album {
  id?: string;
  title: string;
  artist: string;
  cover: string;
  releaseDate?: string;
  genre?: string;
  liked?: boolean;
  disliked?: boolean;
}
