import React from 'react';

const Header = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="app-header">
      <div className="header-top">
        <div>
          <h1 className="text-gradient" style={{ fontSize: '1.5rem' }}>Kağan'ın Garajı</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hot Wheels Koleksiyonum</p>
        </div>
        <div style={{ width: '80px', display: 'flex', alignItems: 'center' }}>
          <img 
            src="/hw-logo.png" 
            alt="Hot Wheels Logo" 
            style={{ width: '100%', filter: 'drop-shadow(0 2px 8px rgba(255, 91, 0, 0.4))' }} 
          />
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
