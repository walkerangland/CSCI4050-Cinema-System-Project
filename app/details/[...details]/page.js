import Image from 'next/image'
import Link from 'next/link'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function Page({ params }) {
    const { details } = await params
    
    const movieId = parseInt(details[1])
    const movie = await prisma.movie.findUnique({
        where: { id: movieId }
    })

    if (!movie) {
        return <div style={{ color: '#ffffff', padding: '2rem', textAlign: 'center' }}>Movie not found.</div>
    }

    const embedUrl = movie.trailerUrl?.replace("watch?v=", "embed/")
    
    const showtimes = await prisma.showtime.findMany({
        where: {
            movieId: movieId,
            startTime: { gte: new Date() }
        },
        orderBy: { startTime: 'asc' },
        include: { hall: true }
    })
    
    const dates = new Set(showtimes.map(st => st.startTime.toLocaleDateString()))

    return (
        <div style={{color: '#ffffff', padding: '1rem'}}>
            <div style={{border: '4px solid #5a0000', borderRadius: '12px', backgroundColor: '#1c1c1c', margin: '20px auto', maxWidth: '1000px', width: '100%'}}>
                <div style={{padding: '1.5rem'}}>
                    
                    {/* Header Section */}
                    <div style={{display:'flex', alignItems: 'center', marginBottom: '1rem'}}>
                        <h2 style={{fontSize: '1.75rem', fontWeight: 'bold', margin: '0 15px 0 0'}}>{movie.title}</h2>
                        <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', backgroundColor: '#1a0000', borderRadius: '999px', color: '#f5c518'}}>{movie.rating}</span>
                    </div>
                    
                    <div style={{display:'flex', marginBottom: '1.5rem'}}>
                        <span style={{ fontSize: '0.85rem', padding: '0.5rem 0.8rem', marginRight: '10px', backgroundColor: '#1a0000', color: '#f5c518', borderRadius: '999px' }}>{movie.genre}</span>
                        <span style={{ fontSize: '0.85rem', padding: '0.5rem 0.8rem', backgroundColor: movie.status === 'CURRENTLY_RUNNING' ? '#dcfce7' : '#fef9c3', color: movie.status === 'CURRENTLY_RUNNING' ? '#16a34a' : '#ca8a04', borderRadius: '999px' }}>
                            {movie.status === 'CURRENTLY_RUNNING' ? 'Now Playing' : 'Coming Soon'}
                        </span>
                    </div>
                    
                    {/* Media & Description Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                        
                        {/* Poster + Trailer */}
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <Image
                                src={movie.posterUrl}
                                alt={movie.title + ' poster'}
                                width={180}
                                height={270}
                                style={{ width: '180px', height: '270px', objectFit: 'cover', borderRadius:'12px'}}
                            />
                            {embedUrl && (
                                <iframe
                                    src={embedUrl}
                                    frameBorder="0"
                                    title={`${movie.title} Trailer`}
                                    style={{ flex: '1 1 300px', height: '270px', borderRadius: '12px' }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            )}
                        </div>
                        
                        {/* Bottom row: Description */}
                        <p style={{ fontSize: '1.05rem', color: '#cccccc', margin: 0, lineHeight: '1.6' }}>
                            {movie.description}
                        </p>
                    </div>

                    {/* Showtimes Section */}
                    {movie.status === 'CURRENTLY_RUNNING' && (
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', paddingTop:'1.5rem', borderTop: '1px solid #333' }}>
                            {showtimes.length > 0 ? (
                                showtimes.map((st) => {
                                    const timeString = st.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    const dateText = st.startTime.toLocaleDateString([], { month: 'short', day: 'numeric' })
                                    const dateNumeric = st.startTime.toLocaleDateString()
                                    
                                    let newDate = false
                                    if (dates.has(dateNumeric)) {
                                        dates.delete(dateNumeric)
                                        newDate = true
                                    }
                                    
                                    return (
                                        <div key={st.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            {newDate ? (
                                                <div>
                                                    <span style={{ fontSize: '0.875rem', color: '#aaaaaa', paddingBottom: '0.25rem' }}>{dateText}</span>
                                                </div>
                                            ) : (
                                                <div style={{ height: '1.2rem' }}></div>
                                            )}
                                            <Link
                                                href={`/book?movie=${encodeURIComponent(movie.title)}&showtimeId=${st.id}&time=${encodeURIComponent(timeString)}&date=${encodeURIComponent(dateNumeric)}&hallId=${encodeURIComponent(st.hallId)}`}
                                                style={{
                                                    padding: '0.5rem 0.8rem',
                                                    backgroundColor: '#1a1a2e',
                                                    color: 'white',
                                                    borderRadius: '6px',
                                                    fontSize: '0.85rem',
                                                    textDecoration: 'none',
                                                    marginTop: '0.25rem'
                                                }}
                                            >
                                                {timeString} ({st.hall.name})
                                            </Link>
                                        </div>
                                    )
                                })
                            ) : (
                                <span style={{ fontSize: '0.875rem', color: '#aaaaaa' }}>No showtimes scheduled.</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}