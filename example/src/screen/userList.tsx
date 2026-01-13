import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import { getUsers } from 'react-native-altibbi';
import { useIsFocused } from '@react-navigation/native';
import { AppHeader } from '../component/appHeader';
import { AppCard } from '../component/appCard';
import { colors } from '../theme/colors';
import LottieView from 'lottie-react-native';

const UserList = (props) => {
  const showAnimation = props.route?.params?.showLottie;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState([]);
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        lottieRef.current?.play();
      }, 100);
    }
  }, [loading]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      if (showAnimation) {
        const [res] = await Promise.all([
          getUsers(1, 50),
          new Promise((resolve) => setTimeout(resolve, 3000)),
        ]);
        setUsers(res.data || []);
      } else {
        const res = await getUsers(1, 50);
        setUsers(res.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      if (showAnimation) {
        props.navigation.setParams({ showLottie: false });
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [])


  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleViewDetails = (user) => {
    props.navigation.navigate('UserDetails', { data: user });
  };

  const renderItem = ({ item }) => (
    <AppCard>
      <View style={styles.cardContent}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userDetails}>{item.email}</Text>
          <Text style={styles.userDetails}>ID: {item.id}</Text>
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleViewDetails(item)}
          >
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewButton,
              styles.editButton,
            ]}
            onPress={() =>
              props.navigation.navigate('EditUser', { data: item })
            }
          >
            <Text style={[styles.viewButtonText, styles.editText]}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppCard>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="All Users" subtitle="List of registered users" />

      {loading ? (
        <View style={styles.center}>
          {showAnimation ? (
            <LottieView
              ref={lottieRef}
              source={require('../assets/lottile/data_list.json')}
              autoPlay
              loop
              style={styles.listLoadingAnimation}
            />
          ) : (
            <ActivityIndicator size="large" color={colors.primary} />
          )}
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No users found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  userDetails: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 2,
  },
  viewButton: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.gray,
    fontSize: 16,
  },
  editButton: {
    backgroundColor: colors.secondary + '15',
  },
  editText: {
    color: colors.secondary,
  },
  listLoadingAnimation: {
    width: 10,
    height: 300,
    bottom: 20,
  },
});

export default UserList;
