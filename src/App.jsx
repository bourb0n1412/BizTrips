import React, { useState } from "react";
import "./App.css";

import Footer from "./Footer";
import Header from "./Header";
import TripList from "./components/TripList";
import Wishlist from "./components/Wishlist";

export default function App() {
  const [wishlist, setWishlist] = useState([]);

  // Wishlist functions
  function addToWishlist(trip) {
    console.log("add to wishlist ->", trip);
    const { id, title, description, startTrip, endTrip } = trip;
    setWishlist((prevWishlist) => {
      const tripInWishlist = prevWishlist.find((t) => t.id === id);
      if (tripInWishlist) {
        return prevWishlist;
      } else {
        return [...prevWishlist, { id, title, description, startTrip, endTrip }];
      }
    });
  }

  function removeFromWishlist(item) {
    console.log("remove from wishlist ->", item);
    setWishlist((trips) => trips.filter((t) => t.id !== item.id));
  }
  

  function clearWishlist() {
    console.log("clear wishlist");
    setWishlist([]);
  }

  return (
    <>
      <div>
        <Header />
        <main>
          <h1>Welcome to biztrips-App</h1>

          <Wishlist
            wishlist={wishlist}
            removeFromWishlist={removeFromWishlist}
            clearWishlist={clearWishlist}
          />
          <TripList addToWishlist={addToWishlist} />
        </main>
      </div>
      <Footer />
    </>
  );
}
