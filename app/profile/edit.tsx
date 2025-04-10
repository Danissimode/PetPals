import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';

interface FieldPrivacy {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  phone: boolean;
  bio: boolean;
}

export default function EditProfileScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
  });

  const [fieldPrivacy, setFieldPrivacy] = useState<FieldPrivacy>({
    firstName: true,
    lastName: true,
    email: false,
    phone: false,
    bio: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/[-()\s]/g, ''))) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Save profile changes
      router.back();
    }
  };

  const toggleFieldPrivacy = (field: keyof FieldPrivacy) => {
    setFieldPrivacy(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const renderField = (
    label: string,
    field: keyof typeof formData,
    placeholder: string,
    keyboardType: 'default' | 'email-address' | 'phone-pad' = 'default',
    multiline: boolean = false
  ) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.privacyToggle}>
          <TouchableOpacity
            style={styles.privacyButton}
            onPress={() => toggleFieldPrivacy(field as keyof FieldPrivacy)}
          >
            {fieldPrivacy[field as keyof FieldPrivacy] ? (
              <Eye size={20} color="#8E8E93" />
            ) : (
              <EyeOff size={20} color="#8E8E93" />
            )}
          </TouchableOpacity>
          <Text style={styles.privacyText}>
            {fieldPrivacy[field as keyof FieldPrivacy] ? 'Public' : 'Private'}
          </Text>
        </View>
      </View>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          errors[field] && styles.inputError
        ]}
        value={formData[field]}
        onChangeText={(text) => setFormData({ ...formData, [field]: text })}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Edit Profile',
          headerBackTitle: 'Back',
        }}
      />
      <View style={styles.container}>
        <ScrollView style={styles.content}>
          <View style={styles.form}>
            {renderField('First Name *', 'firstName', 'Enter your first name')}
            {renderField('Last Name *', 'lastName', 'Enter your last name')}
            {renderField('Email *', 'email', 'Enter your email', 'email-address')}
            {renderField('Phone *', 'phone', 'Enter your phone number', 'phone-pad')}
            {renderField('Bio', 'bio', 'Write something about yourself', 'default', true)}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, Object.keys(errors).length > 0 && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={Object.keys(errors).length > 0}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  privacyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privacyButton: {
    padding: 4,
  },
  privacyText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#8E8E93',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  saveButton: {
    backgroundColor: '#FF9F1C',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#FFD5A5',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
