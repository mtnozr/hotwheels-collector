import { useState, useEffect } from 'react';
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

  return (
    <div style={{ padding: '0 16px', paddingBottom: '100px' }}>
      <div style={{ marginBottom: '20px', paddingTop: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🌍 Keşfet</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.4' }}>
          Topluluğun paylaşıma açtığı birbirinden özel Hot Wheels modellerini inceleyin.
        </p>
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
      ) : (
        <CarList cars={exploreCars} onCarClick={onCarClick} showOwner={true} />
      )}
      
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Explore;
