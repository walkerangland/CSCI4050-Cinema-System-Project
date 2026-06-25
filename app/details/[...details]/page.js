import  { GetMovie } from "../../../lib/movies"
import Image from 'next/image'
import Link from 'next/link'

export default async function Page({ params }) {
    const { details } = await params

    const movie = GetMovie(details[0], details[1])
    return (
        <div style={{border: '4px solid #e5e7eb', borderRadius: '12px',  backgroundColor: 'white', marginTop:20, width:'700px'}}> 
            <h2 style={{fontSize: '1.1rem', fontWeight: 'bold', margin: 3 }}>{movie.title}</h2>
            <div style={{width: '180px', display:'flex'}}> 
                <Image
                  src={movie.posterUrl}
                  alt= {movie.posterUrl}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: '100%', height: 'auto', borderRadius:'12px'}}
                />
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', height: '100%', justifyContent: "center"}}>
                    <span style={{ fontSize: '0.75rem', padding: '0.5rem', backgroundColor: '#f3f4f6', borderRadius: '999px', color: '#6b7280'}}>{movie.rating}</span>
                    <span style={{ fontSize: '1rem', padding: '0.5rem 0.5rem', backgroundColor: '#ede9fe', color: '#7c3aed', borderRadius: '999px' }}>{movie.genre}</span>
                    <span style={{ fontSize: '1rem', padding: '0.1rem 0.5rem', backgroundColor: movie.status === 'now-playing' ? '#dcfce7' : '#fef9c3', color: movie.status === 'now-playing' ? '#16a34a' : '#ca8a04', borderRadius: '999px' }}>
                      {movie.status === 'now-playing' ? ' Now Playing' : ' Coming Soon'}
                    </span>
                  </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.5rem 0', paddingTop:'0.75rem' }}>{movie.description}</p>
            
            {movie.status === 'now-playing' && (
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', paddingTop:'0.5rem', paddingBottom:'0.5rem' }}>
                      {['2:00 PM', '5:00 PM', '8:00 PM'].map((time) => (
                        <Link
                          key={time}
                          href={`/book?movie=${encodeURIComponent(movie.title)}&time=${encodeURIComponent(time)}`}
                          style={{
                            padding: '0.3rem 0.75rem',
                            backgroundColor: '#1a1a2e',
                            color: 'white',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            textDecoration: 'none',
                          }}
                        >
                          {time}
                        </Link>
                      ))}
                    </div>
                  )}
          </div>
    )
}