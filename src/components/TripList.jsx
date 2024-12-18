import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// Functional Component: TripList
function TripList({ addToWishlist }) {
  const [month, setMonth] = useState(""); // State für Filtermonat
  const [trips, setTrips] = useState([]); // State für Trips-Daten
  const months = ["Idle", "Jan", "Feb", "March", "April", "Mai", "June"];

  // Fetch Trips-Daten vom JSON-Server
  useEffect(() => {
    fetch("http://localhost:3001/trips")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch trips");
        return response.json();
      })
      .then((data) => {
        // Konvertiere die startTrip- und endTrip-Daten in gültige Date-Objekte
        const convertedData = data.map((trip) => ({
          ...trip,
          startTrip: new Date(...trip.startTrip),
          endTrip: new Date(...trip.endTrip),
        }));
        setTrips(convertedData);
      })
      .catch((error) => console.error("Error fetching trips:", error));
  }, []);

  // Filter Trips nach Monat
  const filteredTrips = month
    ? trips.filter((t) => t.startTrip.getMonth() + 1 === parseInt(month))
    : trips;

  // Kein Trip vorhanden
  const empty = (
    <section>
      <p className="alert alert-info">Triplist is empty</p>
    </section>
  );

  return (
    <div className="container">
      <section>
        <h2 className="h4">Triplist-Catalog</h2>
        <section id="filters">
          <label htmlFor="month">Filter by Month:</label>
          <select
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">All Months</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">Mai</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>

          {month && (
            <h2>
              Found {filteredTrips.length}
              {filteredTrips.length > 1 ? " trips" : " trip"} for the month of{" "}
              {months[month]}
            </h2>
          )}
        </section>

        <div className="row">
          {filteredTrips.length > 0 ? (
            filteredTrips.map((trip) => (
              <Trip addToWishlist={addToWishlist} trip={trip} key={trip.id} />
            ))
          ) : (
            empty
          )}
        </div>
      </section>
    </div>
  );
}

// Einzelner Trip
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
