import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { useCars } from './hooks/useCars';
import Header from './components/Header';
import CarList from './components/CarList';
import BottomNav from './components/BottomNav';
import AddCarForm from './components/AddCarForm';
import CarDetailsModal from './components/CarDetailsModal';
import Auth from './components/Auth';
import Profile from './components/Profile';
import Explore from './components/Explore';

function App() {
  const [session, setSession] = useState(null);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  const [sharedCarId, setSharedCarId] = useState(null);
  const [sharedCarData, setSharedCarData] = useState(null);
  const [loadingShared, setLoadingShared] = useState(false);

  useEffect(() => {
    // Check for shared_car in URL before session loads
    const params = new URLSearchParams(window.location.search);
    const carId = params.get('shared_car');
    if (carId) {
      setSharedCarId(carId);
      fetchSharedCar(carId);
    }
  }, []);

  const fetchSharedCar = async (id) => {
    setLoadingShared(true);
    const { data } = await supabase.from('cars').select('*').eq('id', id).eq('is_shared', true).single();
    if (data) setSharedCarData(data);
    setLoadingShared(false);
  };

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

  const { cars, isLoaded, addCar, updateCar, removeCar, shareCar } = useCars(session);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('home');
  const [isAdding, setIsAdding] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
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

  if (sharedCarId) {
    if (loadingShared) return <div className="container" style={{padding:'40px', textAlign:'center'}}>Araba yükleniyor...</div>;
    if (!sharedCarData) return <div className="container" style={{padding:'40px', textAlign:'center'}}>Araba bulunamadı veya paylaşımı durdurulmuş.</div>;
    return (
      <div className="container" style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CarDetailsModal 
           car={sharedCarData} 
           currentUserId={session?.user?.id}
           onClose={() => {
             window.history.pushState({}, '', '/');
             setSharedCarId(null);
             setSharedCarData(null);
           }}
        />
      </div>
    );
  }

  if (!isSessionLoaded) return null;

  if (!session) {
    return <Auth />;
  }

  // Get full_name from Supabase user metadata
  const userFullName = session.user.user_metadata?.full_name || 'Koleksiyoner';

  return (
    <div className="container">
      <div className="app-wrapper">
        <div className="scroll-area">
          {activeTab === 'home' ? (
            <>
              <Header 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                userName={userFullName} 
                filter={filter}
                setFilter={setFilter}
                session={session}
              />
              <main style={{ paddingBottom: '100px' }}>
                <CarList cars={filteredCars} onCarClick={setSelectedCar} likesData={[]} onLike={undefined} currentUserId={session?.user?.id} />
              </main>
            </>
          ) : activeTab === 'explore' ? (
            <Explore onCarClick={setSelectedCar} session={session} />
          ) : (
            <Profile cars={cars} session={session} />
          )}
        </div>
        
        <BottomNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onAddClick={() => setIsAdding(true)} 
        />
      </div>

      {(isAdding || editingCar) && (
        <AddCarForm 
          initialData={editingCar}
          onClose={() => {
            setIsAdding(false);
            setEditingCar(null);
          }} 
          onSubmit={async (data) => {
            if (editingCar) {
              const updatedCar = await updateCar(editingCar.id, data);
              if (updatedCar && selectedCar && selectedCar.id === updatedCar.id) {
                setSelectedCar(updatedCar);
              }
            } else {
              await addCar(data);
            }
          }} 
        />
      )}

      {selectedCar && (
        <CarDetailsModal 
          car={selectedCar} 
          currentUserId={session.user.id}
          onClose={() => setSelectedCar(null)} 
          onDelete={removeCar}
          onEdit={(car) => setEditingCar(car)}
          onShare={shareCar}
        />
      )}
    </div>
  );
}

export default App;
