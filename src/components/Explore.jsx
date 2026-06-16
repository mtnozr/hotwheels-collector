import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import CarList from './CarList';

const Explore = ({ onCarClick }) => {
  const [exploreCars, setExploreCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGlobalCars = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('is_shared', true)
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (error) throw error;
      if (data) setExploreCars(data);
    } catch (error) {
      console.error('Error fetching global cars:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalCars();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('ALL');

  const filteredExploreCars = useMemo(() => {
    let result = exploreCars;
    
    // Apply text search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(car => 
        car.name.toLowerCase().includes(lowerQuery) || 
        (car.series && car.series.toLowerCase().includes(lowerQuery)) ||
        (car.owner_name && car.owner_name.toLowerCase().includes(lowerQuery))
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
        result = result.filter(car => parseInt(car.year) < 2000 || (car.series && car.series.toLowerCase().includes('vintage')));
      }
    }

    return result;
  }, [exploreCars, searchQuery, filter]);

  return (
    <div style={{ padding: '0 16px', paddingBottom: '100px' }}>
      <div style={{ marginBottom: '16px', paddingTop: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🌍 Keşfet</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.4' }}>
          Topluluğun paylaşıma açtığı birbirinden özel Hot Wheels modellerini inceleyin.
        </p>
      </div>

      <div className="search-container" style={{ marginBottom: '16px' }}>
        <span className="search-icon">🔍</span>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Toplulukta Ara..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="filter-scroll" style={{ marginBottom: '20px' }}>
        <button className={`filter-pill ${filter === 'ALL' ? 'active' : ''}`} onClick={() => setFilter('ALL')}>
          TÜMÜ
        </button>
        <button className={`filter-pill ${filter === 'STH' ? 'active' : ''}`} onClick={() => setFilter('STH')}>
          SUPER TREASURE HUNT
        </button>
        <button className={`filter-pill ${filter === 'TH' ? 'active' : ''}`} onClick={() => setFilter('TH')}>
          TREASURE HUNT
        </button>
        <button className={`filter-pill ${filter === 'PREMIUM' ? 'active' : ''}`} onClick={() => setFilter('PREMIUM')}>
          PREMİUM
        </button>
        <button className={`filter-pill ${filter === 'VINTAGE' ? 'active' : ''}`} onClick={() => setFilter('VINTAGE')}>
          VİNTAGE
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite', marginBottom: '10px' }}>⏳</div>
          <p>Arabalar yükleniyor...</p>
        </div>
      ) : exploreCars.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px', opacity: 0.5 }}>🌍</span>
          <h3 style={{ color: 'white', marginBottom: '8px' }}>Henüz Kimse Araba Paylaşmamış</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '80%', margin: '0 auto' }}>
            Toplulukta ilk arabayı paylaşan siz olun! Garajınızdaki bir arabanın içine girip "Paylaş" butonuna basabilirsiniz.
          </p>
        </div>
      ) : filteredExploreCars.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          <p>Arama kriterlerine uygun araba bulunamadı.</p>
        </div>
      ) : (
        <CarList cars={filteredExploreCars} onCarClick={onCarClick} showOwner={true} />
      )}
      
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Explore;
