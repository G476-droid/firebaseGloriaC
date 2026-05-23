import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";

import { ScreenProps } from "../navigation/typeNavigation";
import { detailStyles } from "../theme/appStyles";
import { Species } from "../types/species";

import { getSpeciesById, deleteSpecies } from "../services/speciesServices";

import { deleteSpeciesImage } from "../services/storageServices";

type Props = ScreenProps<"Detail">;

export const DetailScreen = ({ route, navigation }: Props) => {
  const { speciesId } = route.params;

  const [species, setSpecies] = useState<Species | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadSpecies();
  }, [speciesId]);

  const loadSpecies = async (): Promise<void> => {
    try {
      setLoading(true);

      const data = await getSpeciesById(speciesId);

      setSpecies(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ELIMINAR
  const handleDelete = () => {
    Alert.alert(
      "Eliminar especie",
      "¿Seguro que desea eliminar esta especie?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              // eliminar imagen storage
              if (species?.imagePath) {
                await deleteSpeciesImage(species.imagePath);
              }

              // eliminar registro
              await deleteSpecies(speciesId);

              Alert.alert(
                "Eliminado",
                "La especie fue eliminada correctamente.",
              );

              navigation.navigate("Home");
            } catch (error) {
              console.log(error);

              Alert.alert("Error", "No se pudo eliminar la especie.");
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={detailStyles.container}>
        <ActivityIndicator size="large" color="#1a5c38" />
      </View>
    );
  }

  if (!species) {
    return (
      <View style={detailStyles.container}>
        <Text>No se encontró la especie.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={detailStyles.container}
      contentContainerStyle={detailStyles.content}
    >
      {species.imageUrl ? (
        <Image source={{ uri: species.imageUrl }} style={detailStyles.image} />
      ) : (
        <View style={[detailStyles.image, detailStyles.imagePlaceholder]}>
          <Text style={{ fontSize: 64 }}>🌿</Text>
        </View>
      )}

      <View style={detailStyles.dataCard}>
        <Text style={detailStyles.commonName}>{species.commonName}</Text>

        <Text style={detailStyles.scientificName}>
          {species.scientificName}
        </Text>

        <View style={detailStyles.divider} />

        <View style={detailStyles.field}>
          <Text style={detailStyles.fieldLabel}>Hábitat</Text>

          <Text style={detailStyles.fieldValue}>{species.habitat}</Text>
        </View>
      </View>

      <View style={detailStyles.actions}>
        <TouchableOpacity
          style={detailStyles.editBtn}
          onPress={() =>
            navigation.navigate("Form", {
              speciesId,
            })
          }
        >
          <Text style={detailStyles.editBtnText}>✏️ Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={detailStyles.deleteBtn} onPress={handleDelete}>
          <Text style={detailStyles.deleteBtnText}>🗑️ Eliminar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
