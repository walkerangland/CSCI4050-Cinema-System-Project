import Image from 'next/image'
import Link from 'next/link'
import { GetMovie as fetchMovie } from '../lib/movies'
 
export default function Page() {
  return (<div style = {{textAlign:'center'}}>
            <h1>Welcome to [movie app]!</h1>
            <h2>Currently Playing Movies:</h2>
            <GetMovies type="now-playing" />
            <h2>Coming Soon Movies:</h2>
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
    <div style = {{display: "flex", flexDirection: "row", gap: '4rem', overflowX: "auto", justifyContent: "center"}}>
      {movies.map((movie) => (
        <div key = {movie.id ?? movie.posterUrl} >
          <div style={{border: '4px solid #e5e7eb', borderRadius: '12px',  backgroundColor: 'white'}}> 
            <h2 style={{fontSize: '1.1rem', fontWeight: 'bold', margin: 3 }}>{movie.title}</h2>
            <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem', backgroundColor: '#f3f4f6', borderRadius: '999px', color: '#6b7280'}}>{movie.rating}</span>
            <div style={{width: '180px'}}> 
              <Link href = "/book">
                <Image
                  src={movie.posterUrl}
                  alt= {movie.posterUrl}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: '100%', height: 'auto', borderRadius:'12px'}}
                />
              </Link>
              
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}