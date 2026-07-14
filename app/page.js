import Image from 'next/image'
import Link from 'next/link'
import styles from './home.module.css'
import { GetMovie as fetchMovie } from '../lib/movies'
import FavoriteButton from './favoriteButton'
 
export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Welcome to Movie Portal</h1>
        <p className={styles.heroSubtitle}>Discover Now Playing and Coming Soon movies.</p>
      </div>

      <h2 className={styles.sectionTitle}>Now Playing</h2>
      <GetMovies type="now-playing" />

      <h2 className={styles.sectionTitle}>Coming Soon</h2>
      <GetMovies type="coming-soon" />
    </div>
  );
}

//Gets the first 5 movies listed in the database of param type and displays them
function GetMovies({ type }) {
  const movies = [
    fetchMovie(type, 0),
    fetchMovie(type, 1),
    fetchMovie(type, 2),
    fetchMovie(type, 3),
    fetchMovie(type, 4),
  ]
  return (
    <div className={styles.cards}>
      {movies.map((movie) => (
        <div key={movie.id ?? movie.posterUrl} className={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 className={styles.cardTitle}>{movie.title}</h3>
            <FavoriteButton movieId={movie.id} />
          </div>
          <span className={styles.ratingPill}>{movie.rating}</span>

          <div style={{ width: '100%', marginTop: '0.5rem' }}>
            <Link href={`details/${movie.status}/${movie.id}`}>
              <Image
                src={movie.posterUrl}
                alt={movie.title + ' poster'}
                width={220}
                height={330}
                sizes="(max-width: 600px) 180px, 220px"
                className={styles.poster}
              />
            </Link>
          </div>

          <div className={styles.gallery}>
            <img src={movie.posterUrl} alt={`${movie.title} photo`} className={styles.thumbnail} />
          </div>

          <Link className={styles.bookBtn} href={`details/${movie.status}/${movie.id}`}>
            Book Now
          </Link>
        </div>
      ))}
    </div>
  )
}