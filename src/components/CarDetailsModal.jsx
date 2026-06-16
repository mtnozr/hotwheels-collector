import React from 'react';

const CarDetailsModal = ({ car, currentUserId, onClose, onDelete, onEdit, onShare }) => {
  if (!car) return null;

  const handleShare = async () => {
    // Arabayı veritabanında "paylaşıldı" olarak işaretle
    if (onShare && !car.is_shared && currentUserId === car.user_id) {
      await onShare(car.id);
    }

    const shareUrl = `${window.location.origin}/?shared_car=${car.id}`;
    const shareData = {
      title: `${car.name} - Hot Wheels Koleksiyonum`,
      text: `Hot Wheels koleksiyonumdan ${car.name} (${car.year || ''}) modeline bak! Nadirlik: ${car.rarity}`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareUrl}`);
        alert('Araba linki kopyalandı! İstediğin kişiye gönderebilirsin.');
      }
    } catch (err) {
      console.error('Error sharing', err);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in" style={{ zIndex: 100 }}>
      <div className="modal-content" style={{ animation: 'fadeIn 0.3s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {car.name}
          </h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <div style={{ 
          height: '200px', 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          overflow: 'hidden',
          padding: '10px'
        }}>
          {car.image ? (
            <img src={car.image} alt={car.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <span style={{ fontSize: '3rem' }}>🚗</span>
          )}
        </div>

        <div style={{ marginBottom: '24px' }}>
          <p style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Seri:</span> 
            <strong>{car.series || '-'}</strong>
          </p>
          <p style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Yıl:</span> 
            <strong>{car.year || '-'}</strong>
          </p>
          <p style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Değeri:</span> 
            <strong style={{ color: '#4ade80' }}>{car.price ? `₺${car.price}` : '-'}</strong>
          </p>
          <p style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Nadirlik:</span> 
            <strong style={{ color: car.rarity === 'Super Treasure Hunt' ? 'var(--hw-orange)' : 'inherit' }}>{car.rarity}</strong>
          </p>
          <p style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Renk:</span> 
            <span style={{ 
              width: '24px', 
              height: '24px', 
              borderRadius: '50%', 
              backgroundColor: car.color,
              border: '1px solid var(--border-color)'
            }}></span>
          </p>
          {car.notes && (
            <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Notlar:</span> 
              <p style={{ fontSize: '0.9rem', color: 'white', lineHeight: '1.4' }}>{car.notes}</p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn-primary" 
            style={{ flex: 2, background: 'var(--hw-blue)', boxShadow: '0 4px 14px rgba(0, 91, 187, 0.3)' }}
            onClick={handleShare}
          >
            ↗ Arkadaşınla Paylaş
          </button>
          
          {currentUserId === car.user_id && (
            <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
              <button 
                className="btn-primary" 
                style={{ flex: 1, background: 'rgba(255, 255, 255, 0.1)', color: 'white', boxShadow: 'none' }}
                onClick={() => {
                  onEdit(car);
                  onClose();
                }}
              >
                ✏️
              </button>
              <button 
                className="btn-primary" 
                style={{ flex: 1, background: 'rgba(255, 0, 0, 0.2)', color: '#ff4d4d', boxShadow: 'none' }}
                onClick={() => {
                  if (window.confirm('Bu arabayı silmek istediğinden emin misin?')) {
                    onDelete(car.id);
                    onClose();
                  }
                }}
              >
                🗑️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetailsModal;
