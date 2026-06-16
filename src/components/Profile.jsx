import React, { useMemo } from 'react';
import { supabase } from '../supabaseClient';

const Profile = ({ cars, session }) => {
  const [newPassword, setNewPassword] = React.useState('');
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const userFullName = session.user.user_metadata?.full_name || 'Koleksiyoner';
  
  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 6) {
      setMessage('Şifre en az 6 karakter olmalıdır.');
      return;
    }
    
    setIsChangingPassword(true);
    setMessage('');
    
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setMessage('Şifreniz başarıyla güncellendi!');
      setNewPassword('');
    } catch (error) {
      setMessage('Hata: ' + error.message);
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  // Calculate statistics only for the current user's cars
  const { totalCars, totalValue, rarities } = useMemo(() => {
    const myCars = cars.filter(c => c.user_id === session.user.id);
    
    let value = 0;
    const rarityCounts = {
      'Super Treasure Hunt': 0,
      'Treasure Hunt': 0,
      'Premium': 0,
      'Common': 0
    };

    myCars.forEach(car => {
      // Sum up prices
      if (car.price && !isNaN(parseFloat(car.price))) {
        value += parseFloat(car.price);
      }
      
      // Count rarities
      if (rarityCounts[car.rarity] !== undefined) {
        rarityCounts[car.rarity]++;
      } else {
        rarityCounts['Common']++; // fallback
      }
    });

    return { totalCars: myCars.length, totalValue: value, rarities: rarityCounts };
  }, [cars, session.user.id]);

  return (
    <div style={{ padding: '40px 16px', textAlign: 'center', animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ 
        width: '100px', height: '100px', borderRadius: '50%', 
        background: 'linear-gradient(135deg, var(--hw-orange), #ff8a00)',
        margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '3.5rem',
        boxShadow: '0 4px 14px rgba(255, 91, 0, 0.4)'
      }}>
        🧑‍🚀
      </div>
      <h2 style={{ marginBottom: '8px', fontSize: '1.8rem' }}>{userFullName}</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Hot Wheels Koleksiyoneri</p>

      {/* İstatistik Kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>🏎️</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'white' }}>{totalCars}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Toplam Araba</div>
        </div>
        <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>💰</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#4ade80' }}>₺{totalValue}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Koleksiyon Değeri</div>
        </div>
      </div>

      {/* Nadirlik İstatistikleri */}
      <div className="glass-panel" style={{ padding: '20px', textAlign: 'left', marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>💎</span> Nadirlik Dağılımı
        </h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Super Treasure Hunt (STH)</span>
          <strong style={{ color: 'var(--hw-orange)', fontSize: '1.1rem' }}>{rarities['Super Treasure Hunt']}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Treasure Hunt (TH)</span>
          <strong style={{ color: '#60a5fa', fontSize: '1.1rem' }}>{rarities['Treasure Hunt']}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Premium</span>
          <strong style={{ color: '#c084fc', fontSize: '1.1rem' }}>{rarities['Premium']}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
          <span style={{ color: 'var(--text-muted)' }}>Normal (Common)</span>
          <strong style={{ color: 'white', fontSize: '1.1rem' }}>{rarities['Common']}</strong>
        </div>
      </div>
      <div className="glass-panel" style={{ padding: '20px', textAlign: 'left', marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🔒</span> Güvenlik
        </h3>
        <div className="input-group">
          <input 
            type="password" 
            className="input-field" 
            placeholder="Yeni Şifre" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        {message && <p style={{ color: message.includes('başarılı') ? '#4ade80' : '#ff4d4d', fontSize: '0.9rem', marginBottom: '10px' }}>{message}</p>}
        <button 
          className="btn-primary" 
          style={{ width: '100%', fontSize: '0.9rem', padding: '10px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border-color)', boxShadow: 'none' }}
          onClick={handlePasswordChange}
          disabled={isChangingPassword || !newPassword}
        >
          {isChangingPassword ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
        </button>
      </div>

      <button 
        className="btn-primary" 
        style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255, 77, 77, 0.5)', color: '#ff4d4d', boxShadow: 'none' }}
        onClick={() => supabase.auth.signOut()}
      >
        Oturumu Kapat
      </button>
    </div>
  );
};

export default Profile;
