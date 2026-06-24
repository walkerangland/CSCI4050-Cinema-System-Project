import Image from 'next/image'
import { GetMovie as fetchMovie } from '../lib/movies'
 
export default function Page() {
  return (<div>
            <h1>Welcome to [movie app]!</h1>
            <h2>Currently Playing Movies:</h2>
            <GetMovies type="now-playing" />
            <h2>Coming Soon Movies:</h2>
            <GetMovies type="coming-soon" />
          </div>
  );
  
}
function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
} 

//Gets (random?) movies, (todo: add parameter that changes whether movies are now playing or coming soon)
function GetMovies({ type }) {
  const movies = [
    fetchMovie(type, 0),
    fetchMovie(type, 1),
    fetchMovie(type, 2),
    fetchMovie(type, 3),
    fetchMovie(type, 4),
  ]
  return (   
    <div style = {{display: "flex", flexDirection: "row", gap: 16, overflowX: "auto"}}>
      {movies.map((movie) => (
        <div key = {movie.id ?? movie.posterUrl}>
          <div style={{width: '100px'}}> 
            <Image
              src={movie.posterUrl}
              alt= {movie.posterUrl}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function ComingSoonMovies() {

}
