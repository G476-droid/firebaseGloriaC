import { supabase } from "./supabaseConfig";
import { Species, SpeciesFormValues } from "../types/species";

const SPECIES_TABLE = "species";

//Convertir data de Supabase - array de Species
const dataToArray = (data: any[]): Species[] => {
  if (!data) return [];

  return data.map((item) => ({
    id: item.id,
    commonName: item.commonName ?? "",
    scientificName: item.scientificName ?? "",
    habitat: item.habitat ?? "",
    imageUrl: item.imageUrl ?? "",
    createdAt: item.created_at,
  }));
};

//Create - Supabase
export const addSpecies = async (
  values: SpeciesFormValues,
): Promise<string> => {
  const { data, error } = await supabase
    .from(SPECIES_TABLE)
    .insert([
      {
        ...values,
      },
    ])
    .select()
    .single();

  if (error) {
    console.log("Error addSpecies:", error);
    throw error;
  }

  return data.id;
};

//Read
export const subscribeToSpecies = (
  onData: (species: Species[]) => void,
  onError: (error: Error) => void,
): (() => void) => {
  let active = true;

  const loadSpecies = async () => {
  try {
    const { data, error } = await supabase
      .from(SPECIES_TABLE)
      .select("*");


    if (error) throw error;

    const species = dataToArray(data ?? []);

    if (active) {
      onData(species);
    }
  } catch (error) {
    onError(error as Error);
  }
};

  loadSpecies();

  //Realtime listener
  //const channel = supabase
   // .channel("species-channel")
  //  .on(
 //     "postgres_changes",
 //     {
 //       event: "*",
 //       schema: "public",
//        table: SPECIES_TABLE,
//      },
 //     () => {
 //       loadSpecies();
 //     },
 //   )
 //   .subscribe();

  return () => {
  active = false;
};
};

//Read con ID
export const getSpeciesById = async (
  id: string,
): Promise<Species | null> => {
  const { data, error } = await supabase
    .from(SPECIES_TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log("Error getSpeciesById:", error);
    return null;
  }

  return {
    id: data.id,
    commonName: data.commonName ?? "",
    scientificName: data.scientificName ?? "",
    habitat: data.habitat ?? "",
    imageUrl: data.imageUrl ?? "",
    createdAt: data.created_at,
  };
};

//Update
export const updateSpecies = async (
  id: string,
  data: Partial<SpeciesFormValues>,
): Promise<void> => {
  const { error } = await supabase
    .from(SPECIES_TABLE)
    .update(data)
    .eq("id", id);

  if (error) {
    console.log("Error updateSpecies:", error);
    throw error;
  }
};

//Delete
export const deleteSpecies = async (
  id: string,
): Promise<void> => {
  const { error } = await supabase
    .from(SPECIES_TABLE)
    .delete()
    .eq("id", id);

  if (error) {
    console.log("Error deleteSpecies:", error);
    throw error;
  }
};