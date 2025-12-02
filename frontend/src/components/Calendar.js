import React, { useState, useEffect } from 'react';
import './Calendar.css';
import CalendarModal from './CalendarModal';

const Calendar = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [orderDates, setOrderDates] = useState(new Set());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const API_URL = 'http://localhost:3001/api';

  useEffect(() => {
    if (user?.id) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${user.id}/orders`);
      const data = await response.json();
      setOrders(data);
      
      // Create a set of date strings for quick lookup
      const dates = new Set(
        data.map(order => {
          const date = new Date(order.date);
          return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        })
      );
      setOrderDates(dates);
    } catch (error) {
      console.error('Error fetching orders for calendar:', error);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const hasOrderOnDate = (day) => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
    return orderDates.has(dateKey);
  };

  const getOrdersForDate = (day) => {
    return orders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate.getFullYear() === currentDate.getFullYear() &&
             orderDate.getMonth() === currentDate.getMonth() &&
             orderDate.getDate() === day;
    });
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setShowModal(true);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const today = new Date();

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = 
        today.getDate() === day && 
        today.getMonth() === currentDate.getMonth() && 
        today.getFullYear() === currentDate.getFullYear();
      
      const hasOrder = hasOrderOnDate(day);
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isToday ? 'today' : ''} ${hasOrder ? 'has-order' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <span className="day-number">{day}</span>
          {hasOrder && <span className="order-indicator"></span>}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-widget">
        <div className="calendar-header">
          <button className="calendar-nav-btn" onClick={handlePrevMonth}>‹</button>
          <h3 className="calendar-title">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button className="calendar-nav-btn" onClick={handleNextMonth}>›</button>
        </div>
        
        <div className="calendar-weekdays">
          {dayNames.map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        
        <div className="calendar-grid">
          {renderCalendarDays()}
        </div>
        
        <div className="calendar-legend">
          <span className="legend-item">
            <span className="legend-dot"></span>
            Order placed
          </span>
        </div>
      </div>

      {showModal && (
        <CalendarModal
          date={selectedDate}
          orders={getOrdersForDate(selectedDate?.getDate())}
          allOrders={orders}
          onClose={() => setShowModal(false)}
          currentDate={currentDate}
          onMonthChange={setCurrentDate}
        />
      )}
    </div>
  );
};

export default Calendar;

