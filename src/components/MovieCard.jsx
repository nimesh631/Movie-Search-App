import React from 'react'

function MovieCard({movie}) {
  return (
    <div className='bg-gray-500 p-2 rounded shadow mb-4'>
        <img src={movie.Poster !== "N/A"?movie.Poster :"https://via.placeholder.com/200x300" } alt={movie.Title}
        className='w-full h-64 object-cover rounded mb-2' />
    <h3 className='text-xl font-bold text-blue-300'>{movie.Title}</h3>
    <p className='text-lg'>{movie.Year}</p>
    </div>
  
  )
}

export default MovieCard