import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { useCars } from './hooks/useCars';
import Header from './components/Header';
import CarList from './components/CarList';
import BottomNav from './components/BottomNav';
import AddCarForm from './components/AddCarForm';
import CarDetailsModal from './components/CarDetailsModal';
import Auth from './components/Auth';

function App() {
  const [session, setSession] = useState(null);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsSessionLoaded(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { cars, isLoaded, addCar, removeCar } = useCars(session);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('home');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const filteredCars = useMemo(() => {
    let result = cars;
    
    // Apply text search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(car => 
        car.name.toLowerCase().includes(lowerQuery) || 
        (car.series && car.series.toLowerCase().includes(lowerQuery))
      );
    }

    // Apply category filter
    if (filter !== 'ALL') {
      if (filter === 'STH') {
        result = result.filter(car => car.rarity === 'Super Treasure Hunt');
      } else if (filter === 'TH') {
        result = result.filter(car => car.rarity === 'Treasure Hunt');
      } else if (filter === 'PREMIUM') {
        result = result.filter(car => car.rarity === 'Premium');
      } else if (filter === 'VINTAGE') {
        // Assume Vintage means year < 2000, or explicitly named Vintage.
        // If year exists and < 2000, or we can just filter by rarity if needed.
        result = result.filter(car => parseInt(car.year) < 2000 || (car.series && car.series.toLowerCase().includes('vintage')));
      }
    }

    return result;
  }, [cars, searchQuery, filter]);

  if (!isSessionLoaded) return null;

  if (!session) {
    return <Auth />;
  }

  // Get full_name from Supabase user metadata
  const userFullName = session.user.user_metadata?.full_name || 'Koleksiyoner';

  return (
    <div className="container">
      {activeTab === 'home' ? (
        <>
          <Header 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            userName={userFullName} 
            filter={filter}
            setFilter={setFilter}
          />
          <main style={{ paddingTop: '8px' }}>
            <CarList cars={filteredCars} onCarClick={setSelectedCar} />
          </main>
        </>
      ) : (
        <div style={{ padding: '40px 16px', textAlign: 'center' }}>
          <div style={{ 
            width: '100px', height: '100px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--hw-orange), #ff8a00)',
            margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3rem',
            boxShadow: '0 4px 14px rgba(255, 91, 0, 0.4)'
          }}>
            👦🏻
          </div>
          <h2 style={{ marginBottom: '8px' }}>{userFullName}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Koleksiyonunda <strong>{cars.filter(c => c.user_id === session.user.id).length}</strong> araban var!
          </p>
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'left', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '1.1rem' }}>Global İstatistikler</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
              <span>Super Treasure Hunt:</span>
              <strong>{cars.filter(c => c.rarity === 'Super Treasure Hunt').length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span>Normal (Common):</span>
              <strong>{cars.filter(c => c.rarity === 'Common').length}</strong>
            </div>
          </div>
          
          <button 
            className="btn-primary" 
            style={{ background: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', boxShadow: 'none' }}
            onClick={() => supabase.auth.signOut()}
          >
            Çıkış Yap
          </button>
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
          currentUserId={session.user.id}
          onClose={() => setSelectedCar(null)} 
          onDelete={removeCar}
        />
      )}
    </div>
  );
}

export default App;
