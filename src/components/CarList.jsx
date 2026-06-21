import React from 'react';
import CarCard from './CarCard';

const CarList = ({ cars, onCarClick, showOwner = false, likesData = [], onLike, currentUserId }) => {
  if (!cars || cars.length === 0) {
    return (
      <div className="empty-state animate-fade-in" style={{ textAlign: 'center', padding: '40px 20px', color: '#8A96AB', fontWeight: '800' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏎️</div>
        <h3 className="fredoka" style={{ marginBottom: '8px', color: '#16233F' }}>Bu kutuda henüz araba yok</h3>
        <p>Aşağıdaki ekle butonuna basarak ilk arabanı koleksiyona ekle.</p>
      </div>
    );
  }

  return (
    <div className="car-grid">
      {cars.map((car) => {
        const carLikes = likesData.filter(l => l.car_id === car.id);
        return (
          <CarCard 
            key={car.id} 
            car={car} 
            onClick={onCarClick} 
            showOwner={showOwner} 
            likes={carLikes}
            onLike={onLike ? () => onLike(car) : undefined}
            currentUserId={currentUserId}
          />
        );
      })}
    </div>
  );
};

export default CarList;
