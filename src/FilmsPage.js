import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './FilmsPage.css';

function FilmsPage() {
    const navigate = useNavigate();
    const [films, setFilms] = useState([]);
    const [search, setSearch] = useState('');
    const [filmDetails, setFilmDetails] = useState(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [totalFilms, setTotalFilms] = useState(0);
    const [availableCopies, setAvailableCopies] = useState(null)
    const [customerId, setCustomerId] = useState('');
    useEffect (() => {
        fetch('http://127.0.0.1:5000/')
            .then(response => response.json())
            .then(data => {
              setFilms(data);});
    }, []);
    useEffect(() => {
      fetch(`http://127.0.0.1:5000/films?page=${page}&limit=${limit}`)
          .then(response => response.json())
          .then(data => {
              setFilms(data.films);
              setTotalFilms(data.total_films);
          });
  }, [page, limit]);
    const totalPages = Math.ceil(totalFilms / limit);
    const landingPage = () => {
      navigate('/');
    }
    const customerPage = () => {
      navigate('/CustomersPage');
    }
    const handleSelectFilm = (filmId) => {
      fetch(`http://127.0.0.1:5000/film/${filmId}`)
        .then(response => response.json())
        .then(data => setFilmDetails(data));
      fetch(`http://127.0.0.1:5000/film_availability/${filmId}`)
          .then(response => response.json())
          .then(data => setAvailableCopies(data.available_copies));
    };
    const handleRentFilm = () => {
      if (!filmDetails) return;
      if (!customerId.trim()) {
        alert("Please enter a valid Customer ID.");
        return;
      }
      fetch(`http://127.0.0.1:5000/validate_customer/${parseInt(customerId)}`)
        .then(response => response.json())
        .then(data => {
          if(!data.exists) {
            alert("Invalid Customer ID. Please enter a valid ID.");
            return;
          }
          fetch('http://127.0.0.1:5000/rent_film', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ film_id: filmDetails.film_id, customer_id: parseInt(customerId) })
          })
          .then(response => response.json())
          .then(data => {
            if (data.message === "Rental successful") {
              setAvailableCopies(prev => prev - 1);
              alert("Film rented successfully!");
            } else {
              alert(data.error);
            }
          });
        });
    };
    const handleSearch = () => {
      if (search.trim() === '') return;
      fetch (`http://127.0.0.1:5000/search?query=${encodeURIComponent(search)}`)
        .then(response => response.json())
        .then(data => setFilms(data));
    };
    return (
      <div className="content">
        <div className="navbar">
          <div className="navbar-title">SakilaFlix</div>
          <div className="nav-buttons">
            <button onClick={landingPage}>Home Page</button>
            <button onClick={customerPage}>Customers</button>
            <button onClick={() => navigate('/FilmsPage')}>FilmsPage</button>
          </div>
        </div>
        <div className="search-container">
          <h1>Search Films</h1>
          <input
            type="text"
            placeholder="Search by title, actor, or genre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {films.length === 0 ? (
          <p>No films found with "{search}"</p>
        ) : (
          <ul className="film-list">
            {films.map((film) => (
              <li
                key={film.film_id}
                onClick={() => handleSelectFilm(film.film_id)}
                style={{ cursor: 'pointer' }}
              >
                <strong>{film.title}</strong> ({film.release_year}) - ${film.rental_rate}
              </li>
            ))}
          </ul>
        )}

        <div className="pagination">
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
          <span> Page {page} of {totalPages} </span>
          <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>Next</button>
        </div>

        {filmDetails && (
          <div className="film-details">
            <h2>{filmDetails.title}</h2>
            <p><strong>Description:</strong> {filmDetails.description}</p>
            <p><strong>Release Year:</strong> {filmDetails.release_year}</p>
            <p><strong>Rental Rate:</strong> {filmDetails.rental_rate}</p>
            <p><strong>Available Copies:</strong> {availableCopies !== null ? availableCopies : "Loading..."}</p>
            <label>
              Enter Customer ID:
              <input
                type="number"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="Customer ID"
              />
            </label>
            <button onClick={handleRentFilm} disabled={availableCopies === 0}>Rent</button>
            <button onClick={() => setFilmDetails(null)} className="close">Close</button>
          </div>
        )}
      </div>
    );
  }

export default FilmsPage