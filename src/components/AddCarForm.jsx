import React, { useState, useRef } from 'react';
import { removeBackground } from '@imgly/background-removal';

const AddCarForm = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    series: '',
    year: '',
    color: '#ff5b00',
    rarity: 'Common',
    price: '',
    notes: '',
    image: null
  });
  
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!formData.image || isRemovingBg) return;
    
    try {
      setIsRemovingBg(true);
      const blob = await removeBackground(formData.image);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
        setIsRemovingBg(false);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error removing background:", error);
      alert("Arka plan silinirken bir hata oluştu.");
      setIsRemovingBg(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return alert('Lütfen araba adını girin!');
    onAdd(formData);
    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in" style={{ zIndex: 200 }}>
      <div className="modal-content" style={{ animation: 'fadeIn 0.3s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Yeni Araba Ekle</h2>
          <button className="icon-btn" style={{ background: 'transparent', border: 'none' }} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Image Upload Area */}
          <div 
            style={{
              height: '160px',
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '10px',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative'
            }}
            onClick={() => !isRemovingBg && fileInputRef.current.click()}
          >
            {formData.image ? (
              <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <>
                <span style={{ fontSize: '2rem', marginBottom: '8px' }}>📸</span>
                <span style={{ color: 'var(--text-muted)' }}>Fotoğraf Ekle</span>
              </>
            )}
            {isRemovingBg && (
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                backdropFilter: 'blur(4px)'
              }}>
                <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>⏳</div>
                <span style={{ marginTop: '8px', fontSize: '0.9rem' }}>Yapay Zeka Çalışıyor...</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleImageChange}
              style={{ display: 'none' }}
              disabled={isRemovingBg}
            />
          </div>

          {formData.image && (
            <button 
              type="button" 
              onClick={handleRemoveBackground}
              disabled={isRemovingBg}
              className="btn-primary"
              style={{ 
                width: '100%', 
                marginBottom: '20px', 
                background: 'linear-gradient(135deg, #8A2387, #E94057, #F27121)',
                boxShadow: '0 4px 14px rgba(233, 64, 87, 0.4)',
                border: 'none',
                opacity: isRemovingBg ? 0.7 : 1
              }}
            >
              🪄 Arka Planı Sil (Yapay Zeka)
            </button>
          )}

          <div className="input-group">
            <label className="input-label">Araba Adı *</label>
            <input 
              type="text" 
              className="input-field" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Örn: '69 Dodge Charger"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Seri</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.series}
                onChange={(e) => setFormData({...formData, series: e.target.value})}
                placeholder="Örn: HW Flames"
              />
            </div>
            <div className="input-group" style={{ width: '100px' }}>
              <label className="input-label">Yıl</label>
              <input 
                type="number" 
                className="input-field" 
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
                placeholder="2023"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Nadirlik</label>
              <select 
                className="input-field" 
                value={formData.rarity}
                onChange={(e) => setFormData({...formData, rarity: e.target.value})}
                style={{ appearance: 'none', backgroundColor: 'rgba(0,0,0,0.2)' }}
              >
                <option value="Common">Normal (Common)</option>
                <option value="Treasure Hunt">Treasure Hunt</option>
                <option value="Super Treasure Hunt">Super Treasure Hunt (STH)</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            <div className="input-group" style={{ width: '120px' }}>
              <label className="input-label">Değeri (₺)</label>
              <input 
                type="number" 
                className="input-field" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="Örn: 250"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Notlar</label>
            <textarea 
              className="input-field" 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Araba hakkında özel notlar, nereden alındığı vs."
              rows="2"
              style={{ resize: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <div className="input-group" style={{ width: '60px', marginBottom: 0 }}>
              <input 
                type="color" 
                className="input-field" 
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                style={{ padding: '2px', height: '48px', cursor: 'pointer' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              Koleksiyona Ekle
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AddCarForm;
