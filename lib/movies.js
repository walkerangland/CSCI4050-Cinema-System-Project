const MOVIE_DATA = [
  {
    id: '1',
    title: 'Super Mario Galaxy',
    genre: 'Adventure',
    rating: 'PG-13',
    description: 'Mario and Luigi go on an adventure to stop Bowser Jr. from freeing his father.',
    posterUrl: '/superMarioGalaxy.jpeg',
    trailerUrl: 'https://www.youtube.com/watch?v=GuCejewteF8',
    status: 'now-playing',
    director: 'Asron Horvath and Michael Jelenic',
    producer: 'Chris Meledandri and Shigeru Miyamoto',
    cast: ['Chris Pratt', 'Anya Taylor-Joy', 'Charlie Day'],
    createdAt: '2026-06-26',
    updatedAt: '2026-06-26',
  },
  {
    id: '2',
    title: 'Hail Mary',
    genre: 'Sci-Fi',
    rating: 'PG-13',
    description: 'A middle school science teacher wakes up on board a spaceship, with amnesia, on a journey to save the Earth.',
    posterUrl: '/projectHailMary.jpeg',
    trailerUrl: 'https://www.youtube.com/watch?v=m08TxIsFTRI',
    status: 'now-playing',
    director: 'Phil Lord and Christopher Miller',
    producer: 'Ryan Gosling, Phil Lord, and Christopher Miller',
    cast: ['Ryan Gosling', 'Sandra Huller', 'James Ortiz'],
    createdAt: '2026-06-26',
    updatedAt: '2026-06-26',
  },
  {
    id: '3',
    title: 'The Minecraft Movie',
    genre: 'Fantasy',
    rating: 'PG-13',
    description: 'Siblings find their way into a fantasy video game world. They must embark on a dangerous journey to prevent the world from being overtaken by creatures from this new world.',
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
    title: 'Obsession',
    genre: 'Drama',
    rating: 'PG-13',
    description: 'Baron Bailey, struggling with love, wishes his crush would fall in love with him.',
    posterUrl: '/obsession.jpeg',
    trailerUrl: 'https://www.youtube.com/watch?v=xJYoN-fX2j0',
    status: 'now-playing',
    director: 'Curry Barker',
    producer: 'James Harris, Haley Nicole Johnson, Christian Mercuri, and Roman Viaris',
    cast: ['Michael Johnston', 'Inde Navarrette', 'Cooper Tomlinson'],
    createdAt: '2026-06-26',
    updatedAt: '2026-06-26',
  },
  {
    id: '5',
    title: 'Avatar: Fire and Ash',
    genre: 'Action',
    rating: 'PG-13',
    description: 'The Sully family must unite the tribes of Pandora to prevent catastrophic destruction of a sentient planet and diverse ecosystems.',
    posterUrl: '/avatarFireAndAsh.jpeg',
    trailerUrl: 'https://www.youtube.com/watch?v=nb_fFj_0rq8',
    status: 'now-playing',
    director: 'James Cameron',
    producer: 'James Cameron and Jon Landau',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
    createdAt: '2026-06-26',
    updatedAt: '2026-06-26',
  },
  {
    id: '6',
    title: 'Hoppers',
    genre: 'Adventure',
    rating: 'PG',
    description: 'A college student lives a life as a beaver.',
    posterUrl: '/hoppers.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=PypDSyIRRSs',
    status: 'coming-soon',
    director: 'Daniel Chong',
    producer: 'Nicole Paradis Grindle',
    cast: ['Piper Curda', 'Bobby Moynihan', 'Jon Hamm'],
    createdAt: '2026-06-26',
    updatedAt: '2026-06-26',
  },
  {
    id: '7',
    title: 'Dune: Part Three',
    genre: 'Sci-Fi',
    rating: 'PG-13',
    description: 'A continuation of a world, ruled by the control of spice, continues to unfold as war continues.',
    posterUrl: '/dunePartThree.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=3_9vCamtuPY',
    status: 'coming-soon',
    director: 'Denis Villeneuve',
    producer: 'Mary Parent and Cale Boyter',
    cast: ['Timothee Chalamet', 'Zendaya Coleman', 'Jason Momoa'],
    createdAt: '2026-06-26',
    updatedAt: '2026-06-26',
  },
  {
    id: '8',
    title: 'The Hunger Games: Sunrise on the Reaping',
    genre: 'Action',
    rating: 'PG-13',
    description: 'A renowned dystopian world returns to explore other secrets of the Hunger Games.',
    posterUrl: '/theHungerGames.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=fS35YSjopjE',
    status: 'coming-soon',
    director: 'Francis Lawrence',
    producer: 'Nina Jacobson, Brad Simpson, and Francis Lawrence',
    cast: ['Joseph Zada', 'Jesse Plemons', 'Elle Fanning'],
    createdAt: '2026-06-26',
    updatedAt: '2026-06-26',
  },
  {
    id: '9',
    title: 'Spider-Man: Brand New Day',
    genre: 'Sci-Fi',
    rating: 'PG-13',
    description: 'Peter Parker must navigate his city after everyone has forgotten about his existence',
    posterUrl: '/spidermanBrandNewDay.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=tLeBDumanoc',
    status: 'coming-soon',
    director: 'Destin Daniel Cretton',
    producer: 'Kevin Feige',
    cast: ['Tom Holland', 'Zendaya Coleman', 'Sadie Sink'],
    createdAt: '2026-06-26',
    updatedAt: '2026-06-26',
  },
  {
    id: '10',
    title: 'Gulliver\'s Travels',
    genre: 'Fantasy',
    rating: 'PG',
    description: 'An explorer embarks on a journey to a distant lands.',
    posterUrl: '/gulliversTravels.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=_F_WwefYLIs',
    status: 'coming-soon',
    director: 'Dave Fleischer',
    producer: 'Max Fleischer',
    cast: ['Sam Parker', 'Tedd Pierce', 'Livonia Warren'],
    createdAt: '2026-06-26',
    updatedAt: '2026-06-26',
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
