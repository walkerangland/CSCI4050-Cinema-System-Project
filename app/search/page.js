import { FilterAndSearch } from '../../lib/movies'

export default function Page({ searchParams }) {
  const genre = searchParams?.genre ?? ''
  const query = searchParams?.q ?? ''
  const movies = FilterAndSearch(genre, query)

  return (<div>
            <style>{` p { color: red; } `}</style>
            <h1>This is the search page!</h1>
            <p>Genre: {genre || 'all'}</p>
            <p>Search: {query || 'none'}</p>
            {movies.length === 0 ? (
              <p>No matching movies found.</p>
            ) : (
              <div>
                {movies.map((movie) => (
                  <div key={movie.id}>
                    <p><strong>{movie.title}</strong> ({movie.genre})</p>
                    <p>{movie.description}</p>
                    <p><a href={movie.DisplayTrailer()} target="_blank" rel="noreferrer">Trailer</a></p>
                  </div>
                ))}
              </div>
            )}
          </div>
  );
  
}
