import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import InstanceCard from './InstanceCard';
import { BubbleThing, Instance0963 } from '@/services/bubbleAPI';

interface InstanceListProps {
  instances: (BubbleThing & Instance0963)[];
}

export default function InstanceList({ instances }: InstanceListProps) {
  const renderInstance = ({ item }: { item: BubbleThing & Instance0963 }) => {
    return <InstanceCard instance={item} />;
  };

  return (
    <FlatList
      data={instances}
      keyExtractor={(item) => item._id}
      renderItem={renderInstance}
      scrollEnabled={false} // Disable scroll since this is inside a ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 4,
  },
});