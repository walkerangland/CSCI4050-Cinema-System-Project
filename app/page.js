import Image from 'next/image'
import Link from 'next/link'
import styles from './home.module.css'
import FavoriteButton from './favoriteButton'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function Page() {
  const nowPlayingMovies = await prisma.movie.findMany({
    where: { status: 'CURRENTLY_RUNNING' },
    take: 5
  })

  const comingSoonMovies = await prisma.movie.findMany({
    where: { status: 'COMING_SOON' },
    take: 5
  })

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Welcome to Movie Portal</h1>
        <p className={styles.heroSubtitle}>Discover Now Playing and Coming Soon movies.</p>
      </div>

      <h2 className={styles.sectionTitle}>Now Playing</h2>
      <MovieGrid movies={nowPlayingMovies} />

      <h2 className={styles.sectionTitle}>Coming Soon</h2>
      <MovieGrid movies={comingSoonMovies} />
    </div>
  );
}

function MovieGrid({ movies }) {
  if (!movies || movies.length === 0) {
    return <p style={{ color: '#aaaaaa', textAlign: 'center', padding: '2rem' }}>No movies available.</p>
  }

  return (
    <div className={styles.cards}>
      {movies.map((movie) => {
        const urlStatus = movie.status === 'CURRENTLY_RUNNING' ? 'now-playing' : 'coming-soon'

        return (
          <div key={movie.id} className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 className={styles.cardTitle}>{movie.title}</h3>
              <FavoriteButton movieId={movie.id} />
            </div>
            <span className={styles.ratingPill}>{movie.rating}</span>
            
            <div style={{ width: '100%', marginTop: '0.5rem' }}>
              <Link href={`details/${urlStatus}/${movie.id}`}>
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
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link className={styles.bookBtn} href={`details/${urlStatus}/${movie.id}`}>
                Book Now
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}