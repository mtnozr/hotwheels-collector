import React from 'react';

const CarCard = ({ car, onClick }) => {
  // Rarity color mapping
  const rarityColors = {
    'Common': '#a0a5b1',
    'Treasure Hunt': '#005bbb',
    'Super Treasure Hunt': '#ff5b00',
    'Premium': '#ff8a00'
  };

  const badgeColor = rarityColors[car.rarity] || rarityColors['Common'];

  return (
    <div 
      className="car-card glass-panel animate-fade-in" 
      onClick={() => onClick && onClick(car)}
      style={{
        cursor: 'pointer',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      <div 
        className="car-image-container"
        style={{
          height: '140px',
          backgroundColor: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '10px'
        }}
      >
        {car.image ? (
          <img 
            src={car.image} 
            alt={car.name} 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <div style={{ color: 'var(--text-muted)' }}>📸 Foto Yok</div>
        )}
      </div>

      <div style={{ padding: '12px' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {car.name}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
          {car.series} {car.year ? `• ${car.year}` : ''}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <span style={{ 
            fontSize: '0.7rem', 
            padding: '4px 8px', 
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.1)',
            color: badgeColor,
            fontWeight: '600',
            border: `1px solid ${badgeColor}40`
          }}>
            {car.rarity || 'Common'}
          </span>
          <div style={{ 
            width: '16px', 
            height: '16px', 
            borderRadius: '50%', 
            backgroundColor: car.color || '#fff',
            border: '1px solid var(--border-color)'
          }} title={`Renk: ${car.color}`} />
        </div>
      </div>
    </div>
  );
};

export default CarCard;
