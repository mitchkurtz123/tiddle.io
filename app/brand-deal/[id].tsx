import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useBranddeal } from '@/hooks/useBranddeal';
import { useInstances } from '@/hooks/useInstances';
import { useCreateInstance } from '@/hooks/useCreateInstance';
import { useUpdateInstance } from '@/hooks/useUpdateInstance';
import BrandDealHeader from '@/components/brand-deal/BrandDealHeader';
import InstanceList from '@/components/brand-deal/InstanceList';
import EmptyState from '@/components/common/EmptyState';
import AddCreatorSheet from '@/components/brand-deal/AddCreatorSheet';
import { BubbleThing, Instance0963 } from '@/services/bubbleAPI';

export default function BrandDealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [refreshing, setRefreshing] = useState(false);
  const [showAddCreatorSheet, setShowAddCreatorSheet] = useState(false);
  const [editingInstance, setEditingInstance] = useState<(BubbleThing & Instance0963) | null>(null);
  
  // Fetch brand deal data
  const { 
    data: brandDeal, 
    isLoading: brandDealLoading, 
    error: brandDealError, 
    refetch: refetchBrandDeal 
  } = useBranddeal(id);
  
  // Fetch instances data using user-list from brand deal
  const { 
    data: instancesData, 
    isLoading: instancesLoading, 
    error: instancesError, 
    refetch: refetchInstances 
  } = useInstances(brandDeal?.["user-list"]);

  // Create and update instance mutations
  const createInstanceMutation = useCreateInstance();
  const updateInstanceMutation = useUpdateInstance();

  // Debug logging
  console.log('Brand deal data:', brandDeal);
  console.log('User list:', brandDeal?.["user-list"]);
  console.log('Instances data:', instancesData);
  console.log('Instances loading:', instancesLoading);
  console.log('Instances error:', instancesError);

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchBrandDeal(),
        refetchInstances()
      ]);
    } catch (error) {
      console.error('Failed to refresh brand deal details:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddCreators = () => {
    setEditingInstance(null);
    setShowAddCreatorSheet(true);
  };

  const handleEditInstance = (instance: BubbleThing & Instance0963) => {
    setEditingInstance(instance);
    setShowAddCreatorSheet(true);
  };

  const handleAddCreatorSubmit = async (data: {
    user?: string;
    platform: string;
    rate: number;
    price: number;
    instanceStatus?: string;
    instanceId?: string;
  }) => {
    if (!id) {
      throw new Error('Brand deal ID is required');
    }

    console.log('=== STARTING INSTANCE OPERATION ===');
    console.log('Edit mode:', !!editingInstance);
    console.log('Data:', data);
    
    try {
      let result;
      
      if (editingInstance && data.instanceId) {
        // Update existing instance
        console.log('=== UPDATING INSTANCE ===');
        result = await updateInstanceMutation.mutateAsync({
          instance: data.instanceId,
          rate: data.rate,
          price: data.price,
          platform: data.platform,
          instanceStatus: data.instanceStatus || 'None',
        });
        console.log('=== INSTANCE UPDATE SUCCESS ===');
      } else {
        // Create new instance
        console.log('=== CREATING INSTANCE ===');
        result = await createInstanceMutation.mutateAsync({
          username: data.user!,
          platform: data.platform,
          rate: data.rate,
          price: data.price,
          branddeal: id,
        });
        console.log('=== INSTANCE CREATION SUCCESS ===');
      }
      
      console.log('API Result:', result);
      
      // Add a small delay to allow backend processing
      setTimeout(async () => {
        console.log('=== MANUAL REFETCH AFTER DELAY ===');
        await Promise.all([
          refetchBrandDeal(),
          refetchInstances(),
        ]);
        console.log('Manual refetch completed');
      }, 1000);
      
      console.log('Operation completed successfully');
      setEditingInstance(null);
    } catch (error) {
      console.error('=== INSTANCE OPERATION ERROR ===');
      console.error('Failed to process instance:', error);
      throw error;
    }
  };

  // Loading state
  if (brandDealLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading brand deal...</ThemedText>
      </ThemedView>
    );
  }

  // Error state
  if (brandDealError || !brandDeal) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText type="title" style={styles.errorTitle}>Oops!</ThemedText>
        <ThemedText style={styles.errorText}>
          {brandDealError ? 'Failed to load brand deal details' : 'Brand deal not found'}
        </ThemedText>
      </ThemedView>
    );
  }

  const instances = instancesData?.results || [];

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#6366f1"
            colors={["#6366f1"]}
          />
        }
      >
        {/* Header Section */}
        <BrandDealHeader brandDeal={brandDeal} />
        
        {/* Instances Section */}
        <ThemedView style={styles.instancesSection}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Video Instances
            </ThemedText>
            <TouchableOpacity style={styles.addCreatorsButton} onPress={handleAddCreators}>
              <IconSymbol size={16} name="plus" color="white" />
              <ThemedText style={styles.addCreatorsText}>Add creators</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          
          {instancesLoading ? (
            <ThemedView style={styles.instancesLoading}>
              <ActivityIndicator size="small" />
              <ThemedText style={styles.loadingText}>Loading instances...</ThemedText>
            </ThemedView>
          ) : instancesError ? (
            <EmptyState
              title="Failed to load instances"
              message="There was an error loading the video instances for this brand deal."
            />
          ) : instances.length === 0 ? (
            <EmptyState
              title="No instances yet"
              message="No video instances have been created for this brand deal."
            />
          ) : (
            <InstanceList instances={instances} onEditInstance={handleEditInstance} />
          )}
        </ThemedView>
      </ScrollView>

      {/* Add Creator Sheet */}
      <AddCreatorSheet
        visible={showAddCreatorSheet}
        onClose={() => {
          setShowAddCreatorSheet(false);
          setEditingInstance(null);
        }}
        onSubmit={handleAddCreatorSubmit}
        isSubmitting={createInstanceMutation.isPending || updateInstanceMutation.isPending}
        editMode={!!editingInstance}
        initialData={editingInstance}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 80, // Account for safe area and header
    paddingBottom: 20,
  },
  instancesSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  addCreatorsButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  addCreatorsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  instancesLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    marginTop: 12,
    textAlign: 'center',
    color: '#666',
  },
  errorTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: '#666',
  },
});