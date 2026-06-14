// screens/CreatePropertyScreen.tsx
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from "react-native";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";
import CButton from "../components/CButton";
import CInput from "../components/CInput";
import propiedadService from "../services/propiedadService";

export default function CreatePropertyScreen({ navigation }: any) {
    const { theme } = useTheme();
    const colors = getThemeColors(theme);
    const styles = getStyles(colors);

    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [form, setForm] = useState({
        titulo: '',
        descripcion: '',
        precio: '',
        direccion: '',
        habitaciones: '',
        banos: '',
        areaConstruida: '',
        garajes: '',
        idOperacion: 1 // 1=Venta, 2=Alquiler
    });

    const pickImage = async () => {
        // Solicitar permisos
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permiso denegado", "Necesitamos acceso a tu galería para subir imágenes");
            return;
        }

        // Abrir galería
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
            base64: true,
        });

        if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            setImage(asset.uri);
            // Guardar la imagen en base64 para enviar al backend
            if (asset.base64) {
                setImageBase64(`data:image/jpeg;base64,${asset.base64}`);
            }
        }
    };

    const removeImage = () => {
        setImage(null);
        setImageBase64(null);
    };

    const handleSubmit = async () => {
        // Validaciones
        if (!form.titulo.trim()) {
            Alert.alert("Error", "El título es obligatorio");
            return;
        }
        if (!form.precio || parseFloat(form.precio) <= 0) {
            Alert.alert("Error", "El precio debe ser mayor a 0");
            return;
        }
        if (!form.direccion.trim()) {
            Alert.alert("Error", "La dirección es obligatoria");
            return;
        }

        setLoading(true);
        try {
            const data = {
                titulo: form.titulo,
                descripcion: form.descripcion,
                precio: parseFloat(form.precio),
                direccion: form.direccion,
                habitaciones: parseInt(form.habitaciones) || 0,
                banos: parseInt(form.banos) || 0,
                areaConstruida: parseFloat(form.areaConstruida) || 0,
                garajes: parseInt(form.garajes) || 0,
                idOperacion: form.idOperacion,
                urlImagen: imageBase64 || null
            };

            const result = await propiedadService.crearPropiedad(data);
            Alert.alert(
                "¡Éxito!", 
                "Tu propiedad ha sido publicada correctamente",
                [{ text: "OK", onPress: () => navigation.goBack() }]
            );
        } catch (error: any) {
            console.error('Error:', error);
            Alert.alert("Error", error.message || "No se pudo publicar la propiedad");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.title}>Publicar Propiedad</Text>
                <Text style={styles.subtitle}>Completa los datos de tu propiedad</Text>
            </View>

            {/* Selector de operación */}
            <View style={styles.operationSelector}>
                <TouchableOpacity
                    style={[styles.operationButton, form.idOperacion === 1 && styles.operationActive]}
                    onPress={() => setForm({ ...form, idOperacion: 1 })}
                >
                    <Text style={[styles.operationText, form.idOperacion === 1 && styles.operationTextActive]}>
                        Venta
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.operationButton, form.idOperacion === 2 && styles.operationActive]}
                    onPress={() => setForm({ ...form, idOperacion: 2 })}
                >
                    <Text style={[styles.operationText, form.idOperacion === 2 && styles.operationTextActive]}>
                        Alquiler
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Selector de imagen */}
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: image }} style={styles.previewImage} />
                        <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                            <Ionicons name="close-circle" size={24} color={colors.error} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Ionicons name="camera-outline" size={40} color={colors.textSecondary} />
                        <Text style={styles.imagePlaceholderText}>Seleccionar imagen principal</Text>
                        <Text style={styles.imagePlaceholderSubtext}>Recomendado: 4:3, máximo 5MB</Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* Formulario */}
            <CInput
                type="text"
                value={form.titulo}
                placeholder="Título de la propiedad *"
                onChangeText={(text) => setForm({ ...form, titulo: text })}
            />

            <View style={styles.row}>
                <View style={styles.halfInput}>
                    <CInput
                        type="text"
                        value={form.precio}
                        placeholder="Precio (Lps) *"
                        onChangeText={(text) => setForm({ ...form, precio: text })}
                    />
                </View>
                <View style={styles.halfInput}>
                    <CInput
                        type="text"
                        value={form.areaConstruida}
                        placeholder="Área (m²)"
                        onChangeText={(text) => setForm({ ...form, areaConstruida: text })}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.halfInput}>
                    <CInput
                        type="text"
                        value={form.habitaciones}
                        placeholder="Habitaciones"
                        onChangeText={(text) => setForm({ ...form, habitaciones: text })}
                    />
                </View>
                <View style={styles.halfInput}>
                    <CInput
                        type="text"
                        value={form.banos}
                        placeholder="Baños"
                        onChangeText={(text) => setForm({ ...form, banos: text })}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.halfInput}>
                    <CInput
                        type="text"
                        value={form.garajes}
                        placeholder="Garajes"
                        onChangeText={(text) => setForm({ ...form, garajes: text })}
                    />
                </View>
            </View>

            <CInput
                type="text"
                value={form.direccion}
                placeholder="Dirección completa *"
                onChangeText={(text) => setForm({ ...form, direccion: text })}
            />

            <View style={styles.textAreaContainer}>
                <TextInput
                    style={[styles.textArea, { color: colors.text, backgroundColor: colors.backgroundAlt }]}
                    placeholder="Descripción de la propiedad"
                    placeholderTextColor={colors.textSecondary}
                    multiline
                    numberOfLines={6}
                    value={form.descripcion}
                    onChangeText={(text) => setForm({ ...form, descripcion: text })}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
            ) : (
                <CButton
                    title="Publicar Propiedad"
                    onPress={handleSubmit}
                    variant="primary"
                    size="large"
                />
            )}
        </ScrollView>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.text,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 4,
    },
    operationSelector: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 20,
    },
    operationButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        backgroundColor: colors.backgroundAlt,
        borderWidth: 1,
        borderColor: colors.border,
    },
    operationActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    operationText: {
        color: colors.textSecondary,
        fontWeight: "500",
    },
    operationTextActive: {
        color: colors.white,
    },
    imagePicker: {
        marginBottom: 20,
    },
    imageContainer: {
        position: "relative",
    },
    previewImage: {
        width: "100%",
        height: 200,
        borderRadius: 12,
        backgroundColor: colors.lightGray,
    },
    removeImageButton: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 4,
    },
    imagePlaceholder: {
        width: "100%",
        height: 200,
        borderRadius: 12,
        backgroundColor: colors.backgroundAlt,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: "dashed",
    },
    imagePlaceholderText: {
        marginTop: 8,
        color: colors.textSecondary,
        fontSize: 14,
    },
    imagePlaceholderSubtext: {
        marginTop: 4,
        color: colors.textSecondary,
        fontSize: 11,
    },
    row: {
        flexDirection: "row",
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
    textAreaContainer: {
        marginBottom: 20,
    },
    textArea: {
        borderRadius: 8,
        padding: 12,
        textAlignVertical: "top",
        fontSize: 16,
        minHeight: 120,
    },
    loader: {
        marginVertical: 20,
    },
});