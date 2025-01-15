import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";
import TripList from "../components/TripList";
import Wishlist from "../components/Wishlist";

afterEach(() => {
  jest.restoreAllMocks();
});

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
  test("renders the TripList component with a loading message", async () => {
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
  });

  test("filters trips by month", async () => {
    const mockTrips = [
      {
        id: 1,
        title: "Trip to Paris",
        description: "Eiffel Tower visit",
        startTrip: [2024, 0, 1],
        endTrip: [2024, 0, 10],
      },
      {
        id: 2,
        title: "Trip to Berlin",
        description: "City tour",
        startTrip: [2024, 1, 15],
        endTrip: [2024, 1, 20],
      },
    ];

    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTrips),
        })
    );

    render(<TripList addToWishlist={() => {}} />);

    // Verify initial data is rendered
    const parisTrip = await screen.findByText(/trip to paris/i);
    expect(parisTrip).toBeInTheDocument();

    // Apply filter
    const filter = await screen.findByLabelText(/filter by month/i);
    fireEvent.change(filter, { target: { value: "2" } }); // February

    // Verify filtered data
    const berlinTrip = await screen.findByText(/trip to berlin/i);
    expect(berlinTrip).toBeInTheDocument();
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

  test("clears the wishlist when the clear button is clicked", () => {
    const mockClearWishlist = jest.fn();

    render(
        <Wishlist
            wishlist={[{
              id: 1,
              title: "Trip to Berlin",
              description: "City tour",
              startTrip: new Date(2024, 2, 15),
              endTrip: new Date(2024, 2, 20),
            }]}
            removeFromWishlist={() => {}}
            clearWishlist={mockClearWishlist}
        />
    );

    const clearButton = screen.getByRole("button", { name: /empty wishlist/i });
    fireEvent.click(clearButton);

    expect(mockClearWishlist).toHaveBeenCalled();
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

    const addButton = await screen.findByRole("button", {
      name: /add to wishlist/i,
    });
    fireEvent.click(addButton);

    const wishlistItems = await screen.findAllByText(/trip to paris/i);
    expect(wishlistItems.length).toBeGreaterThan(0);
  });

  test("removes a trip from the wishlist", () => {
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
