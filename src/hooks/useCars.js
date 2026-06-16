import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useCars = (session) => {
  const [cars, setCars] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (session) {
      fetchCars();
    }
  }, [session]);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setCars(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const uploadImage = async (base64Image) => {
    if (!base64Image || base64Image.startsWith('http')) return base64Image;

    try {
      const fetchResponse = await fetch(base64Image);
      const blob = await fetchResponse.blob();
      
      const fileExt = blob.type.split('/')[1] || 'jpeg';
      const fileName = `${session.user.id}_${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('car-images')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image, falling back to base64:', error);
      return base64Image;
    }
  };

  const addCar = async (carData) => {
    if (!session) return;
    try {
      const imageUrl = await uploadImage(carData.image);

      const { data, error } = await supabase
        .from('cars')
        .insert([{
          name: carData.name,
          series: carData.series,
          year: carData.year,
          color: carData.color,
          rarity: carData.rarity,
          price: carData.price,
          notes: carData.notes,
          image: imageUrl,
          user_id: session.user.id
        }])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setCars(prev => [data[0], ...prev]);
        return data[0];
      }
    } catch (error) {
      console.error('Error adding car:', error);
      alert('Araba eklenirken bir hata oluştu.');
    }
  };

  const updateCar = async (id, carData) => {
    if (!session) return;
    try {
      const imageUrl = await uploadImage(carData.image);

      const { data, error } = await supabase
        .from('cars')
        .update({
          name: carData.name,
          series: carData.series,
          year: carData.year,
          color: carData.color,
          rarity: carData.rarity,
          price: carData.price,
          notes: carData.notes,
          image: imageUrl
        })
        .eq('id', id)
        .eq('user_id', session.user.id) // Security check
        .select();
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("Veritabanı güncellemeyi reddetti. RLS Update yetkisi eksik olabilir.");
      }

      setCars(prev => prev.map(car => car.id === id ? data[0] : car));
      return data[0];
    } catch (error) {
      console.error('Error updating car:', error);
      alert('Araba güncellenirken bir hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
    }
  };

  const removeCar = async (id) => {
    if (!session) return;
    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      setCars(prev => prev.filter(car => car.id !== id));
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Silme işlemi başarısız oldu.');
    }
  };

  const shareCar = async (id) => {
    if (!session) return;
    try {
      const { error } = await supabase
        .from('cars')
        .update({ is_shared: true })
        .eq('id', id)
        .eq('user_id', session.user.id);
        
      if (error) throw error;
      
      // Update local state to reflect it's shared
      setCars(prev => prev.map(car => car.id === id ? { ...car, is_shared: true } : car));
      return true;
    } catch (error) {
      console.error('Error sharing car:', error);
      return false;
    }
  };

  return { cars, isLoaded, addCar, updateCar, removeCar, shareCar };
};
