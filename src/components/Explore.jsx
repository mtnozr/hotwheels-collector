import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import CarList from './CarList';

const Explore = ({ onCarClick, session }) => {
  const [exploreCars, setExploreCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likesData, setLikesData] = useState([]);

  const fetchLikes = async (carIds) => {
    if (!carIds || carIds.length === 0) return;
    const { data, error } = await supabase.from('likes').select('*').in('car_id', carIds);
    if (data) setLikesData(data);
  };

  const handleLike = async (car) => {
    if (!session) return;
    const currentUserId = session.user.id;
    const currentUsername = session.user.email ? `@${session.user.email.split('@')[0]}` : 'Koleksiyoner';
    
    const existingLike = likesData.find(l => l.car_id === car.id && l.user_id === currentUserId);
    
    if (existingLike) {
      // Unlike
      setLikesData(prev => prev.filter(l => l.id !== existingLike.id)); // Optimistic UI
      await supabase.from('likes').delete().eq('id', existingLike.id);
    } else {
      // Like
      const tempId = Date.now().toString();
      const newLike = { id: tempId, car_id: car.id, user_id: currentUserId, username: currentUsername };
      setLikesData(prev => [...prev, newLike]); // Optimistic UI
      
      const { data } = await supabase.from('likes').insert([{
        car_id: car.id,
        user_id: currentUserId,
        username: currentUsername
      }]).select();
      
      if (data) {
        setLikesData(prev => prev.map(l => l.id === tempId ? data[0] : l));
        // Bildirim gönder (kendi arabası değilse)
        if (car.user_id !== currentUserId) {
          await supabase.from('notifications').insert([{
            recipient_id: car.user_id,
            sender_username: currentUsername,
            car_name: car.name,
            car_id: car.id
          }]);
        }
      }
    }
  };

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
      if (data) {
        setExploreCars(data);
        fetchLikes(data.map(c => c.id));
      }
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

  const chips = ['ALL', 'STH', 'TH', 'PREMIUM', 'VINTAGE'];
  const chipLabels = {
    'ALL': 'TÜMÜ',
    'STH': 'SUPER TREASURE HUNT',
    'TH': 'TREASURE HUNT',
    'PREMIUM': 'PREMİUM',
    'VINTAGE': 'VİNTAGE'
  };

  return (
    <div style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '0 18px', paddingTop: '20px' }}>
        <h2 className="fredoka" style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#16233F' }}>🌍 Keşfet</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.4', fontWeight: '700' }}>
          Topluluğun paylaşıma açtığı birbirinden özel Hot Wheels modellerini inceleyin.
        </p>
      </div>

      {/* search */}
      <div style={{ margin: '14px 18px 0', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ flex: 1, height: '54px', borderRadius: '18px', background: '#fff', border: '2px solid #E6EDF7', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 16px', boxShadow: '0 4px 12px rgba(20,32,58,.05)' }}>
          <div style={{ width: '18px', height: '18px', border: '3px solid #B4C0D6', borderRadius: '50%', position: 'relative' }}>
            <div style={{ position: 'absolute', width: '3px', height: '8px', background: '#B4C0D6', borderRadius: '2px', right: '-4px', bottom: '-4px', transform: 'rotate(-45deg)' }}></div>
          </div>
          <input 
            type="text"
            placeholder="Toplulukta Ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontWeight: '800', color: '#16233F', fontSize: '15px', width: '100%' }}
          />
        </div>
      </div>

      {/* chips */}
      <div style={{ marginTop: '14px', padding: '0 18px', display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none', marginBottom: '20px' }}>
        {chips.map(c => {
          const isActive = filter === c;
          const activeStyle = { flex: 'none', fontWeight: '900', fontSize: '14px', color: '#fff', padding: '11px 18px', borderRadius: '999px', background: 'linear-gradient(135deg,#FF4D2E,#FF7A2E)', boxShadow: '0 6px 14px rgba(255,77,46,.4)', cursor: 'pointer', whiteSpace: 'nowrap' };
          const inactiveStyle = { flex: 'none', fontWeight: '900', fontSize: '14px', color: '#5A6A85', padding: '11px 18px', borderRadius: '999px', background: '#EAF1FB', cursor: 'pointer', whiteSpace: 'nowrap' };
          return (
            <div key={c} onClick={() => setFilter(c)} style={isActive ? activeStyle : inactiveStyle}>
              {chipLabels[c]}
            </div>
          );
        })}
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
        <CarList 
          cars={filteredExploreCars} 
          onCarClick={onCarClick} 
          showOwner={true} 
          likesData={likesData}
          onLike={handleLike}
          currentUserId={session?.user?.id}
        />
      )}
      
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Explore;
