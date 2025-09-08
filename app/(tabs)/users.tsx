// app/(tabs)/users.tsx
import { ActivityIndicator, FlatList, StyleSheet, Image, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useUsers } from "../../hooks/useUsers";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { IconSymbol } from "@/components/ui/IconSymbol";

// Component for user avatar with image fallback
const UserAvatar = ({ user }: { user: any }) => {
  const [imageError, setImageError] = useState(false);
  
  if (user.image && !imageError) {
    return (
      <Image
        source={{ uri: user.image }}
        style={styles.avatarImage}
        onError={() => setImageError(true)}
      />
    );
  }
  
  // Fallback to initials
  return (
    <ThemedView style={styles.avatar}>
      <ThemedText type="defaultSemiBold" style={styles.avatarText}>
        {(user.username ?? "?").charAt(0).toUpperCase()}
      </ThemedText>
    </ThemedView>
  );
};

export default function UsersScreen() {
  const { data, isLoading, error, refetch } = useUsers(100);
  const { logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Failed to refresh users:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading users...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText type="title" style={styles.errorTitle}>Oops!</ThemedText>
        <ThemedText style={styles.errorText}>Failed to load users</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.headerContent}>
          <ThemedView>
            <ThemedText type="title">Users</ThemedText>
            <ThemedText type="subtitle" lightColor="#666" darkColor="#999">
              {data?.length || 0} users found
            </ThemedText>
          </ThemedView>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <IconSymbol size={20} name="rectangle.portrait.and.arrow.right" color="#ff3b30" />
            <ThemedText style={styles.logoutText}>Sign Out</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
      
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#6366f1"
            colors={["#6366f1"]}
          />
        }
        renderItem={({ item }) => (
          <ThemedView style={styles.userCard}>
            <UserAvatar user={item} />
            <ThemedView style={styles.userInfo}>
              <ThemedText type="defaultSemiBold" style={styles.username}>
                {item.username ?? "(no name)"}
              </ThemedText>
              {item.authentication?.email?.email && (
                <ThemedText style={styles.email} lightColor="#666" darkColor="#999">
                  {item.authentication.email.email}
                  {item.authentication.email.email_confirmed === false && (
                    <ThemedText style={styles.unconfirmed}> (unconfirmed)</ThemedText>
                  )}
                </ThemedText>
              )}
            </ThemedView>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80, // Increased safe area padding for better spacing
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  logoutText: {
    color: '#ff3b30',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingText: {
    marginTop: 12,
    textAlign: 'center',
  },
  errorTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  username: {
    fontSize: 17,
  },
  email: {
    fontSize: 15,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 16,
  },
  unconfirmed: {
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.7,
  },
});
