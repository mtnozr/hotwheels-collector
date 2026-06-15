import React from 'react';

const Header = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="app-header">
      <div className="header-top">
        <div>
          <h1 className="text-gradient" style={{ fontSize: '1.5rem' }}>Garajım</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hot Wheels Koleksiyonum</p>
        </div>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--hw-blue), #00c6ff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '1rem',
          color: '#fff',
          boxShadow: '0 2px 10px rgba(0, 91, 187, 0.4)'
        }}>
          HW
        </div>
      </div>
      
      <div className="search-bar" style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)'
        }}>
          🔍
        </div>
        <input 
          type="text" 
          placeholder="Arabalarını ara..." 
          className="input-field glass-panel"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '40px', borderRadius: 'var(--radius-full)' }}
        />
      </div>
    </header>
  );
};

export default Header;
