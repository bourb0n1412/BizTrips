import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function TripList({ addToWishlist }) {
  const [month, setMonth] = useState(""); // Filtermonat
  const [trips, setTrips] = useState([]); // Liste der Trips
  const [loading, setLoading] = useState(true); // Ladezustand
  const [error, setError] = useState(null); // Fehlerzustand

  const months = ["Idle", "Jan", "Feb", "March", "April", "Mai", "June"];

  useEffect(() => {
    // Fetch Trips-Daten
    fetch("http://localhost:3001/trips")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch trips");
        return response.json();
      })
      .then((data) => {
        // Konvertiere Daten
        const convertedData = data.map((trip) => ({
          ...trip,
          startTrip: new Date(...trip.startTrip),
          endTrip: new Date(...trip.endTrip),
        }));
        setTrips(convertedData);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const filteredTrips = month
    ? trips.filter((t) => t.startTrip.getMonth() + 1 === parseInt(month))
    : trips;

  if (loading) {
    return <p className="alert alert-info">Loading trips...</p>;
  }

  if (error) {
    return (
      <p className="alert alert-danger">
        Error loading trips: {error}. Please try again later.
      </p>
    );
  }

  return (
    <div className="container">
      <section>
        <h2 className="h4">Triplist-Catalog</h2>

        {/* Filterkomponente */}
        <TripFilter month={month} setMonth={setMonth} months={months} />

        {month && (
          <h2>
            Found {filteredTrips.length}{" "}
            {filteredTrips.length > 1 ? "trips" : "trip"} for the month of{" "}
            {months[month]}
          </h2>
        )}

        <div className="row">
          {filteredTrips.length > 0 ? (
            filteredTrips.map((trip) => (
              <Trip addToWishlist={addToWishlist} trip={trip} key={trip.id} />
            ))
          ) : (
            <p className="alert alert-info">Triplist is empty</p>
          )}
        </div>
      </section>
    </div>
  );
}

function TripFilter({ month, setMonth, months }) {
  return (
    <section id="filters">
      <label htmlFor="month">Filter by Month:</label>
      <select
        id="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      >
        <option value="">All Months</option>
        {Array.from({ length: 12 }, (_, i) => (
          <option value={i + 1} key={i}>
            {months[i + 1]}
          </option>
        ))}
      </select>
    </section>
  );
}

function Trip({ addToWishlist, trip }) {
  const { id, title, description, startTrip, endTrip } = trip;

  return (
    <div className="col-sm-6 col-md-4 col-lg-3">
      <figure className="card card-product">
        <div className="img-wrap">
          <img src={"images/items/" + id + ".jpg"} alt={title} />
        </div>
        <figcaption className="info-wrap">
          <h6 className="title">
            {id} {title} ({startTrip.toLocaleDateString()} -{" "}
            {endTrip.toLocaleDateString()})
          </h6>
          <p className="card-text">{description}</p>
          <div className="info-wrap row">
            <button
              type="button"
              className="btn btn-link btn-outline"
              onClick={() => addToWishlist(trip)}
            >
              <i className="fa fa-shopping-cart" /> Add to Wishlist
            </button>
          </div>
        </figcaption>
      </figure>
    </div>
  );
}

export default TripList;
