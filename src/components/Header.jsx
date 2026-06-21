import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Header = ({ searchQuery, setSearchQuery, userName, filter, setFilter, session }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const displayTitle = userName ? `${userName.split(' ')[0]}'ın Garajı` : "Koleksiyonum";

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

  const chips = ['ALL', 'STH', 'TH', 'PREMIUM', 'VINTAGE'];
  const chipLabels = {
    'ALL': 'TÜMÜ',
    'STH': 'SUPER TREASURE HUNT',
    'TH': 'TREASURE HUNT',
    'PREMIUM': 'PREMİUM',
    'VINTAGE': 'VİNTAGE'
  };

  return (
    <header style={{ position: 'relative', zIndex: 5, paddingBottom: '14px' }}>
      
      {/* status bar spacing */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 26px 4px' }}>
        <div className="fredoka" style={{ fontWeight: '700', fontSize: '15px', color: '#22314E' }}>9:41</div>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <div style={{ width: '5px', height: '9px', background: '#22314E', borderRadius: '2px' }}></div>
          <div style={{ width: '5px', height: '12px', background: '#22314E', borderRadius: '2px' }}></div>
          <div style={{ width: '5px', height: '15px', background: '#22314E', borderRadius: '2px' }}></div>
          <div style={{ width: '22px', height: '12px', border: '2px solid #22314E', borderRadius: '3px', marginLeft: '3px', padding: '1px' }}><div style={{ width: '100%', height: '100%', background: '#22314E', borderRadius: '1px' }}></div></div>
        </div>
      </div>

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 18px 2px' }}>
        <div 
          onClick={handleOpenNotifs}
          style={{ width: '46px', height: '46px', borderRadius: '16px', background: 'linear-gradient(135deg,#2E7CF6,#22B7FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 14px rgba(46,124,246,.4)', cursor: 'pointer', position: 'relative' }}
        >
          <span style={{ fontSize: '18px' }}>🔔</span>
          {unreadCount > 0 && <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '14px', height: '14px', background: '#FF4D2E', borderRadius: '50%', border: '2px solid #fff' }}></div>}
        </div>

        <div style={{ textAlign: 'center', padding: '0 6px' }}>
          <div className="fredoka" style={{ fontWeight: '700', fontSize: '18px', color: '#16233F', lineHeight: '1.05' }}>{displayTitle}</div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#2E7CF6', letterSpacing: '.02em' }}>🏁 Koleksiyoncu</div>
        </div>

        <div style={{ width: '46px', height: '46px', borderRadius: '16px', background: '#FFEFD6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="fredoka" style={{ fontWeight: '700', fontSize: '13px', color: '#E8810E' }}>LV7</div>
        </div>
      </div>

      {showNotifs && (
        <div style={{
          position: 'absolute', top: '80px', left: '16px', width: '280px',
          background: '#fff', border: '2px solid var(--border-color)', borderRadius: '18px',
          padding: '12px', zIndex: 100, boxShadow: '0 12px 24px rgba(20,32,58,.1)',
          maxHeight: '300px', overflowY: 'auto'
        }}>
          <h3 className="fredoka" style={{ fontSize: '1rem', marginBottom: '12px', color: '#16233F', borderBottom: '2px solid #EEF2F9', paddingBottom: '8px' }}>Bildirimler</h3>
          {notifications.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '16px 0', fontWeight: '700' }}>Henüz bildirim yok.</p>
          ) : (
            notifications.map(n => (
              <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '2px solid #EEF2F9' }}>
                <div style={{ fontSize: '1.2rem' }}>❤️</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', fontWeight: '600' }}>
                  <strong style={{ color: '#16233F' }}>{n.sender_username}</strong> <span style={{ color: '#FF4D2E' }}>{n.car_name}</span> arabanı beğendi!
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* hero dashboard */}
      <div style={{ margin: '10px 18px 0', borderRadius: '24px', padding: '14px 16px', background: 'linear-gradient(120deg,#FF4D2E 0%,#FF7A2E 100%)', position: 'relative', overflow: 'hidden', boxShadow: '0 12px 24px rgba(255,77,46,.34)' }}>
        <div style={{ position: 'absolute', top: '18px', right: '30px', width: '46px', height: '4px', borderRadius: '3px', background: 'rgba(255,255,255,.55)', animation: 'vg-speed 1.6s linear infinite' }}></div>
        <div style={{ position: 'absolute', top: '34px', right: '18px', width: '30px', height: '4px', borderRadius: '3px', background: 'rgba(255,255,255,.4)', animation: 'vg-speed 1.6s linear .4s infinite' }}></div>
        <div style={{ position: 'absolute', bottom: '16px', right: '40px', width: '38px', height: '4px', borderRadius: '3px', background: 'rgba(255,255,255,.45)', animation: 'vg-speed 1.6s linear .8s infinite' }}></div>
        
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'rgba(255,255,255,.85)', letterSpacing: '.06em', textTransform: 'uppercase' }}>Sıradaki seviye</div>
            <div className="fredoka" style={{ fontWeight: '700', fontSize: '24px', color: '#fff', lineHeight: '1.05' }}>3 araba kaldı!</div>
          </div>
          <div className="fredoka" style={{ fontWeight: '700', fontSize: '13px', color: '#FF5A2E', background: '#fff', padding: '7px 12px', borderRadius: '999px', whiteSpace: 'nowrap', animation: 'vg-pulse 1.4s ease-in-out infinite', boxShadow: '0 4px 0 rgba(0,0,0,.12)' }}>+50 XP</div>
        </div>
        
        <div style={{ marginTop: '10px', height: '14px', borderRadius: '999px', background: 'rgba(255,255,255,.32)', overflow: 'hidden', position: 'relative', zIndex: 2 }}>
          <div style={{ width: '72%', height: '100%', borderRadius: '999px', background: '#FFE08A', boxShadow: '0 0 10px #FFE08A' }}></div>
        </div>
      </div>

      {/* search */}
      <div style={{ margin: '14px 18px 0', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ flex: 1, height: '54px', borderRadius: '18px', background: '#fff', border: '2px solid #E6EDF7', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 16px', boxShadow: '0 4px 12px rgba(20,32,58,.05)' }}>
          <div style={{ width: '18px', height: '18px', border: '3px solid #B4C0D6', borderRadius: '50%', position: 'relative' }}>
            <div style={{ position: 'absolute', width: '3px', height: '8px', background: '#B4C0D6', borderRadius: '2px', right: '-4px', bottom: '-4px', transform: 'rotate(-45deg)' }}></div>
          </div>
          <input 
            type="text"
            placeholder="Araba ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontWeight: '800', color: '#16233F', fontSize: '15px', width: '100%' }}
          />
        </div>
      </div>

      {/* chips */}
      <div style={{ marginTop: '14px', padding: '0 18px', display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none' }}>
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

    </header>
  );
};

export default Header;
