import { useState, useEffect } from 'react';

const STORAGE_KEY = 'hw_cars_collection';

export function useCars() {
  const [cars, setCars] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load cars from local storage on mount
    const savedCars = localStorage.getItem(STORAGE_KEY);
    if (savedCars) {
      try {
        setCars(JSON.parse(savedCars));
      } catch (e) {
        console.error('Error parsing cars from local storage', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Save cars to local storage whenever they change
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
    }
  }, [cars, isLoaded]);

  const addCar = (carData) => {
    const newCar = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      ...carData
    };
    setCars(prev => [newCar, ...prev]);
    return newCar;
  };

  const removeCar = (id) => {
    setCars(prev => prev.filter(car => car.id !== id));
  };

  const updateCar = (id, updatedData) => {
    setCars(prev => prev.map(car => car.id === id ? { ...car, ...updatedData } : car));
  };

  return {
    cars,
    isLoaded,
    addCar,
    removeCar,
    updateCar
  };
}
