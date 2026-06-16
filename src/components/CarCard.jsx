import React from 'react';

const CarCard = ({ car, onClick, showOwner }) => {
  // Rarity styling
  const getRarityDisplay = (rarity) => {
    switch (rarity) {
      case 'Super Treasure Hunt':
        return { text: 'STH', color: '#4ade80', stars: '★★★★' };
      case 'Treasure Hunt':
        return { text: 'TH', color: '#60a5fa', stars: '★★★☆' };
      case 'Premium':
        return { text: 'PRM', color: '#c084fc', stars: '★★★☆' };
      default:
        return { text: 'CMN', color: '#94a3b8', stars: '★★☆☆' };
    }
  };

  const rarityInfo = getRarityDisplay(car.rarity);

  return (
    <div className="car-card-premium animate-fade-in" onClick={() => onClick(car)} style={{ '--card-glow': car.color || '#ff5b00' }}>
      
      {showOwner && car.owner_name && (
        <div style={{ 
          position: 'absolute', 
          top: '-10px', 
          left: '10px', 
          background: 'rgba(0,0,0,0.8)', 
          backdropFilter: 'blur(4px)',
          padding: '4px 10px', 
          borderRadius: '12px',
          fontSize: '0.75rem',
          color: 'var(--hw-orange)',
          zIndex: 10,
          border: '1px solid rgba(255,91,0,0.3)'
        }}>
          👤 {car.owner_name}
        </div>
      )}

      {car.series && (
        <div className="card-number-badge">
          {car.series}
        </div>
      )}

      <div className="card-image-container">
        {car.image ? (
          <img src={car.image} alt={car.name} />
        ) : (
          <div style={{ fontSize: '3rem', opacity: 0.5 }}>🚗</div>
        )}
      </div>

      <div className="card-content">
        <div className="card-title">{car.name}</div>
        
        <div className="card-stats">
          <div className="stat-col">
            <span className="stat-label">Rarity</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {car.price && <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white' }}>₺{car.price}</span>}
              <span className="rarity-badge" style={{ color: rarityInfo.color }}>{rarityInfo.text}</span>
            </div>
            <span className="stars">{rarityInfo.stars}</span>
          </div>

          <div className="stat-col" style={{ alignItems: 'flex-end' }}>
            <span className="stat-label">Year</span>
            <span className="stat-value">{car.year || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
