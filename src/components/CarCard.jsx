import { useState } from 'react';

const CarCard = ({ car, onClick, showOwner, likes = [], onLike, currentUserId }) => {
  const [showLikers, setShowLikers] = useState(false);
  const isLikedByMe = likes.some(l => l.user_id === currentUserId);

  // Rarity styling matching Yarış Garajı
  const getRarityDisplay = (rarity) => {
    switch (rarity) {
      case 'Super Treasure Hunt':
        return { text: 'STH', band: '#FF5A3C', full: '★★★★', empty: '★', prm: true };
      case 'Treasure Hunt':
        return { text: 'TH', band: '#2E7CF6', full: '★★★', empty: '★★', prm: false };
      case 'Premium':
        return { text: 'PRM', band: '#16A36B', full: '★★★', empty: '★★', prm: true };
      default:
        return { text: 'CMN', band: '#94a3b8', full: '★★', empty: '★★★', prm: false };
    }
  };

  const rarityInfo = getRarityDisplay(car.rarity);

  return (
    <div className="animate-fade-in" style={{
      background: '#fff', borderRadius: '22px', border: '2px solid #EEF2F9', 
      boxShadow: '0 10px 22px rgba(20,32,58,.09)', overflow: 'hidden', position: 'relative'
    }}>
      
      {/* Category Band */}
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 3, color: '#fff', fontWeight: '800', fontSize: '11px', padding: '5px 9px', borderRadius: '999px', boxShadow: '0 4px 8px rgba(0,0,0,.18)', background: rarityInfo.band }}>
        {car.series || rarityInfo.text}
      </div>

      {/* PRM Badge */}
      {rarityInfo.prm && (
        <div className="fredoka" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 3, background: '#7A4DFF', color: '#fff', fontWeight: '700', fontSize: '10px', padding: '4px 8px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(122,77,255,.4)' }}>
          PRM
        </div>
      )}

      {/* Likes */}
      {showOwner && onLike && (
        <div style={{ position: 'absolute', top: '40px', right: '10px', zIndex: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button 
            onClick={(e) => { e.stopPropagation(); onLike(); }}
            style={{
              background: '#fff', border: `2px solid ${isLikedByMe ? '#ff4d4d' : '#EEF2F9'}`,
              borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', padding: 0
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
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#5A6A85', background: '#EAF1FB', padding: '2px 8px', borderRadius: '8px', cursor: 'pointer' }}>
                {likes.length}
              </span>
              
              {showLikers && (
                <div style={{
                  position: 'absolute', top: '100%', right: '0', marginTop: '4px',
                  background: '#fff', border: '2px solid #EEF2F9', borderRadius: '12px', padding: '8px', zIndex: 20, minWidth: '100px', boxShadow: '0 10px 22px rgba(20,32,58,.15)'
                }}>
                  <div style={{ fontSize: '0.65rem', color: '#8A96AB', marginBottom: '4px', borderBottom: '1px solid #EEF2F9', paddingBottom: '2px', fontWeight: '800' }}>Beğenenler</div>
                  {likes.slice(0, 5).map(l => (
                    <div key={l.id} style={{ fontSize: '0.75rem', color: '#16233F', padding: '2px 0', whiteSpace: 'nowrap', fontWeight: '700' }}>{l.username}</div>
                  ))}
                  {likes.length > 5 && <div style={{ fontSize: '0.65rem', color: '#FF4D2E', fontWeight: '800' }}>+ {likes.length - 5} kişi</div>}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Owner Badge */}
      {showOwner && car.owner_name && (
        <div style={{ 
          position: 'absolute', top: '40px', left: '10px', background: '#fff', padding: '4px 10px', 
          borderRadius: '12px', fontSize: '0.75rem', color: '#2E7CF6', zIndex: 10, border: '2px solid #EEF2F9', fontWeight: '800', boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
        }}>
          👤 {car.owner_name}
        </div>
      )}

      <div onClick={() => onClick(car)} style={{ cursor: 'pointer' }}>
        
        {/* Image Area */}
        <div style={{ height: '150px', background: 'linear-gradient(150deg,#EAF3FF,#F7FBFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {car.image ? (
            <img src={car.image} alt={car.name} style={{ height: '138px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 9px 11px rgba(0,0,0,.28))', transform: 'rotate(-3deg)' }} />
          ) : (
            <div style={{ fontSize: '3rem', opacity: 0.5 }}>🚗</div>
          )}
        </div>

        {/* Content Area */}
        <div style={{ padding: '12px 13px 14px' }}>
          <div className="fredoka" style={{ fontWeight: '600', fontSize: '15px', color: '#16233F', lineHeight: '1.08', minHeight: '33px' }}>{car.name}</div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '7px' }}>
            <div style={{ fontSize: '15px', letterSpacing: '1px' }}>
              <span style={{ color: '#FFC23C' }}>{rarityInfo.full}</span><span style={{ color: '#DCE3EE' }}>{rarityInfo.empty}</span>
            </div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#9AA6BB' }}>{car.year || '-'}</div>
          </div>
          
          {car.price && (
            <div className="fredoka" style={{ marginTop: '9px', display: 'inline-block', fontWeight: '700', fontSize: '14px', color: '#16A36B', background: '#E6F8F0', padding: '5px 11px', borderRadius: '999px' }}>
              ₺{car.price}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarCard;
