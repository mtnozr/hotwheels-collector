import React from 'react';

const BottomNav = ({ activeTab, setActiveTab, onAddClick }) => {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, height: '90px',
      background: '#fff', borderTop: '2px solid #EEF2F9',
      boxShadow: '0 -8px 24px rgba(20,32,58,.07)', display: 'flex',
      alignItems: 'flex-start', justifyContent: 'space-around', padding: '12px 26px 0', zIndex: 60
    }}>
      
      {/* Garaj */}
      <div 
        onClick={() => setActiveTab('home')}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
      >
        <div style={{ width: '30px', height: '24px', borderRadius: '5px', background: activeTab === 'home' ? '#FF4D2E' : '#D7DEEA', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-9px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderBottom: `11px solid ${activeTab === 'home' ? '#FF4D2E' : '#D7DEEA'}` }}></div>
        </div>
        <div style={{ fontSize: '11px', fontWeight: '800', color: activeTab === 'home' ? '#FF4D2E' : '#A9B4C8' }}>Garaj</div>
      </div>

      {/* Keşfet */}
      <div 
        onClick={() => setActiveTab('explore')}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
      >
        <div style={{ width: '26px', height: '26px', borderRadius: '50%', border: `3px solid ${activeTab === 'explore' ? '#FF4D2E' : '#B4C0D6'}` }}></div>
        <div style={{ fontSize: '11px', fontWeight: '800', color: activeTab === 'explore' ? '#FF4D2E' : '#A9B4C8' }}>Keşfet</div>
      </div>

      {/* Ekle (Orta Büyük Buton) */}
      <div 
        onClick={onAddClick}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginTop: '-24px', cursor: 'pointer' }}
      >
        <div style={{
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'linear-gradient(135deg,#FF4D2E,#FF7A2E)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 20px rgba(255,77,46,.45)',
          animation: 'vg-pulse 1.6s ease-in-out infinite'
        }}>
          <div style={{ width: '24px', height: '4px', background: '#fff', borderRadius: '3px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '10px', top: '-10px', width: '4px', height: '24px', background: '#fff', borderRadius: '3px' }}></div>
          </div>
        </div>
        <div style={{ fontSize: '11px', fontWeight: '800', color: '#FF4D2E' }}>Ekle</div>
      </div>

      {/* Profil */}
      <div 
        onClick={() => setActiveTab('profile')}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
      >
        <div style={{ width: '24px', height: '24px', borderRadius: '8px', background: activeTab === 'profile' ? '#FF4D2E' : '#D7DEEA' }}></div>
        <div style={{ fontSize: '11px', fontWeight: '800', color: activeTab === 'profile' ? '#FF4D2E' : '#A9B4C8' }}>Profil</div>
      </div>

    </div>
  );
};

export default BottomNav;
