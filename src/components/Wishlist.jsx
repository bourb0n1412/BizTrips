import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// Wishlist-Komponente
export default function Wishlist({ wishlist, removeFromWishlist, clearWishlist }) {
  const itemsMapped = wishlist.map((item) => (
    <WishlistItem
      key={item.id}
      item={item}
      removeFromWishlist={removeFromWishlist}
    />
  ));

  const emptyWishlistMessage = (
    <tr>
      <td colSpan="3">
        <p className="alert alert-info">Wishlist is empty</p>
      </td>
    </tr>
  );

  return (
    <div className="container">
      <h2 className="h4">Wishlist</h2>
      <div className="row">
        <div className="col-sm-12">
          <div className="card table-responsive">
            <table className="table table-hover shopping-cart-wrap">
              <thead className="text-muted">
                <tr>
                  <th scope="col">Trip</th>
                  <th scope="col" width="120">Price</th>
                  <th scope="col" width="200" className="text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {itemsMapped.length > 0 ? itemsMapped : emptyWishlistMessage}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="col">
                    <dl className="dlist-align">
                      <dt>Total</dt>
                    </dl>
                  </th>
                  <th scope="col"></th>
                  <th scope="col">
                    <button
                      className="btn btn-outline-danger"
                      onClick={clearWishlist}
                      disabled={itemsMapped.length === 0}
                    >
                      Empty Wishlist
                    </button>
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Einzelnes Wishlist-Item
function WishlistItem({ item, removeFromWishlist }) {
  const { id, title, description, startTrip, endTrip } = item;

  return (
    <tr>
      <td>
        <figure className="media">
          <div className="img-wrap">
            <img
              className="img-thumbnail img-xs"
              src={`/images/items/${id}.jpg`}
              alt={title}
            />
          </div>
          <figcaption className="media-body">
            <h6 className="h6">{title}</h6>
            <dl className="dlist-inline small">
              <dt>Description:</dt>
              <dd>{description}</dd>
            </dl>
            <dl className="dlist-inline small">
              <dt>Start:</dt>
              <dd>{new Date(startTrip).toLocaleDateString()}</dd>
              <dt>End:</dt>
              <dd>{new Date(endTrip).toLocaleDateString()}</dd>
            </dl>
          </figcaption>
        </figure>
      </td>
      <td className="price-wrap price"></td>
      <td className="text-right">
        <button
          className="btn btn-outline-danger"
          onClick={() => removeFromWishlist(item)}
        >
          Delete Item
        </button>
      </td>
    </tr>
  );
}
