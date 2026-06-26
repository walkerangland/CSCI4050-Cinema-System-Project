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
  {
    id: '6',
    title: 'Whispers of the Forest',
    genre: 'Mystery',
    rating: 'PG-13',
    description: 'A detective investigates a series of mysterious events in a small town.',
    posterUrl: '/minecraftMovie.webp',
    trailerUrl: 'https://www.youtube.com/watch?v=example-whispers-of-the-forest',
    status: 'coming-soon',
    director: 'Liam Chen',
    producer: 'Sophie Kim',
    cast: ['Ella Park', 'James Lee', 'Olivia Wang'],
    createdAt: '2026-06-22',
    updatedAt: '2026-06-25',
  },
  {
    id: '7',
    title: 'Echoes of the Past',
    genre: 'Historical',
    rating: 'PG-13',
    description: 'A young woman discovers her family\'s hidden history through a series of letters.',
    posterUrl: '/minecraftMovie.webp',
    trailerUrl: 'https://www.youtube.com/watch?v=example-echoes-of-the-past',
    status: 'coming-soon',
    director: 'Amara Patel',
    producer: 'Liam Chen',
    cast: ['Sophie Kim', 'James Lee', 'Olivia Wang'],
    createdAt: '2026-06-30',
    updatedAt: '2026-07-02',
  },
  {
    id: '8',
    title: 'The Time Traveler',
    genre: 'Sci-Fi',
    rating: 'PG-13',
    description: 'A scientist discovers a way to travel through time.',
    posterUrl: '/minecraftMovie.webp',
    trailerUrl: 'https://www.youtube.com/watch?v=example-the-time-traveler',
    status: 'coming-soon',
    director: 'Evelyn Shaw',
    producer: 'Marcus Lee',
    cast: ['Daniel Kim', 'Ava Patel', 'Liam Chen'],
    createdAt: '2026-07-05',
    updatedAt: '2026-07-10',
  },
  {
    id: '9',
    title: 'The Lost City',
    genre: 'Adventure',
    rating: 'PG-13',
    description: 'A group of explorers search for a legendary city hidden in the jungle.',
    posterUrl: '/minecraftMovie.webp',
    trailerUrl: 'https://www.youtube.com/watch?v=example-the-lost-city',
    status: 'now-playing',
    director: 'Oliver Stone',
    producer: 'Emma Watson',
    cast: ['Chris Pratt', 'Zoe Saldana', 'Tom Holland'],
    createdAt: '2026-07-15',
    updatedAt: '2026-07-20',
  },
  {
    id: '10',
    title: 'Gulliver\'s Travels',
    genre: 'Fantasy',
    rating: 'PG',
    description: 'An explorer embarks on a journey to a distant lands.',
    posterUrl: '/minecraftMovie.webp',
    trailerUrl: 'https://www.youtube.com/watch?v=_F_WwefYLIs',
    status: 'now-playing',
    director: 'Dave Fleischer',
    producer: 'Max Fleischer',
    cast: ['Sam Parker', 'Tedd Pierce', 'Livonia Warren'],
    createdAt: '2026-05-25',
    updatedAt: '2026-06-01',
  }
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

export function GetMovieByID(id) {
  const matches = MOVIE_DATA.find((movie) => movie.id === String(id));
  return matches ? new Movie(matches) : null;
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
