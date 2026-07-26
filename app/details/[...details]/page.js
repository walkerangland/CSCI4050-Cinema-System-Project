'use client'
import { GetMovieByID } from "../../../lib/movies"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Page({ params }) {
    const [showtimes, setShowtimes] = useState(null)
    const [embedUrl, setEmbedUrl] = useState(null)
    const [movie, setMovie] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loading1, setLoading1] = useState(true)

    useEffect(() => {
        const getMovie = async () => {
            try {
                const details = await params
                const m = GetMovieByID(details.details[1])
                setMovie(m)
                const embed = m?.trailerUrl?.replace("watch?v=", "embed/")
                setEmbedUrl(embed)
                if (!m?.id) {
                    setShowtimes([])
                    return
                }
                const res = await fetch(`/api/showtimes?movieId=${encodeURIComponent(m.id)}`);
                const data = await res.json();

                if (!res.ok) {
                    alert(data?.message || "Failed to retrieve showtimes")
                    return
                }
            setShowtimes(data)
            } catch (err) {
                console.error(err)
                setShowtimes([])
            } finally {
                setLoading(false)
            }
        }
        getMovie()
    }, [params])

    if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: '4rem' }}>Loading movie details...</div>
    const showtimesList = showtimes.map((st) => {
    const d = new Date(st.startTime)
    const date = d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    })

    const time = d.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: "false",
    })
    return [date, time]
})
    console.log('shotimes:', showtimes)
    console.log('showtimes list ', showtimesList)

    return (
        <div style={{color: '#ffffff'}}>
            <div style={{border: '4px solid #5a0000', borderRadius: '12px',  backgroundColor: '#1c1c1c', marginTop:20, width:'100%'}}> 
                <div style={{width: '100vw'}}>
                    <div style={{display:'flex', margin: '1rem'}}>
                        <h2 style={{fontSize: '1.1rem', fontWeight: 'bold', margin: '2px'}}>{movie.title}</h2>
                        <span style={{ fontSize: '0.75rem', padding: '0.3rem', backgroundColor: '#1a0000', borderRadius: '999px', color: '#f5c518'}}>{movie.rating}</span>
                        </div>
                        <div style= {{display:'flex', marginLeft:'1rem'}}>
                            <span style={{ fontSize: '0.8rem', padding: '0.5rem 0.5rem', margin:'5px', backgroundColor: '#1a0000', color: '#f5c518', borderRadius: '999px' }}>{movie.genre}</span>
                            <span style={{ fontSize: '0.8rem', padding: '0.5rem 0.5rem', margin:'5px', backgroundColor: movie.status === 'now-playing' ? '#dcfce7' : '#fef9c3', color: movie.status === 'now-playing' ? '#16a34a' : '#ca8a04', borderRadius: '999px' }}>
                            {movie.status === 'now-playing' ? ' Now Playing' : ' Coming Soon'}
                            </span>
                        </div>
                <div style={{display:'flex', marginLeft:'1rem'}}>
                    <Image
                    src={movie.posterUrl}
                    alt={movie.posterUrl}
                    width={180}
                    height={0}
                    style={{ width: '180px', height: 'auto', borderRadius:'12px'}}
                    />
                    <p style={{ padding:'0.5rem', width:'200px', fontSize: '0.875rem', color: '#dddddd', margin: '0 0 0.5rem 0', paddingTop:'0.75rem' }}>{movie.description}</p>
                    <iframe
                        src={embedUrl}
                        frameBorder="0"
                        title={`${movie.title} Trailer`}
                        style={{ width: '30%', height: 'auto', borderRadius: '12px' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                </div>
                <div style={{fontSize: '1.30rem'}}>
                    <p>Showtimes:</p>
                </div>
                {movie.status === 'now-playing' && loading === false &&(
                    <div>
                        <GenerateList showtimes={showtimesList} movie = {movie}/>
                    </div>
                    )}
                    </div>
                </div>
          </div>
    )
}

function GenerateList({showtimes, movie}) {
  const byDate = showtimes.reduce((acc, [date, time]) => {
    if (!acc[date]) acc[date] = [];
    acc[date].push(time);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(byDate).map(([date, times]) => (
        <div key={date} style={{ marginBottom: '0.75rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
            {date}
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {times.map((time) => (
              <div key={`${date}-${time}`}>
                <Link
                    key={`${date}-${time}`}
                    href={`/book?movie=${encodeURIComponent(movie.title)}&time=${encodeURIComponent(date + ' '+ time)}`}
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
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function element() {
    <div key = {st.id ?? d.toISOString}>
        <p>{date}</p>
        <Link
            key={st.id ?? d.toISOString}
            href={`/book?movie=${encodeURIComponent(movie.title)}&time=${encodeURIComponent(d.toISOString)}`}
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
    </div>
}
