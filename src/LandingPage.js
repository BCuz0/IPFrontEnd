import React, { useState, useEffect } from 'react'
import { BrowserRouter as Link } from 'react-router-dom'

function LandingPage() {
  const [films, setFilms] = useState([]);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [actors, setActors] = useState([]);
  const [selectedActor, setSelectedActor] = useState(null);
  const [actorFilms, setActorFilms] = useState([])
  useEffect(() => {
    fetch('http://127.0.0.1:5000/')
      .then(response => response.json())
      .then(data => setFilms(data))
      .catch(error => console.error('Error fetching films:', error));
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/top_actors')
      .then((response) => response.json())
      .then((data) => setActors(data))
      .catch(error => console.error("Error fetching actors:", error));
  }, []);
  const getActorFilms = (actor) => {
    setSelectedActor(actor);
    fetch(`http://127.0.0.1:5000/top_actor_films/${actor.actor_id}`)
      .then((response) => response.json())
      .then((data) => setActorFilms(data))
      .catch((error) => console.error("Error fetching actor films:", error));
  };
  return(
      <div>
        <nav>
          <Link to="/">Home</Link> | <Link to="/films">Films</Link>
        </nav>
        <h1>Top 5 Rented Films</h1>
        <ul>
          {films.map(film => (
            <li key={film.film_id}>
              <button onClick= {() => setSelectedFilm(film)}>{film.title}</button>
              (Rented {film.rented} times)
            </li>
          ))}
        </ul>
        <h1>Top 5 actors</h1>
        <ul>
          {actors.map((actor) => (
            <li key={actor.actor_id}>
              <button onClick={() => getActorFilms(actor)}>
                {actor.first_name} {actor.last_name}
              </button>
            </li>
          ))}
        </ul>
        {selectedActor && (
          <div>
            <h2>{selectedActor.first_name} {selectedActor.last_name}</h2>
            <h3>Top 5 Rented Films:</h3>
            <ul>
              {actorFilms.map((film) => (
                <li>
                  <strong>{film.title}</strong> (Rented {film.rented} times)
                </li>
              ))}
            </ul>
            <button onClick={() => setSelectedActor(null)}>Close</button>
          </div>
        )}
        {selectedFilm && (
          <div>
            <h2>{selectedFilm.title}</h2>
            <p><strong>Description:</strong> {selectedFilm.description}</p>
            <p><strong>Release Year:</strong> {selectedFilm.release_year}</p>
            <p><strong>Rental Rate:</strong> {selectedFilm.rental_rate}</p>
            <button onClick={() => setSelectedFilm(null)}>Close</button>
          </div>
        )}
      </div>
  );
};

export default LandingPage;