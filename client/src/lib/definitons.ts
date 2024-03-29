export type Song = {
  id: number;
  title: string;
  url: string;
  primary_artist: {
    id: number;
    name: string;
  };
  featured_artists: {
    id: number;
    name: string;
  }[];
  release_date_for_display: string;
  song_art_image_thumbnail_url: string;
  song_art_image_url: string;
  album?: {
    id: number;
    name: string;
    cover_art_url: string;
    url: string;
  };
};

export type Artist = {
  id: number;
  name: string;
  image_url: string;
  url: string;
};
