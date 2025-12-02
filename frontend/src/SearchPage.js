import React, { useEffect, useState } from 'react';
import './SearchPage.css';
import Calendar from './components/Calendar';

const SearchPage = ({ user, onLogout }) => {
  const [searchType, setSearchType] = useState('items');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    maxCalories: '',
    minProtein: '',
    maxPrice: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(user?.id?.toString() || '1');

  const API_URL = 'http://localhost:3001/api';

  useEffect(() => {
    fetchAllItems();
  }, []);

  useEffect(() => {
    if (searchType === 'items' && searchQuery === '') {
      fetchAllItems();
    }
  }, [searchType]);

  const fetchAllItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/items`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      let url = '';
      
      switch (searchType) {
        case 'items':
          if (searchQuery) {
            url = `${API_URL}/items/search?query=${encodeURIComponent(searchQuery)}`;
          } else {
            url = `${API_URL}/items`;
          }
          break;
          
        case 'filter':
          const params = new URLSearchParams();
          if (filters.maxCalories) params.append('maxCalories', filters.maxCalories);
          if (filters.minProtein) params.append('minProtein', filters.minProtein);
          if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
          url = `${API_URL}/items/filter?${params.toString()}`;
          break;
          
        case 'orders':
          url = `${API_URL}/users/${userId}/orders`;
          break;
          
        case 'favorites':
          url = `${API_URL}/users/${userId}/favorites`;
          break;
          
        case 'stats':
          url = `${API_URL}/users/${userId}/stats`;
          break;
          
        default:
          url = `${API_URL}/items`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setResults(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setResults([]);
    }
    setLoading(false);
  };

  const runSampleQuery = (type) => {
    switch(type) {
      case 'highProtein':
        setSearchType('filter');
        setFilters({ maxCalories: '', minProtein: '30', maxPrice: '' });
        setTimeout(() => handleSearch(), 100);
        break;
      case 'lowCalorie':
        setSearchType('filter');
        setFilters({ maxCalories: '500', minProtein: '', maxPrice: '' });
        setTimeout(() => handleSearch(), 100);
        break;
      case 'pizza':
        setSearchType('items');
        setSearchQuery('pizza');
        setTimeout(() => handleSearch(), 100);
        break;
      case 'userOrders':
        setSearchType('orders');
        setUserId('1');
        setTimeout(() => handleSearch(), 100);
        break;
      case 'stats':
        setSearchType('stats');
        setUserId('1');
        setTimeout(() => handleSearch(), 100);
        break;
      default:
        break;
    }
  };

  const renderResults = () => {
    if (loading) return <div className="loading">Loading...</div>;
    if (results.length === 0) return <div className="no-results">No results found</div>;

    if (searchType === 'stats') {
      const stats = results[0];
      return (
        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p>{stats.total_orders}</p>
          </div>
          <div className="stat-card">
            <h3>Avg Calories</h3>
            <p>{Math.round(stats.avg_calories)}</p>
          </div>
          <div className="stat-card">
            <h3>Avg Protein</h3>
            <p>{Math.round(stats.avg_protein)}g</p>
          </div>
          <div className="stat-card">
            <h3>Total Spent</h3>
            <p>${stats.total_spent}</p>
          </div>
        </div>
      );
    }

    if (searchType === 'items' || searchType === 'filter') {
      return (
        <div className="items-grid">
          {results.map((item, index) => (
            <div key={index} className="item-card">
              <h3>{item.name}</h3>
              <div className="item-details">
                <div className="nutrition-row">
                  <span className="nutrition-label">Calories</span>
                  <span className="nutrition-value">{item.calories}</span>
                </div>
                <div className="nutrition-row">
                  <span className="nutrition-label">Protein</span>
                  <span className="nutrition-value">{item.protein}g</span>
                </div>
                <div className="nutrition-row">
                  <span className="nutrition-label">Carbs</span>
                  <span className="nutrition-value">{item.carbs}g</span>
                </div>
                <div className="nutrition-row">
                  <span className="nutrition-label">Fats</span>
                  <span className="nutrition-value">{item.fats}g</span>
                </div>
                <div className="nutrition-row">
                  <span className="nutrition-label">Fiber</span>
                  <span className="nutrition-value">{item.fiber}g</span>
                </div>
                <div className="price-row">
                  <span className="price">${item.price}</span>
                </div>
                {item.favorite && <span className="favorite-badge">Favorite</span>}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (searchType === 'orders' || searchType === 'favorites') {
      return (
        <div className="orders-list">
          {results.map((order, index) => (
            <div key={index} className="order-card">
              <div className="order-header">
                <h3>Order #{order.orderid}</h3>
                <span className="order-date">{new Date(order.date).toLocaleDateString()}</span>
              </div>
              <div className="order-details">
                <div className="detail-row">
                  <span>Total Calories</span>
                  <span>{order.totalcalories}</span>
                </div>
                <div className="detail-row">
                  <span>Protein</span>
                  <span>{order.totalprotein}g</span>
                </div>
                <div className="detail-row">
                  <span>Total</span>
                  <span className="total-price">${order.receipt}</span>
                </div>
                {order.notes && <p className="notes">{order.notes}</p>}
                {order.favorite && <span className="favorite-badge">Favorite</span>}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="search-page">
      <header className="header">
        <div className="header-top">
          {user && (
            <div className="user-info">
              <span className="user-greeting">Hello, {user.firstName}!</span>
              <button className="logout-btn" onClick={onLogout}>Logout</button>
            </div>
          )}
        </div>
        <svg className="costco-logo" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="280" height="60" rx="8" fill="#0051BA" stroke="#003D8F" strokeWidth="2"/>
          <text x="150" y="52" fontSize="32" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial, sans-serif">
            COSTCO
          </text>
        </svg>
        <h1>Food Court Nutrition Tracker</h1>
      </header>
      
      <div className="main-layout">
        <div className="content-section">
          <div className="sample-queries">
            <h3>Quick Searches</h3>
            <div className="sample-buttons">
              <button onClick={() => runSampleQuery('pizza')} className="sample-btn">Search Pizza</button>
              <button onClick={() => runSampleQuery('highProtein')} className="sample-btn">High Protein</button>
              <button onClick={() => runSampleQuery('lowCalorie')} className="sample-btn">Low Calorie</button>
              <button onClick={() => runSampleQuery('userOrders')} className="sample-btn">My Orders</button>
              <button onClick={() => runSampleQuery('stats')} className="sample-btn">Statistics</button>
            </div>
          </div>
      
          <div className="search-controls">
        <div className="search-type-selector">
          <label>Search Type</label>
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
            <option value="items">Search Items</option>
            <option value="filter">Filter by Nutrition</option>
            <option value="orders">My Orders</option>
            <option value="favorites">Favorite Orders</option>
            <option value="stats">My Statistics</option>
          </select>
        </div>

        {searchType === 'items' && (
          <div className="search-input">
            <input
              type="text"
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        )}

        {searchType === 'filter' && (
          <div className="filter-inputs">
            <div className="filter-group">
              <label>Max Calories</label>
              <select
                value={filters.maxCalories}
                onChange={(e) => setFilters({...filters, maxCalories: e.target.value})}
              >
                <option value="">Any</option>
                <option value="300">Under 300</option>
                <option value="500">Under 500</option>
                <option value="700">Under 700</option>
                <option value="900">Under 900</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Min Protein (g)</label>
              <select
                value={filters.minProtein}
                onChange={(e) => setFilters({...filters, minProtein: e.target.value})}
              >
                <option value="">Any</option>
                <option value="20">20g+</option>
                <option value="30">30g+</option>
                <option value="40">40g+</option>
                <option value="50">50g+</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Max Price ($)</label>
              <select
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              >
                <option value="">Any</option>
                <option value="2">Under $2</option>
                <option value="3">Under $3</option>
                <option value="4">Under $4</option>
                <option value="5">Under $5</option>
              </select>
            </div>
          </div>
        )}

        {(searchType === 'orders' || searchType === 'favorites' || searchType === 'stats') && (
          <div className="user-input">
            <label>User ID</label>
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              min="1"
              max="10"
            />
          </div>
        )}

        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

          <div className="results-container">
            {renderResults()}
          </div>
        </div>

        <Calendar user={user} />
      </div>
    </div>
  );
};

export default SearchPage;