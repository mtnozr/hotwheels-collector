import React from 'react';
import CarCard from './CarCard';

const CarList = ({ cars, onCarClick }) => {
  if (!cars || cars.length === 0) {
    return (
      <div className="empty-state animate-fade-in" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}>🏁</div>
        <h3 style={{ marginBottom: '8px', color: 'white' }}>Garaj Bomboş!</h3>
        <p>Aşağıdaki ekle butonuna basarak ilk arabanı koleksiyona ekle.</p>
      </div>
    );
  }

  return (
    <div className="car-grid">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} onClick={onCarClick} />
      ))}
    </div>
  );
};

export default CarList;
