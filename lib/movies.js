const MOVIE_DATA = [
  {
    id: '1',
    title: 'Solar Drift',
    genre: 'Sci-Fi',
    rating: 'PG-13',
    description: 'A crew races to save Earth from a solar storm.',
    posterUrl: '/minecraftMovie.webp',
    trailerUrl: 'https://www.youtube.com/watch?v=example-solar-drift',
    status: 'now-playing',
    director: 'Ava Lennox',
    producer: 'Oliver Park',
    cast: ['Maya Lewis', 'Noah Kim', 'Sam Patel'],
    createdAt: '2026-06-01',
    updatedAt: '2026-06-10',
  },
  {
    id: '2',
    title: 'Midnight Garden',
    genre: 'Fantasy',
    rating: 'PG',
    description: 'A magical garden opens only after midnight.',
    posterUrl: '/minecraftMovie.webp',
    trailerUrl: 'https://www.youtube.com/watch?v=example-midnight-garden',
    status: 'now-playing',
    director: 'Mia Brooks',
    producer: 'Jules Hart',
    cast: ['Lina Torres', 'Ethan Cho', 'Zoe Grant'],
    createdAt: '2026-05-20',
    updatedAt: '2026-06-05',
  },
  {
    id: '3',
    title: 'The Last Encore',
    genre: 'Drama',
    rating: 'R',
    description: 'A retired pianist must play one final concert.',
    posterUrl: '/minecraftMovie.webp',
    trailerUrl: 'https://www.youtube.com/watch?v=example-last-encore',
    status: 'now-playing',
    director: 'Noah Ellis',
    producer: 'Hannah Ray',
    cast: ['Jonas Reed', 'Priya Nair', 'Marcus Dean'],
    createdAt: '2026-05-28',
    updatedAt: '2026-06-12',
  },
  {
    id: '4',
    title: 'Neon Horizon',
    genre: 'Action',
    rating: 'PG-13',
    description: 'A former agent fights to stop a city-wide power outage.',
    posterUrl: '/minecraftMovie.webp',
    trailerUrl: 'https://www.youtube.com/watch?v=example-neon-horizon',
    status: 'coming-soon',
    director: 'Lena Park',
    producer: 'Toby Hale',
    cast: ['Carter Blake', 'Rhea Singh', 'Isa Alvarez'],
    createdAt: '2026-06-15',
    updatedAt: '2026-06-18',
  },
  {
    id: '5',
    title: 'Sea of Stars',
    genre: 'Adventure',
    rating: 'PG',
    description: 'A young explorer sails toward the horizon of a starlit sea.',
    posterUrl: '/minecraftMovie.webp',
    trailerUrl: 'https://www.youtube.com/watch?v=example-sea-of-stars',
    status: 'coming-soon',
    director: 'Noemi Alvarez',
    producer: 'Dean Frost',
    cast: ['Mila Jo', 'Harper Quinn', 'Noel Vega'],
    createdAt: '2026-06-18',
    updatedAt: '2026-06-20',
  },
];

export class Movie {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.genre = data.genre;
    this.rating = data.rating;
    this.description = data.description;
    this.posterUrl = data.posterUrl;
    this.trailerUrl = data.trailerUrl;
    this.status = data.status;
    this.director = data.director;
    this.producer = data.producer;
    this.cast = data.cast;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  DisplayTrailer() {
    return this.trailerUrl;
  }
}

const STATUS_MAP = {
  'now-playing': 'now-playing',
  'coming-soon': 'coming-soon',
  'nowplaying': 'now-playing',
  'comingsoon': 'coming-soon',
  nowPlaying: 'now-playing',
  comingSoon: 'coming-soon',
};

export function GetMovie(type = 'now-playing', index = 0) {
  const normalizedType = STATUS_MAP[type] ?? 'now-playing';
  const matches = MOVIE_DATA.filter((movie) => movie.status === normalizedType);
  const data = matches[index % matches.length] ?? MOVIE_DATA[0];
  return new Movie(data);
}

export function FilterAndSearch(genre = '', searchPhrase = '') {
  const requestedGenre = genre?.trim().toLowerCase();
  const requestedSearch = searchPhrase?.trim().toLowerCase();

  return MOVIE_DATA.filter((movie) => {
    const genreMatches = !requestedGenre || movie.genre.toLowerCase() === requestedGenre;
    const searchMatches =
      !requestedSearch ||
      movie.title.toLowerCase().includes(requestedSearch) ||
      movie.description.toLowerCase().includes(requestedSearch);
    return genreMatches && searchMatches;
  }).map((data) => new Movie(data));
}
