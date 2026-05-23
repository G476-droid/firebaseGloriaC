import { useEffect, useState } from "react";
import { Species } from "../types/species";
import { subscribeToSpecies } from "../services/speciesServices";

export const useSpecies = () => {
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSpecies = () => {
    setLoading(true);

    const unsubscribe = subscribeToSpecies(
      (data) => {
        setSpecies(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = loadSpecies();

    return unsubscribe;
  }, []);

  return {
    species,
    loading,
    error,
    reloadSpecies: loadSpecies,
  };
};