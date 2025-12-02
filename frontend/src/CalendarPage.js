import React, { useState, useEffect } from 'react';
import './CalendarPage.css';

const CalendarPage = ({ user }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allOrders, setAllOrders] = useState([]);
  const [orderItems, setOrderItems] = useState({});
  const [loadingItems, setLoadingItems] = useState({});
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:3001/api';

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    if (user?.id) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      const userId = user.id || user.UserID || 1;
      const response = await fetch(`${API_URL}/users/${userId}/orders`);
      const data = await response.json();
      setAllOrders(data);
    } catch (error) {
      console.error('Error fetching orders for calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate && allOrders.length > 0) {
      const dayOrders = getOrdersForDate(selectedDate);
      dayOrders.forEach(order => {
        if (!orderItems[order.orderid] && !loadingItems[order.orderid]) {
          fetchOrderItems(order.orderid);
        }
      });
    }
  }, [selectedDate, allOrders]);

  const fetchOrderItems = async (orderId) => {
    setLoadingItems(prev => ({ ...prev, [orderId]: true }));
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`);
      const data = await response.json();
      setOrderItems(prev => ({ ...prev, [orderId]: data.items || [] }));
    } catch (error) {
      console.error('Error fetching order items:', error);
      setOrderItems(prev => ({ ...prev, [orderId]: [] }));
    } finally {
      setLoadingItems(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { 
      daysInMonth: lastDay.getDate(), 
      startingDay: firstDay.getDay() 
    };
  };

  const getOrdersForDate = (date) => {
    if (!date) return [];
    return allOrders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate.getFullYear() === date.getFullYear() &&
             orderDate.getMonth() === date.getMonth() &&
             orderDate.getDate() === date.getDate();
    });
  };

  const hasOrderOnDay = (day) => {
    return allOrders.some(order => {
      const orderDate = new Date(order.date);
      return orderDate.getFullYear() === viewDate.getFullYear() &&
             orderDate.getMonth() === viewDate.getMonth() &&
             orderDate.getDate() === day;
    });
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  const renderCalendarDays = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(viewDate);
    const today = new Date();
    const days = [];
    
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = 
        today.getDate() === day && 
        today.getMonth() === viewDate.getMonth() && 
        today.getFullYear() === viewDate.getFullYear();
      
      const hasOrder = hasOrderOnDay(day);
      
      const isSelected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === viewDate.getMonth() && 
        selectedDate.getFullYear() === viewDate.getFullYear();
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isToday ? 'today' : ''} ${hasOrder ? 'has-order' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDayClick(day)}
        >
          <span className="day-number">{day}</span>
          {hasOrder && <span className="order-dot"></span>}
        </div>
      );
    }
    
    return days;
  };

  const renderOrderItems = (orderId) => {
    const items = orderItems[orderId];
    const isLoading = loadingItems[orderId];

    if (isLoading) return <div className="items-loading">Loading items...</div>;
    if (!items || items.length === 0) return null;

    return (
      <div className="order-items-section">
        <h4 className="items-title">Items Ordered</h4>
        <ul className="items-list">
          {items.map((item, idx) => (
            <li key={idx} className="order-item">
              <div className="item-info">
                <span className="item-name">{item.itemname || item.name}</span>
                <span className="item-qty">×{item.quantity}</span>
              </div>
              <div className="item-nutrition">
                <span>{item.calories} cal</span>
                <span>{item.protein}g protein</span>
                <span>${item.price}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (loading) {
    return <div className="calendar-page-loading">Loading Calendar...</div>;
  }

  const selectedDayOrders = getOrdersForDate(selectedDate);

  return (
    <div className="calendar-page">
      <div className="calendar-section">
        <div className="calendar-header">
          <button className="nav-btn" onClick={handlePrevMonth}>‹</button>
          <h2>{monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</h2>
          <button className="nav-btn" onClick={handleNextMonth}>›</button>
        </div>
        
        <div className="calendar-weekdays">
          {shortDayNames.map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        
        <div className="calendar-grid">
          {renderCalendarDays()}
        </div>

        <div className="calendar-legend">
           <span className="legend-item"><span className="legend-dot"></span> Order Placed</span>
        </div>
      </div>

      <div className="details-section">
        <h3 className="details-header">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </h3>

        <div className="details-content">
          {selectedDayOrders.length > 0 ? (
            <div className="orders-list">
              {selectedDayOrders.map((order, index) => (
                <div key={index} className="order-detail-card">
                  <div className="order-detail-header">
                    <span className="order-number">Order #{order.orderid}</span>
                    {order.favorite && <span className="favorite-tag">★ Favorite</span>}
                  </div>
                  
                  {renderOrderItems(order.orderid)}
                  
                  <div className="order-detail-stats">
                    <div className="stat-pill calories">
                      <span className="stat-label">Calories</span>
                      <span className="stat-value">{order.totalcalories}</span>
                    </div>
                    <div className="stat-pill protein">
                      <span className="stat-label">Protein</span>
                      <span className="stat-value">{order.totalprotein}g</span>
                    </div>
                    <div className="stat-pill price">
                      <span className="stat-label">Total</span>
                      <span className="stat-value">${order.receipt}</span>
                    </div>
                  </div>

                  {order.notes && <p className="order-notes">"{order.notes}"</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-orders-state">
              <span className="no-orders-icon">📅</span>
              <p>No orders found for this date.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;