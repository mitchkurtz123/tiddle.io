import React, { useState } from 'react';
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface AddCreatorSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    user: string;
    platform: string;
    rate: number;
    price: number;
  }) => Promise<void>;
  isSubmitting?: boolean;
}

const platforms = ['TikTok', 'Instagram', 'YouTube'];

export default function AddCreatorSheet({ visible, onClose, onSubmit, isSubmitting = false }: AddCreatorSheetProps) {
  const [user, setUser] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('TikTok');
  const [rate, setRate] = useState('');
  const [price, setPrice] = useState('');

  // Format currency input
  const formatCurrency = (value: string) => {
    // Remove all non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].slice(0, 2);
    }
    
    return numericValue;
  };

  const handleRateChange = (text: string) => {
    const formatted = formatCurrency(text);
    setRate(formatted);
  };

  const handlePriceChange = (text: string) => {
    const formatted = formatCurrency(text);
    setPrice(formatted);
  };

  const handleSubmit = async () => {
    if (!user.trim() || !rate || !price) {
      return; // Basic validation
    }

    try {
      await onSubmit({
        user: user.trim(),
        platform: selectedPlatform,
        rate: parseFloat(rate),
        price: parseFloat(price),
      });
      
      // Reset form
      setUser('');
      setRate('');
      setPrice('');
      setSelectedPlatform('TikTok');
      onClose();
    } catch (error) {
      console.error('Failed to add creator:', error);
      // Don't close the sheet on error so user can retry
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setUser('');
    setRate('');
    setPrice('');
    setSelectedPlatform('TikTok');
    onClose();
  };

  const isFormValid = user.trim() && rate && price && !isNaN(parseFloat(rate)) && !isNaN(parseFloat(price));

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />
        
        <ThemedView style={styles.sheet}>
          {/* Header */}
          <ThemedView style={styles.header}>
            <ThemedText type="defaultSemiBold" style={styles.title}>
              Add Creator
            </ThemedText>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <IconSymbol size={24} name="xmark" color="#666" />
            </TouchableOpacity>
          </ThemedView>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* User Input */}
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>User</ThemedText>
              <TextInput
                style={styles.textInput}
                value={user}
                onChangeText={setUser}
                placeholder="Enter username or user ID"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
            </ThemedView>

            {/* Platform Selection */}
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>Platform</ThemedText>
              <ThemedView style={styles.platformGrid}>
                {platforms.map((platform) => (
                  <TouchableOpacity
                    key={platform}
                    style={[
                      styles.platformButton,
                      selectedPlatform === platform && styles.platformButtonSelected,
                    ]}
                    onPress={() => setSelectedPlatform(platform)}
                  >
                    <ThemedText
                      style={[
                        styles.platformText,
                        selectedPlatform === platform && styles.platformTextSelected,
                      ]}
                    >
                      {platform}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ThemedView>
            </ThemedView>

            {/* Rate and Price */}
            <ThemedView style={styles.row}>
              <ThemedView style={styles.halfInput}>
                <ThemedText style={styles.label}>Rate (Creator gets)</ThemedText>
                <ThemedView style={styles.currencyInputContainer}>
                  <ThemedText style={styles.currencySymbol}>$</ThemedText>
                  <TextInput
                    style={styles.currencyInput}
                    value={rate}
                    onChangeText={handleRateChange}
                    placeholder="0.00"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                  />
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.halfInput}>
                <ThemedText style={styles.label}>Price (You get)</ThemedText>
                <ThemedView style={styles.currencyInputContainer}>
                  <ThemedText style={styles.currencySymbol}>$</ThemedText>
                  <TextInput
                    style={styles.currencyInput}
                    value={price}
                    onChangeText={handlePriceChange}
                    placeholder="0.00"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                  />
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </ScrollView>

          {/* Footer */}
          <ThemedView style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
            >
              <ThemedText style={styles.cancelText}>Cancel</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!isFormValid || isSubmitting) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid || isSubmitting}
            >
              <ThemedText style={styles.submitText}>
                {isSubmitting ? 'Adding...' : 'Add Creator'}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    minHeight: 500,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#000',
    minHeight: 44,
  },
  platformGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  platformButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'white',
    minHeight: 44,
  },
  platformButtonSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  platformText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  platformTextSelected: {
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: 'white',
    minHeight: 44,
  },
  currencySymbol: {
    paddingLeft: 12,
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  currencyInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'transparent',
    color: '#000',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#6366f1',
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});