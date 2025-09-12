import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Brand, BubbleThing, BrandDeal } from '@/services/bubbleAPI';
import { useCreateBranddeal } from '@/hooks/useCreateBranddeal';
import { useUpdateBranddeal } from '@/hooks/useUpdateBranddeal';
import { useBrands } from '@/hooks/useBrands';
import { useBrandContactsList } from '@/hooks/useBrandContactsList';
import BrandSearchSelector from './BrandSearchSelector';
import ContactSelector from './ContactSelector';

interface CreateCampaignSheetProps {
  visible: boolean;
  onClose: () => void;
  editItem?: (BubbleThing & BrandDeal) | null; // If provided, we're in edit mode
}

const kabanStatuses = ['Roster', 'Waiting', 'In Progress', 'Invoiced', 'Complete', 'Canceled'];

// Status color mapping (matches campaign card colors)
const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'roster':
      return {
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        borderColor: 'rgba(107, 114, 128, 0.3)',
        textColor: '#374151'
      };
    case 'waiting':
      return {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        textColor: '#92400e'
      };
    case 'in progress':
      return {
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        textColor: '#3730a3'
      };
    case 'invoiced':
      return {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        textColor: '#92400e'
      };
    case 'complete':
      return {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 0.3)',
        textColor: '#166534'
      };
    case 'canceled':
      return {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
        textColor: '#991b1b'
      };
    default:
      return {
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        borderColor: 'rgba(107, 114, 128, 0.3)',
        textColor: '#374151'
      };
  }
};

export default function CreateCampaignSheet({ visible, onClose, editItem }: CreateCampaignSheetProps) {
  const [formData, setFormData] = useState({
    title: '',
    deliverables: '',
    kabanStatus: 'roster',
    selectedBrand: null as (BubbleThing & Brand) | null,
    isAgencyMode: false,
    selectedAgency: null as (BubbleThing & Brand) | null,
    selectedContact: null as string | null,
  });

  const createMutation = useCreateBranddeal();
  const updateMutation = useUpdateBranddeal();
  const { data: brands } = useBrands();
  const { data: contacts } = useBrandContactsList();
  
  const isEditMode = !!editItem;

  // Populate form data when editing
  useEffect(() => {
    if (isEditMode && editItem && visible && brands && contacts) {
      // Find the contact associated with this campaign
      const campaignContact = editItem.brandcontact || null;
      const contactData = campaignContact ? contacts.find(contact => contact._id === campaignContact) : null;
      
      // Debug contact selection
      console.log('Contact Debug:', {
        campaignContact,
        contactFound: !!contactData,
        contactData,
        allContactsCount: contacts?.length,
        contactsLoaded: !!contacts
      });
      
      // Determine mode based on contact's brand vs campaign's brand
      let isAgencyMode = false;
      let selectedBrand = null;
      let selectedAgency = null;
      
      // Get the campaign's brand
      selectedBrand = brands.find(brand => brand._id === editItem.brand) || null;
      
      if (contactData && selectedBrand) {
        // Compare contact's brand with campaign's brand
        if (contactData.brand === editItem.brand) {
          // DIRECT: Contact's brand matches campaign's brand
          isAgencyMode = false;
          selectedAgency = null;
        } else {
          // AGENCY: Contact's brand is different (it's the agency)
          isAgencyMode = true;
          selectedAgency = brands.find(brand => brand._id === contactData.brand) || null;
        }
      } else {
        // Fallback to original logic if no contact data
        if (editItem.agency) {
          isAgencyMode = true;
          selectedAgency = brands.find(brand => brand._id === editItem.agency) || null;
        } else {
          isAgencyMode = false;
          selectedAgency = null;
        }
      }
      
      console.log('Edit mode resolution:', {
        campaignId: editItem._id,
        brandId: editItem.brand,
        agencyId: editItem.agency,
        contactId: editItem.brandcontact,
        contactBrand: contactData?.brand,
        contactName: contactData?.name,
        selectedBrand: selectedBrand?.brandname,
        selectedAgency: selectedAgency?.brandname,
        isAgencyMode,
        modeReason: contactData ? 
          (contactData.brand === editItem.brand ? 'Direct (contact brand matches campaign)' : 'Agency (contact brand differs)') : 
          'Fallback to campaign agency field',
        campaignContact
      });
      
      setFormData({
        title: editItem.title || '',
        deliverables: editItem.deliverables || '',
        kabanStatus: editItem["kaban-status"] || 'roster',
        selectedBrand: selectedBrand || null,
        isAgencyMode,
        selectedAgency,
        selectedContact: campaignContact,
      });
    } else if (!isEditMode && visible) {
      // Reset form for create mode
      setFormData({
        title: '',
        deliverables: '',
        kabanStatus: 'roster',
        selectedBrand: null,
        isAgencyMode: false,
        selectedAgency: null,
        selectedContact: null,
      });
    }
  }, [isEditMode, editItem, visible, brands, contacts]);

  const handleBrandSelect = (brand: (BubbleThing & Brand) | null) => {
    setFormData(prev => ({
      ...prev,
      selectedBrand: brand,
      selectedAgency: null,
      selectedContact: null,
      isAgencyMode: false,
    }));
  };

  const handleAgencyModeToggle = (isAgency: boolean) => {
    setFormData(prev => ({
      ...prev,
      isAgencyMode: isAgency,
      selectedAgency: null,
      selectedContact: null,
    }));
  };

  const handleAgencySelect = (agency: (BubbleThing & Brand) | null) => {
    setFormData(prev => ({
      ...prev,
      selectedAgency: agency,
      selectedContact: null,
    }));
  };

  const handleContactChange = (contactId: string | null) => {
    setFormData(prev => ({
      ...prev,
      selectedContact: contactId,
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a campaign title');
      return;
    }

    if (!formData.selectedBrand) {
      Alert.alert('Error', 'Please select a brand');
      return;
    }


    if (!formData.selectedContact) {
      Alert.alert('Error', 'Please select a contact');
      return;
    }

    try {
      if (isEditMode && editItem) {
        // Update existing campaign
        await updateMutation.mutateAsync({
          branddealId: editItem._id,
          title: formData.title,
          deliverables: formData.deliverables,
          brand: formData.selectedBrand._id,
          brandContact: formData.selectedContact,
          kabanStatus: formData.kabanStatus,
        });
      } else {
        // Create new campaign
        await createMutation.mutateAsync({
          title: formData.title,
          deliverables: formData.deliverables,
          brand: formData.selectedBrand._id,
          brandContact: formData.selectedContact,
          kabanStatus: formData.kabanStatus,
        });
      }

      // Reset form and close
      setFormData({
        title: '',
        deliverables: '',
        kabanStatus: 'roster',
        selectedBrand: null,
        isAgencyMode: false,
        selectedAgency: null,
        selectedContact: null,
      });
      onClose();
    } catch {
      Alert.alert('Error', `Failed to ${isEditMode ? 'update' : 'create'} campaign. Please try again.`);
    }
  };

  const isFormValid = formData.title.trim() && 
                     formData.selectedBrand && 
                     formData.selectedContact;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <ThemedView style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol size={20} name="xmark" color="#666" />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.title}>{isEditMode ? 'Edit Campaign' : 'New Campaign'}</ThemedText>
          <ThemedView style={styles.headerSpacer} />
        </ThemedView>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Title Input */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.label}>Title</ThemedText>
            <TextInput
              style={styles.textInput}
              placeholder="Campaign title"
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
            />
          </ThemedView>

          {/* Brand Selection */}
          <BrandSearchSelector
            selectedBrand={formData.selectedBrand}
            onBrandSelect={handleBrandSelect}
            searchMode="brands"
          />

          {/* Direct vs Agency Toggle */}
          {formData.selectedBrand && (
            <ThemedView style={styles.section}>
              <ThemedText style={styles.label}>Campaign Type</ThemedText>
              <ThemedView style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    !formData.isAgencyMode && styles.toggleButtonActive
                  ]}
                  onPress={() => handleAgencyModeToggle(false)}
                >
                  <ThemedText style={[
                    styles.toggleText,
                    !formData.isAgencyMode && styles.toggleTextActive
                  ]}>
                    Direct
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    formData.isAgencyMode && styles.toggleButtonActive
                  ]}
                  onPress={() => handleAgencyModeToggle(true)}
                >
                  <ThemedText style={[
                    styles.toggleText,
                    formData.isAgencyMode && styles.toggleTextActive
                  ]}>
                    Through Agency
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          )}

          {/* Agency Selection */}
          {formData.isAgencyMode && (
            <ThemedView style={styles.section}>
              <ThemedText style={styles.label}>Agency</ThemedText>
              <BrandSearchSelector
                selectedBrand={formData.selectedAgency}
                onBrandSelect={handleAgencySelect}
                placeholder="Search agencies..."
                searchMode="agencies"
              />
            </ThemedView>
          )}

          {/* Contact Selection */}
          <ContactSelector
            selectedBrand={formData.selectedBrand}
            selectedAgency={formData.selectedAgency}
            isAgencyMode={formData.isAgencyMode}
            selectedContact={formData.selectedContact}
            onContactChange={handleContactChange}
          />

          {/* Deliverables Input */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.label}>Deliverables</ThemedText>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Describe the campaign deliverables..."
              value={formData.deliverables}
              onChangeText={(text) => setFormData(prev => ({ ...prev, deliverables: text }))}
              multiline
              numberOfLines={3}
            />
          </ThemedView>

          {/* Status Selector */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.label}>Status</ThemedText>
            <ThemedView style={styles.statusGrid}>
              {kabanStatuses.map((status) => {
                const isSelected = formData.kabanStatus === status;
                const statusStyle = getStatusStyle(status);
                return (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      {
                        backgroundColor: isSelected ? statusStyle.backgroundColor : '#f8f9fa',
                        borderColor: isSelected ? statusStyle.borderColor : '#e5e7eb',
                      }
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, kabanStatus: status }))}
                  >
                    <ThemedText
                      style={[
                        styles.statusText,
                        { color: isSelected ? statusStyle.textColor : '#666' }
                      ]}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </ThemedView>
          </ThemedView>
        </ScrollView>

        {/* Submit Button */}
        <ThemedView style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!isFormValid || createMutation.isPending || updateMutation.isPending) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid || createMutation.isPending || updateMutation.isPending}
          >
            <ThemedText style={styles.submitButtonText}>
              {(createMutation.isPending || updateMutation.isPending) 
                ? (isEditMode ? 'Updating...' : 'Creating...') 
                : (isEditMode ? 'Update Campaign' : 'Create Campaign')
              }
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 28,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    minWidth: '30%',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(120, 120, 128, 0.12)',
    borderRadius: 9,
    padding: 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 7,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.13,
    shadowRadius: 1,
    elevation: 2,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(60, 60, 67, 0.6)',
  },
  toggleTextActive: {
    color: '#6366f1',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  submitButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});