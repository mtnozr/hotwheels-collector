import React from 'react';

const BottomNav = ({ activeTab, setActiveTab, onAddClick }) => {
  return (
    <nav className="bottom-nav-premium">
      <button 
        className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} 
        onClick={() => setActiveTab('home')}
      >
        <span className="nav-icon">🏠</span>
        <span>Garaj</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'explore' ? 'active' : ''}`} 
        onClick={() => setActiveTab('explore')}
      >
        <span className="nav-icon">🌍</span>
        <span>Keşfet</span>
      </button>

      <button 
        className="nav-item" 
        onClick={onAddClick}
        style={{ color: 'var(--hw-orange)' }}
      >
        <span className="nav-icon" style={{ 
          background: 'var(--hw-orange)', 
          color: 'white', 
          borderRadius: '12px', 
          width: '36px', 
          height: '36px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(255, 91, 0, 0.4)'
        }}>➕</span>
        <span style={{ marginTop: '2px', color: 'white' }}>Ekle</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} 
        onClick={() => setActiveTab('profile')}
      >
        <span className="nav-icon">👤</span>
        <span>Profil</span>
      </button>
    </nav>
  );
};

export default BottomNav;
