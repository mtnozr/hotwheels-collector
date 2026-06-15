import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Supabase zorunlu olarak e-posta istediği için kullanıcı adından sahte bir e-posta üretiyoruz.
    const safeUsername = username.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    if (!safeUsername) {
      alert('Lütfen geçerli bir kullanıcı adı girin (sadece harf ve rakam).');
      setLoading(false);
      return;
    }
    const fakeEmail = `${safeUsername}@garajapp.com`;

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ 
          email: fakeEmail, 
          password 
        });
        if (error) throw error;
      } else {
        if (!fullName) {
          alert('Lütfen ad ve soyadınızı girin.');
          setLoading(false);
          return;
        }
        
        const { error } = await supabase.auth.signUp({ 
          email: fakeEmail, 
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });
        if (error) throw error;
        alert('Kayıt başarılı! Lütfen giriş yapın.');
        setIsLogin(true);
      }
    } catch (error) {
      if (error.message.includes('Invalid login credentials')) {
        alert('Kullanıcı adı veya şifre hatalı.');
      } else {
        alert(error.error_description || error.message);
      }
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
            <label className="input-label">Kullanıcı Adı (Boşluksuz)</label>
            <input 
              type="text" 
              className="input-field" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Örn: kagan123"
              required
            />
          </div>
          
          {!isLogin && (
            <div className="input-group" style={{ textAlign: 'left' }}>
              <label className="input-label">Ad Soyad</label>
              <input 
                type="text" 
                className="input-field" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Örn: Kağan Özer"
                required={!isLogin}
              />
            </div>
          )}

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
