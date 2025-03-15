import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const [films, setFilms] = useState([]);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [actors, setActors] = useState([]);
  const [selectedActor, setSelectedActor] = useState(null);
  const [actorFilms, setActorFilms] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/')
      .then(response => response.json())
      .then(data => setFilms(data))
      .catch(error => console.error('Error fetching films:', error));
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/top_actors')
      .then(response => response.json())
      .then(data => setActors(data))
      .catch(error => console.error("Error fetching actors:", error));
  }, []);

  const getActorFilms = (actor) => {
    setSelectedActor(actor);
    fetch(`http://127.0.0.1:5000/top_actor_films/${actor.actor_id}`)
      .then(response => response.json())
      .then(data => setActorFilms(data))
      .catch(error => console.error("Error fetching actor films:", error));
  };

  return (
    <div>
      <div className="navbar">
      <div className="navbar-title">SakilaFlix</div>
        <div className="nav-buttons">
          <button onClick={() => navigate('/FilmsPage')}>Films Page</button>
          <button onClick={() => navigate('/CustomersPage')}>Customers Page</button>
        </div>
      </div>

      <div className="content">
        <div className="grid-container">
          <div className="card">
            <h2>Top 5 Rented Films</h2>
            <ul>
              {films.map(film => (
                <li key={film.film_id}>
                  <button onClick={() => setSelectedFilm(film)}>{film.title}</button>
                  <span> (Rented {film.rented} times)</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h2>Top 5 Actors</h2>
            <ul>
              {actors.map(actor => (
                <li key={actor.actor_id}>
                  <button onClick={() => getActorFilms(actor)}>
                    {actor.first_name} {actor.last_name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {selectedActor && (
          <div className="details-card">
            <h3>{selectedActor.first_name} {selectedActor.last_name}</h3>
            <h4>Top 5 Rented Films:</h4>
            <ul>
              {actorFilms.map(film => (
                <li key={film.film_id}>
                  <strong>{film.title}</strong> (Rented {film.rented} times)
                </li>
              ))}
            </ul>
            <button className="close" onClick={() => setSelectedActor(null)}>Close</button>
          </div>
        )}

        {selectedFilm && (
          <div className="details-card">
            <h3>{selectedFilm.title}</h3>
            <p><strong>Description:</strong> {selectedFilm.description}</p>
            <p><strong>Release Year:</strong> {selectedFilm.release_year}</p>
            <p><strong>Rental Rate:</strong> {selectedFilm.rental_rate}</p>
            <button className="close" onClick={() => setSelectedFilm(null)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
