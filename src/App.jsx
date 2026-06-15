import React, { useState, useMemo } from 'react';
import { useCars } from './hooks/useCars';
import Header from './components/Header';
import CarList from './components/CarList';
import BottomNav from './components/BottomNav';
import AddCarForm from './components/AddCarForm';
import CarDetailsModal from './components/CarDetailsModal';

function App() {
  const { cars, isLoaded, addCar, removeCar } = useCars();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const filteredCars = useMemo(() => {
    if (!searchQuery) return cars;
    const lowerQuery = searchQuery.toLowerCase();
    return cars.filter(car => 
      car.name.toLowerCase().includes(lowerQuery) || 
      (car.series && car.series.toLowerCase().includes(lowerQuery))
    );
  }, [cars, searchQuery]);

  if (!isLoaded) return null;

  return (
    <div className="container">
      {activeTab === 'home' ? (
        <>
          <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <main style={{ paddingTop: '16px' }}>
            <CarList cars={filteredCars} onCarClick={setSelectedCar} />
          </main>
        </>
      ) : (
        <div style={{ padding: '40px 16px', textAlign: 'center' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--hw-orange), #ff8a00)',
            margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem'
          }}>
            👤
          </div>
          <h2 style={{ marginBottom: '8px' }}>Koleksiyoner</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Toplam <strong>{cars.length}</strong> araban var!
          </p>
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'left' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '1.1rem' }}>İstatistikler</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
              <span>Super Treasure Hunt:</span>
              <strong>{cars.filter(c => c.rarity === 'Super Treasure Hunt').length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span>Normal (Common):</span>
              <strong>{cars.filter(c => c.rarity === 'Common').length}</strong>
            </div>
          </div>
        </div>
      )}

      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onAddClick={() => setIsAdding(true)} 
      />

      {isAdding && (
        <AddCarForm 
          onClose={() => setIsAdding(false)} 
          onAdd={addCar} 
        />
      )}

      {selectedCar && (
        <CarDetailsModal 
          car={selectedCar} 
          onClose={() => setSelectedCar(null)} 
          onDelete={removeCar}
        />
      )}
    </div>
  );
}

export default App;
