import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Kayıt başarılı! Lütfen giriş yapın.');
        setIsLogin(true);
      }
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '30px', textAlign: 'center' }}>
        <div style={{
          background: 'linear-gradient(135deg, #e3000f, #ff4500)',
          borderRadius: '12px 12px 12px 2px',
          padding: '8px 16px',
          color: '#fff',
          fontWeight: '900',
          fontSize: '1.2rem',
          fontStyle: 'italic',
          border: '2px solid #ffcc00',
          display: 'inline-block',
          marginBottom: '24px',
          transform: 'skewX(-10deg)'
        }}>
          HOT<br/>WHEELS
        </div>
        
        <h2 style={{ marginBottom: '20px' }}>{isLogin ? 'Garaja Giriş Yap' : 'Yeni Garaj Oluştur'}</h2>
        
        <form onSubmit={handleAuth}>
          <div className="input-group" style={{ textAlign: 'left' }}>
            <label className="input-label">E-posta</label>
            <input 
              type="email" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group" style={{ textAlign: 'left' }}>
            <label className="input-label">Şifre</label>
            <input 
              type="password" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Bekleniyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
          </button>
        </form>
        
        <p style={{ marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {isLogin ? 'Hesabın yok mu? ' : 'Zaten hesabın var mı? '}
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: 'var(--hw-orange)', fontWeight: 'bold' }}
          >
            {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
