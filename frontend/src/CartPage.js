import React, { useState } from 'react';
import './CartPage.css';

const CartPage = ({ cart, user, removeFromCart, clearCart }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const totals = cart.reduce((acc, item) => {
    return {
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fats: acc.fats + item.fats,
      fiber: acc.fiber + item.fiber,
      price: acc.price + item.price,
    };
  }, { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, price: 0 });

  const handleCheckout = async () => {
    if (!user) {
      alert("Please log in to checkout.");
      return;
    }

    setIsCheckingOut(true);

    try {
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id || user.UserID || 1,
          items: cart,
          totals: totals
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Order Placed Successfully!`);
        clearCart();
      } else {
        alert(`Checkout Failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("An error occurred during checkout.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page-empty">
        <h2>Your Cart is Empty</h2>
        <p>Go to the "Find Food" page to add items.</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Current Order</h2>
      
      <div className="cart-table-container">
        <table className="cart-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Calories</th>
              <th>Protein (g)</th>
              <th>Carbs (g)</th>
              <th>Fats (g)</th>
              <th>Fiber (g)</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr key={index}>
                <td className="item-name-cell">{item.name}</td>
                <td>{item.calories}</td>
                <td>{item.protein}</td>
                <td>{item.carbs}</td>
                <td>{item.fats}</td>
                <td>{item.fiber}</td>
                <td className="price-cell">${item.price.toFixed(2)}</td>
                <td>
                  <button 
                    className="remove-item-btn"
                    onClick={() => removeFromCart(index)}
                    title="Remove item"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="totals-row">
              <td><strong>TOTALS</strong></td>
              <td><strong>{totals.calories}</strong></td>
              <td><strong>{totals.protein}</strong></td>
              <td><strong>{totals.carbs}</strong></td>
              <td><strong>{totals.fats}</strong></td>
              <td><strong>{totals.fiber}</strong></td>
              <td className="total-price-cell"><strong>${totals.price.toFixed(2)}</strong></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="cart-actions">
        <button 
          className="checkout-btn" 
          onClick={handleCheckout}
          disabled={isCheckingOut}
        >
          {isCheckingOut ? 'Processing...' : 'Checkout'}
        </button>
      </div>
    </div>
  );
};

export default CartPage;