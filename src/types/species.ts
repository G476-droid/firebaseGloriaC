export interface Species {
  id: string;
  commonName: string;
  scientificName: string;
  habitat: string;
  imageUrl: string;
  imagePath?: string;
  createdAt: number;
}

// Datos del formulario
export type SpeciesFormValues = Omit<
  Species,
  "id" | "createdAt"
>;