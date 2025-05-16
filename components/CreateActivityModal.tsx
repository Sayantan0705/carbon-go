import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { ActivityType } from '@/types/activities';

interface CreateActivityModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (activity: ActivityType) => void;
}

const categoryOptions = [
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'food', label: 'Food', icon: '🍔' },
  { id: 'shopping', label: 'Shopping', icon: '🛒' },
];

export function CreateActivityModal({
  visible,
  onClose,
  onSave,
}: CreateActivityModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [impact, setImpact] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Activity name is required';
    }
    
    if (!category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!impact.trim()) {
      newErrors.impact = 'Carbon impact is required';
    } else if (isNaN(Number(impact)) || Number(impact) <= 0) {
      newErrors.impact = 'Please enter a valid positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const newActivity: ActivityType = {
        id: Date.now().toString(),
        name: name.trim(),
        category,
        impact: parseFloat(impact),
        date: new Date(),
        notes: notes.trim(),
      };
      
      onSave(newActivity);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setName('');
    setCategory('');
    setImpact('');
    setNotes('');
    setErrors({});
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              New Activity
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Activity Name</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    borderColor: errors.name ? colors.error : colors.border,
                    color: colors.text,
                    backgroundColor: colors.cardBackground,
                  },
                ]}
                placeholder="Enter activity name"
                placeholderTextColor={colors.tabIconDefault}
                value={name}
                onChangeText={setName}
              />
              {errors.name && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.name}
                </Text>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Category</Text>
              <View style={styles.categoryContainer}>
                {categoryOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.categoryButton,
                      {
                        backgroundColor:
                          category === option.id ? colors.tint : colors.cardBackground,
                        borderColor:
                          category === option.id ? colors.tint : colors.border,
                      },
                    ]}
                    onPress={() => setCategory(option.id)}
                  >
                    <Text style={styles.categoryIcon}>{option.icon}</Text>
                    <Text
                      style={[
                        styles.categoryLabel,
                        {
                          color:
                            category === option.id ? '#FFFFFF' : colors.text,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.category && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.category}
                </Text>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Carbon Impact (kg CO₂)</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    borderColor: errors.impact ? colors.error : colors.border,
                    color: colors.text,
                    backgroundColor: colors.cardBackground,
                  },
                ]}
                placeholder="0.0"
                placeholderTextColor={colors.tabIconDefault}
                value={impact}
                onChangeText={setImpact}
                keyboardType="numeric"
              />
              {errors.impact && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.impact}
                </Text>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Notes (Optional)</Text>
              <TextInput
                style={[
                  styles.textArea,
                  { 
                    borderColor: colors.border,
                    color: colors.text,
                    backgroundColor: colors.cardBackground,
                  },
                ]}
                placeholder="Add details about this activity..."
                placeholderTextColor={colors.tabIconDefault}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: colors.border }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.tint }]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save Activity</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 16,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  closeButton: {
    padding: 8,
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    minHeight: 100,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    margin: 4,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
  },
  cancelButton: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  saveButton: {
    flex: 2,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});