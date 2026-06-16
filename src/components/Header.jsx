import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Header = ({ searchQuery, setSearchQuery, userName, filter, setFilter, session }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const displayTitle = userName ? `${userName.split(' ')[0]}'ın Koleksiyonu` : "Koleksiyonum";

  useEffect(() => {
    if (!session) return;
    const fetchNotifs = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      if (data) setNotifications(data);
    };
    fetchNotifs();
  }, [session]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleOpenNotifs = async () => {
    setShowNotifs(!showNotifs);
    if (!showNotifs && unreadCount > 0) {
      // Mark as read
      await supabase.from('notifications').update({ is_read: true }).eq('recipient_id', session.user.id).eq('is_read', false);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }
  };

  return (
    <header className="app-header" style={{ position: 'relative' }}>
      <div className="header-top">
        <button className="icon-btn" style={{ background: 'transparent' }}>👤</button>
        <h1 className="text-gradient" style={{ fontSize: '1.2rem', fontWeight: '600' }}>{displayTitle}</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="icon-btn" style={{ background: 'transparent', position: 'relative' }} onClick={handleOpenNotifs}>
            🔔
            {unreadCount > 0 && <span style={{ position: 'absolute', top: '8px', right: '10px', width: '8px', height: '8px', background: 'var(--hw-orange)', borderRadius: '50%' }}></span>}
          </button>
          <button className="icon-btn-avatar">
            👦🏻
          </button>
        </div>
      </div>

      {showNotifs && (
        <div style={{
          position: 'absolute', top: '60px', right: '16px', width: '280px',
          background: 'rgba(20,20,20,0.95)', backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-color)', borderRadius: '12px',
          padding: '12px', zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
          maxHeight: '300px', overflowY: 'auto'
        }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '12px', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>Bildirimler</h3>
          {notifications.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '16px 0' }}>Henüz bildirim yok.</p>
          ) : (
            notifications.map(n => (
              <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '1.2rem' }}>❤️</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  <strong style={{ color: 'white' }}>{n.sender_username}</strong> <span style={{ color: 'var(--hw-orange)' }}>{n.car_name}</span> arabanı beğendi!
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Arabaları Ara..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="filter-scroll">
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
    </header>
  );
};

export default Header;
