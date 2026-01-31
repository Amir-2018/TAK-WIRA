import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { usePlayers } from '../context/PlayerContext';
import { PlayerFormData } from '../types/player';

const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

export default function PlayerFormScreen({ route, navigation }: any) {
  const { playerId } = route.params || {};
  const { players, addPlayer, updatePlayer, getPlayer } = usePlayers();
  
  const [formData, setFormData] = useState<PlayerFormData>({
    name: '',
    position: 'Midfielder',
    number: 0,
    age: 0,
    nationality: '',
    height: '',
    weight: '',
    image: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PlayerFormData, string>>>({});

  useEffect(() => {
    if (playerId) {
      const player = getPlayer(playerId);
      if (player) {
        setFormData({
          name: player.name,
          position: player.position,
          number: player.number,
          age: player.age,
          nationality: player.nationality,
          height: player.height,
          weight: player.weight,
          image: player.image || '',
        });
      }
    }
  }, [playerId, getPlayer]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof PlayerFormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Player name is required';
    }
    if (formData.number <= 0) {
      newErrors.number = 'Valid jersey number is required';
    }
    if (formData.age <= 0) {
      newErrors.age = 'Valid age is required';
    }
    if (!formData.nationality.trim()) {
      newErrors.nationality = 'Nationality is required';
    }
    if (!formData.height.trim()) {
      newErrors.height = 'Height is required';
    }
    if (!formData.weight.trim()) {
      newErrors.weight = 'Weight is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      if (playerId) {
        updatePlayer(playerId, formData);
      } else {
        addPlayer(formData);
      }
      navigation.goBack();
    }
  };

  const updateField = (field: keyof PlayerFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {playerId ? 'Edit Player' : 'Add New Player'}
        </Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.formContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Enter player's full name"
                placeholderTextColor="#ADB5BD"
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nationality *</Text>
              <TextInput
                style={[styles.input, errors.nationality && styles.inputError]}
                placeholder="e.g., Brazil, France, Nigeria"
                placeholderTextColor="#ADB5BD"
                value={formData.nationality}
                onChangeText={(value) => updateField('nationality', value)}
              />
              {errors.nationality && (
                <Text style={styles.errorText}>{errors.nationality}</Text>
              )}
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Age *</Text>
                <TextInput
                  style={[styles.input, errors.age && styles.inputError]}
                  placeholder="Years"
                  placeholderTextColor="#ADB5BD"
                  keyboardType="number-pad"
                  value={formData.age ? formData.age.toString() : ''}
                  onChangeText={(value) => updateField('age', parseInt(value) || 0)}
                />
                {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Jersey Number *</Text>
                <TextInput
                  style={[styles.input, errors.number && styles.inputError]}
                  placeholder="#"
                  placeholderTextColor="#ADB5BD"
                  keyboardType="number-pad"
                  value={formData.number ? formData.number.toString() : ''}
                  onChangeText={(value) => updateField('number', parseInt(value) || 0)}
                />
                {errors.number && (
                  <Text style={styles.errorText}>{errors.number}</Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Physical Attributes</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Height *</Text>
                <TextInput
                  style={[styles.input, errors.height && styles.inputError]}
                  placeholder="e.g., 180cm"
                  placeholderTextColor="#ADB5BD"
                  value={formData.height}
                  onChangeText={(value) => updateField('height', value)}
                />
                {errors.height && (
                  <Text style={styles.errorText}>{errors.height}</Text>
                )}
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Weight *</Text>
                <TextInput
                  style={[styles.input, errors.weight && styles.inputError]}
                  placeholder="e.g., 75kg"
                  placeholderTextColor="#ADB5BD"
                  value={formData.weight}
                  onChangeText={(value) => updateField('weight', value)}
                />
                {errors.weight && (
                  <Text style={styles.errorText}>{errors.weight}</Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Position</Text>
            <View style={styles.positionContainer}>
              {positions.map((position) => (
                <TouchableOpacity
                  key={position}
                  style={[
                    styles.positionBtn,
                    formData.position === position && styles.positionBtnActive,
                  ]}
                  onPress={() => updateField('position', position)}
                >
                  <Text
                    style={[
                      styles.positionText,
                      formData.position === position && styles.positionTextActive,
                    ]}
                  >
                    {position}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Image (Optional)</Text>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Enter image URL"
                placeholderTextColor="#ADB5BD"
                value={formData.image}
                onChangeText={(value) => updateField('image', value)}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {playerId ? 'Update Player' : 'Add Player'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  cancelBtn: {
    padding: 8,
  },
  cancelText: {
    color: '#6C757D',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  saveBtn: {
    padding: 8,
  },
  saveText: {
    color: '#00FF41',
    fontSize: 16,
    fontWeight: '700',
  },
  keyboardView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#212529',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  inputError: {
    borderColor: '#DC3545',
  },
  errorText: {
    color: '#DC3545',
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  positionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  positionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  positionBtnActive: {
    backgroundColor: '#212529',
    borderColor: '#212529',
  },
  positionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C757D',
  },
  positionTextActive: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#00FF41',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '800',
  },
});

