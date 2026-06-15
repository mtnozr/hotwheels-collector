import React from 'react';

const Header = ({ searchQuery, setSearchQuery, userName }) => {
  // Basit bir kesme işareti kuralı: İsmin son harfine göre kesme işareti eklenebilir, ancak şimdilik sabit "'ın Garajı" veya "'in Garajı" kullanmak yerine, ismin sonuna sadece " Garajı" veya kesme işareti ekleyebiliriz.
  // En kolayı, adın sadece ilk ismini alıp "'ın Garajı" yazmak veya doğrudan "[Ad Soyad] Garajı" yapmaktır.
  const displayTitle = userName ? `${userName.split(' ')[0]}'ın Garajı` : "Garajım";

  return (
    <header className="app-header">
      <div className="header-top">
        <div>
          <h1 className="text-gradient" style={{ fontSize: '1.5rem' }}>{displayTitle}</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hot Wheels Koleksiyonum</p>
        </div>
          <div style={{
            background: 'linear-gradient(135deg, #e3000f, #ff4500)',
            borderRadius: '12px 12px 12px 2px',
            padding: '4px 8px',
            color: '#fff',
            fontWeight: '900',
            fontSize: '0.75rem',
            fontStyle: 'italic',
            border: '2px solid #ffcc00',
            boxShadow: '0 2px 8px rgba(227, 0, 15, 0.5)',
            textAlign: 'center',
            textShadow: '1px 1px 0px #000'
          }}>
            HOT<br/>WHEELS
          </div>
      </div>
      
      <div className="search-bar" style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)'
        }}>
          🔍
        </div>
        <input 
          type="text" 
          placeholder="Arabalarını ara..." 
          className="input-field glass-panel"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '40px', borderRadius: 'var(--radius-full)' }}
        />
      </div>
    </header>
  );
};

export default Header;
