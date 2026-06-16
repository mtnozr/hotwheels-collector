import { useState } from 'react';

const CarCard = ({ car, onClick, showOwner, likes = [], onLike, currentUserId }) => {
  const [showLikers, setShowLikers] = useState(false);
  const isLikedByMe = likes.some(l => l.user_id === currentUserId);

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
    <div className="car-card-premium animate-fade-in" style={{ '--card-glow': car.color || '#ff5b00', position: 'relative' }}>
      
      {showOwner && onLike && (
        <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button 
            onClick={(e) => { e.stopPropagation(); onLike(); }}
            style={{
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
              border: `1px solid ${isLikedByMe ? '#ff4d4d' : 'rgba(255,255,255,0.2)'}`,
              borderRadius: '50%', width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s',
              color: isLikedByMe ? '#ff4d4d' : 'white', padding: 0
            }}
          >
            {isLikedByMe ? '❤️' : '🤍'}
          </button>
          
          {likes.length > 0 && (
            <div 
              style={{ position: 'relative', marginTop: '4px' }}
              onMouseEnter={() => setShowLikers(true)}
              onMouseLeave={() => setShowLikers(false)}
              onClick={(e) => { e.stopPropagation(); setShowLikers(!showLikers); }}
            >
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'white', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '8px', cursor: 'pointer' }}>
                {likes.length}
              </span>
              
              {showLikers && (
                <div style={{
                  position: 'absolute', top: '100%', right: '0', marginTop: '4px',
                  background: 'rgba(0,0,0,0.9)', border: '1px solid var(--border-color)',
                  borderRadius: '8px', padding: '8px', zIndex: 20, minWidth: '100px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2px' }}>Beğenenler</div>
                  {likes.slice(0, 5).map(l => (
                    <div key={l.id} style={{ fontSize: '0.75rem', color: 'white', padding: '2px 0', whiteSpace: 'nowrap' }}>{l.username}</div>
                  ))}
                  {likes.length > 5 && <div style={{ fontSize: '0.65rem', color: 'var(--hw-orange)' }}>+ {likes.length - 5} kişi</div>}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div onClick={() => onClick(car)} style={{ cursor: 'pointer' }}>
        {showOwner && car.owner_name && (
        <div style={{ 
          position: 'absolute', 
          top: '8px', 
          left: '8px', 
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
    </div>
  );
};

export default CarCard;
