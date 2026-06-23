import Link from 'next/link'
import Image from 'next/image'
 

export default function Page() {
  return (<div>
            <h1>Welcome to [movie app]!</h1>
            <h2>Currently Playing Movies:</h2>
            <GetMovies/>
            <h2>Coming Soon Movies:</h2>
            <GetMovies/>
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
function GetMovies() {
  const movies = [GetMovie(), GetMovie(), GetMovie(), GetMovie(), GetMovie()] 
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

//Placeholder for getmovie 
function GetMovie() {
  return (
    new Movie
    )
}
//Movie class placeholder.
class Movie {
  constructor(id, title, genre, rating, description, posterUrl, trailerUrl, status, director, producer, cast, createdAt, updatedAt) {
    this.id = 'd'
    this.title = 'd'
    this.genre ='d'
    this.rating = 'd'
    this.description = 'd'
    this.posterUrl = '/minecraftMovie.webp'
    this.trailerUrl = 'd'
    this.status = 'd'
    this.director = 'd'
    this.producer = 'd'
    this.cast = 'd'
    this.createdAt = 'd'
    this.updatedAt = 'd'
  }
}
