import React, {useEffect, useState} from 'react'
import { BrowserRouter as Link } from 'react-router-dom'

function FilmsPage() {
    const [films, setFilms] = useState([]);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [customerId, setCustomerId] = useState('');
    useEffect (() => {
        fetch('http://127.0.0.1:5000/')
            .then(response => response.json())
            .then(data => setFilms(data))
    }, []);
    const handleRentFilm = (filmId) => {
        if (!customerId) {
            alert('Enter customer_id');
            return;
        }
        fetch('http://127.0.0.1:5000/rent', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ film_id: filmId, customer_id: customerId})
        })
            .then(response => response.json())
            .then(data => alert(data.message || data.error))
    };
return (
    <div>
      <h1>Available Films</h1>
      <ul>
        {films.map(film => (
          <li key={film.film_id}>
            {film.title} (Rented {film.rented} times)
            <button onClick={() => setSelectedFilm(film.film_id)}>Rent</button>
          </li>
        ))}
      </ul>

      {selectedFilm && (
        <div>
          <h2>Rent Film</h2>
          <input
            type="text"
            placeholder="Enter Customer ID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          />
          <button onClick={() => handleRentFilm(selectedFilm)}>Confirm Rent</button>
        </div>
      )}
      <Link to="/">
        <button>Return to Home</button>
      </Link>
    </div>
  );
};

export default FilmsPage