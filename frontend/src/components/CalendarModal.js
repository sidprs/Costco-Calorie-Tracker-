import React, { useState, useEffect } from 'react';
import './CalendarModal.css';

const CalendarModal = ({ date, orders, allOrders, onClose, currentDate, onMonthChange }) => {
  const [viewDate, setViewDate] = useState(currentDate);
  const [selectedDay, setSelectedDay] = useState(date?.getDate() || null);
  const [orderItems, setOrderItems] = useState({});
  const [loadingItems, setLoadingItems] = useState({});

  const API_URL = 'http://localhost:3001/api';

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Fetch items for orders when selectedDay changes
  useEffect(() => {
    if (selectedDay) {
      const dayOrders = getOrdersForDay(selectedDay);
      dayOrders.forEach(order => {
        if (!orderItems[order.orderid] && !loadingItems[order.orderid]) {
          fetchOrderItems(order.orderid);
        }
      });
    }
  }, [selectedDay, viewDate]);

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

  const hasOrderOnDate = (day) => {
    return allOrders.some(order => {
      const orderDate = new Date(order.date);
      return orderDate.getFullYear() === viewDate.getFullYear() &&
             orderDate.getMonth() === viewDate.getMonth() &&
             orderDate.getDate() === day;
    });
  };

  const getOrdersForDay = (day) => {
    return allOrders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate.getFullYear() === viewDate.getFullYear() &&
             orderDate.getMonth() === viewDate.getMonth() &&
             orderDate.getDate() === day;
    });
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const { daysInMonth, startingDay } = getDaysInMonth(viewDate);
  const today = new Date();
  const selectedDayOrders = selectedDay ? getOrdersForDay(selectedDay) : [];

  const renderCalendarDays = () => {
    const days = [];
    
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="modal-calendar-day empty"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = 
        today.getDate() === day && 
        today.getMonth() === viewDate.getMonth() && 
        today.getFullYear() === viewDate.getFullYear();
      
      const hasOrder = hasOrderOnDate(day);
      const isSelected = selectedDay === day;
      
      days.push(
        <div 
          key={day} 
          className={`modal-calendar-day ${isToday ? 'today' : ''} ${hasOrder ? 'has-order' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDayClick(day)}
        >
          <span className="day-number">{day}</span>
          {hasOrder && <span className="order-dot"></span>}
        </div>
      );
    }
    
    return days;
  };

  const formatDate = (day) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return `${dayNames[d.getDay()]}, ${monthNames[viewDate.getMonth()]} ${day}, ${viewDate.getFullYear()}`;
  };

  const renderOrderItems = (orderId) => {
    const items = orderItems[orderId];
    const isLoading = loadingItems[orderId];

    if (isLoading) {
      return <div className="items-loading">Loading items...</div>;
    }

    if (!items || items.length === 0) {
      return null;
    }

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

  return (
    <div className="calendar-modal-overlay" onClick={onClose}>
      <div className="calendar-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        
        <div className="modal-content">
          <div className="modal-calendar-section">
            <div className="modal-calendar-header">
              <button className="modal-nav-btn" onClick={handlePrevMonth}>‹</button>
              <h2>{monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</h2>
              <button className="modal-nav-btn" onClick={handleNextMonth}>›</button>
            </div>
            
            <div className="modal-weekdays">
              {shortDayNames.map(day => (
                <div key={day} className="modal-weekday">{day}</div>
              ))}
            </div>
            
            <div className="modal-calendar-grid">
              {renderCalendarDays()}
            </div>
          </div>

          <div className="modal-details-section">
            {selectedDay ? (
              <>
                <h3 className="details-date">{formatDate(selectedDay)}</h3>
                {selectedDayOrders.length > 0 ? (
                  <div className="orders-list-modal">
                    {selectedDayOrders.map((order, index) => (
                      <div key={index} className="order-detail-card">
                        <div className="order-detail-header">
                          <span className="order-number">Order #{order.orderid}</span>
                          {order.favorite && <span className="favorite-tag">★ Favorite</span>}
                        </div>
                        
                        {renderOrderItems(order.orderid)}
                        
                        <div className="order-detail-stats">
                          <div className="stat">
                            <span className="stat-value">{order.totalcalories}</span>
                            <span className="stat-label">Calories</span>
                          </div>
                          <div className="stat">
                            <span className="stat-value">{order.totalprotein}g</span>
                            <span className="stat-label">Protein</span>
                          </div>
                          <div className="stat">
                            <span className="stat-value">{order.totalcarbs}g</span>
                            <span className="stat-label">Carbs</span>
                          </div>
                          <div className="stat">
                            <span className="stat-value">{order.totalfats}g</span>
                            <span className="stat-label">Fats</span>
                          </div>
                        </div>
                        <div className="order-detail-footer">
                          <span className="order-total">${order.receipt}</span>
                          {order.notes && <p className="order-notes">"{order.notes}"</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-orders-message">
                    <span className="no-orders-icon">📅</span>
                    <p>No orders on this date</p>
                  </div>
                )}
              </>
            ) : (
              <div className="select-date-message">
                <span className="select-icon">👆</span>
                <p>Select a date to view orders</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
