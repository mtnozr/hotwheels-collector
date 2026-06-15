import React from 'react';
import CarCard from './CarCard';

const CarList = ({ cars, onCarClick }) => {
  if (!cars || cars.length === 0) {
    return (
      <div className="empty-state animate-fade-in">
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏎️</div>
        <h3>Henüz araba eklemedin</h3>
        <p>Koleksiyonuna ilk arabanı eklemek için aşağıdaki + butonuna tıkla!</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: '16px',
      padding: '0 16px 20px'
    }}>
      {cars.map(car => (
        <CarCard key={car.id} car={car} onClick={onCarClick} />
      ))}
    </div>
  );
};

export default CarList;
