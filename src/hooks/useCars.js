import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useCars() {
  const [cars, setCars] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const addCar = async (carData) => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .insert([{
          name: carData.name,
          series: carData.series,
          year: carData.year,
          color: carData.color,
          rarity: carData.rarity,
          image: carData.image // storing base64 as text
        }])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setCars(prev => [data[0], ...prev]);
        return data[0];
      }
    } catch (error) {
      console.error('Error adding car:', error);
      alert('Araba eklenirken bir hata oluştu. Veritabanı tablosunun (cars) oluşturulduğundan emin olun.');
    }
  };

  const removeCar = async (id) => {
    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCars(prev => prev.filter(car => car.id !== id));
    } catch (error) {
      console.error('Error removing car:', error);
      alert('Araba silinirken hata oluştu.');
    }
  };

  return {
    cars,
    isLoaded,
    addCar,
    removeCar
  };
}
