import React from 'react';

const Header = ({ searchQuery, setSearchQuery, userName, filter, setFilter }) => {
  const displayTitle = userName ? `${userName.split(' ')[0]}'ın Koleksiyonu` : "Koleksiyonum";

  return (
    <header className="app-header">
      <div className="header-top">
        <button className="icon-btn" style={{ background: 'transparent' }}>👤</button>
        <h1 className="text-gradient" style={{ fontSize: '1.2rem', fontWeight: '600' }}>{displayTitle}</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="icon-btn" style={{ background: 'transparent', position: 'relative' }}>
            🔔
            <span style={{ position: 'absolute', top: '8px', right: '10px', width: '6px', height: '6px', background: 'var(--hw-orange)', borderRadius: '50%' }}></span>
          </button>
          <button className="icon-btn-avatar">
            👦🏻
          </button>
        </div>
      </div>

      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Arabaları Ara..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="filter-scroll">
        <button className={`filter-pill ${filter === 'ALL' ? 'active' : ''}`} onClick={() => setFilter('ALL')}>
          TÜMÜ
        </button>
        <button className={`filter-pill ${filter === 'STH' ? 'active' : ''}`} onClick={() => setFilter('STH')}>
          SUPER TREASURE HUNT
        </button>
        <button className={`filter-pill ${filter === 'TH' ? 'active' : ''}`} onClick={() => setFilter('TH')}>
          TREASURE HUNT
        </button>
        <button className={`filter-pill ${filter === 'PREMIUM' ? 'active' : ''}`} onClick={() => setFilter('PREMIUM')}>
          PREMİUM
        </button>
        <button className={`filter-pill ${filter === 'VINTAGE' ? 'active' : ''}`} onClick={() => setFilter('VINTAGE')}>
          VİNTAGE
        </button>
      </div>
    </header>
  );
};

export default Header;
