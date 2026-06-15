import React from 'react';

const BottomNav = ({ activeTab, setActiveTab, onAddClick }) => {
  return (
    <nav className="glass-nav" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '64px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingBottom: 'safe-area-inset-bottom',
      zIndex: 50
    }}>
      <button 
        style={{ 
          color: activeTab === 'home' ? 'var(--hw-orange)' : 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px'
        }}
        onClick={() => setActiveTab('home')}
      >
        <span style={{ fontSize: '1.2rem' }}>🏠</span>
        <span style={{ fontSize: '0.65rem', fontWeight: '500' }}>Koleksiyon</span>
      </button>

      <div style={{ position: 'relative', top: '-15px' }}>
        <button 
          onClick={onAddClick}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--hw-orange), #ff8a00)',
            color: '#fff',
            fontSize: '1.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(255, 91, 0, 0.4)',
            border: '4px solid var(--bg-dark)'
          }}
        >
          +
        </button>
      </div>

      <button 
        style={{ 
          color: activeTab === 'profile' ? 'var(--hw-orange)' : 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px'
        }}
        onClick={() => setActiveTab('profile')}
      >
        <span style={{ fontSize: '1.2rem' }}>👤</span>
        <span style={{ fontSize: '0.65rem', fontWeight: '500' }}>Profil</span>
      </button>
    </nav>
  );
};

export default BottomNav;
