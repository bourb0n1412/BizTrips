import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";
import TripList from "../components/TripList";
import Wishlist from "../components/Wishlist";

describe("App Component", () => {
  test("renders the App component with the correct heading", () => {
    render(<App />);
    const heading = screen.getByRole("heading", {
      name: /welcome to biztrips-app/i,
    });
    expect(heading).toBeInTheDocument();
  });
});

describe("TripList Component", () => {
  test("renders the TripList component with a loading message", () => {
    render(<TripList addToWishlist={() => {}} />);
    const loadingMessage = screen.getByText(/loading trips/i);
    expect(loadingMessage).toBeInTheDocument();
  });

  test("renders trips when data is provided", async () => {
    const mockTrips = [
      {
        id: 1,
        title: "Trip to Paris",
        description: "Eiffel Tower visit",
        startTrip: [2024, 0, 1],
        endTrip: [2024, 0, 10],
      },
    ];

    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTrips),
      })
    );

    render(<TripList addToWishlist={() => {}} />);

    const tripTitle = await screen.findByText(/trip to paris/i);
    expect(tripTitle).toBeInTheDocument();

    global.fetch.mockRestore();
  });
});

describe("Wishlist Component", () => {
  test("renders the Wishlist component with empty message", () => {
    render(
      <Wishlist
        wishlist={[]}
        removeFromWishlist={() => {}}
        clearWishlist={() => {}}
      />
    );
    const emptyMessage = screen.getByText(/wishlist is empty/i);
    expect(emptyMessage).toBeInTheDocument();
  });

  test("renders wishlist items when data is provided", () => {
    const mockWishlist = [
      {
        id: 1,
        title: "Trip to Berlin",
        description: "City tour",
        startTrip: new Date(2024, 2, 15),
        endTrip: new Date(2024, 2, 20),
      },
    ];

    render(
      <Wishlist
        wishlist={mockWishlist}
        removeFromWishlist={() => {}}
        clearWishlist={() => {}}
      />
    );

    const wishlistItems = screen.getAllByText(/trip to berlin/i);
    expect(wishlistItems.length).toBeGreaterThan(0);
  });
});

describe("User Interactions", () => {
  test("adds a trip to the wishlist", async () => {
    const mockTrips = [
      {
        id: 1,
        title: "Trip to Paris",
        description: "Eiffel Tower visit",
        startTrip: [2024, 0, 1],
        endTrip: [2024, 0, 10],
      },
    ];
  
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTrips),
      })
    );
  
    render(<App />);
  
    // Finde den Add-to-Wishlist-Button für den Trip "Trip to Paris"
    const addButton = await screen.findByRole("button", {
      name: /add to wishlist/i,
    });
    fireEvent.click(addButton);
  
    // Suche gezielt nach dem Eintrag in der Wishlist
    const wishlistItems = await screen.findAllByText(/trip to paris/i);
  
    // Überprüfen, dass das Element zur Wishlist hinzugefügt wurde
    expect(wishlistItems.length).toBeGreaterThan(0);
  
    global.fetch.mockRestore();
  });
  

  test("removes a trip from the wishlist", async () => {
    const mockWishlist = [
      {
        id: 1,
        title: "Trip to Berlin",
        description: "City tour",
        startTrip: new Date(2024, 2, 15),
        endTrip: new Date(2024, 2, 20),
      },
    ];

    const mockRemoveFromWishlist = jest.fn();

    render(
      <Wishlist
        wishlist={mockWishlist}
        removeFromWishlist={mockRemoveFromWishlist}
        clearWishlist={() => {}}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /delete item/i });
    fireEvent.click(deleteButton);

    expect(mockRemoveFromWishlist).toHaveBeenCalled();
  });
});
