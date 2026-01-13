import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {
  getConsultationList,
  deleteConsultation,
  getConsultationInfo,
  deleteMedia,
} from 'react-native-altibbi';
import { AppHeader } from '../component/appHeader';
import { AppCard } from '../component/appCard';
import { colors } from '../theme/colors';

const ConsultationList = (props) => {
  const { userId, showLottie } = props.route.params;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const lottieRef = useRef<LottieView>(null);
  const showAnimation = showLottie;

  useEffect(() => {
    if (loading && showAnimation) {
      setTimeout(() => {
        lottieRef.current?.play();
      }, 100);
    }
  }, [loading, showAnimation]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      if (showAnimation) {
        const [res] = await Promise.all([
          getConsultationList(userId, 1, 50),
          new Promise((resolve) => setTimeout(resolve, 3000)),
        ]);
        setConsultations(res.data || []);
      } else {
        const res = await getConsultationList(userId, 1, 50);
        setConsultations(res.data || []);
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      if (showAnimation) {
        props.navigation.setParams({ showLottie: false });
      }
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchConsultations();
  };

  const handleViewDetails = (id) => {
    getConsultationInfo(id)
      .then((res) => {
        if (res.data) {
          props.navigation.navigate('ConsultationDetails', { data: res.data });
        }
      })
      .catch((err) => {
        Alert.alert('Error', 'Failed to fetch details');
        console.error(err);
      });
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete consultation #${id}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteConsultation(id)
              .then(() => {
                Alert.alert('Success', 'Consultation deleted');
                fetchConsultations();
              })
              .catch((err) => {
                Alert.alert('Error', 'Failed to delete');
                console.error(err);
              });
          },
        },
      ]
    );
  };

  const handleDeleteMedia = (mediaId) => {
    Alert.alert('Delete Media', `Delete attachment #${mediaId}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteMedia(mediaId)
            .then(() => {
              Alert.alert('Success', 'Media deleted');
              fetchConsultations();
            })
            .catch((err) => {
              Alert.alert('Error', 'Failed to delete media');
              console.error(err);
            });
        },
      },
    ]);
  };

  const handleShowMedia = (url) => {
    if (url) {
      Linking.openURL(url).catch((err) => {
        Alert.alert('Error', 'Cannot open this media URL');
        console.error(err);
      });
    } else {
      Alert.alert('Info', 'Media URL not available');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'closed':
        return colors.gray;
      case 'in_progress':
        return colors.primary;
      case 'new':
        return colors.secondary;
      default:
        return colors.text;
    }
  };

  const renderItem = ({ item }) => (
    <AppCard>
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + '20' },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status?.toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleViewDetails(item.id)}
          >
            <Text style={styles.actionTextDetails}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.actionTextDelete}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.doctorInfo}>
        <Text style={styles.doctorLabel}>Doctor:</Text>
        <Text style={styles.doctorName}>
          {item.doctor_name || 'Generic Doctor'}
        </Text>
      </View>

      <Text style={styles.questionText} numberOfLines={2}>
        {item.question}
      </Text>

      {item.media && item.media.length > 0 && (
        <View style={styles.mediaSection}>
          <Text style={styles.mediaTitle}>
            Attachments ({item.media.length}):
          </Text>
          {item.media.map((m) => (
            <View key={m.id} style={styles.mediaItem}>
              <Text
                style={styles.mediaId}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                ID: {m.id}
              </Text>
              <View style={styles.mediaActions}>
                <TouchableOpacity
                  style={styles.mediaActionButton}
                  onPress={() => handleShowMedia(m.url)}
                >
                  <Text style={styles.mediaShowText}>Show</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.mediaActionButton, styles.mediaDeleteButton]}
                  onPress={() => handleDeleteMedia(m.id)}
                >
                  <Text style={styles.mediaDeleteText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.cardFooter}>
        <View style={styles.footerDetail}>
          <Text style={styles.label}>ID:</Text>
          <Text style={styles.value}>{item.id}</Text>
        </View>
        <View style={styles.footerDetail}>
          <Text style={styles.label}>Medium:</Text>
          <Text style={styles.value}>{item.medium || 'N/A'}</Text>
        </View>
        <View style={styles.footerDetail}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>
            {item.created_at || item.createdAt
              ? new Date(item.created_at || item.createdAt).toLocaleDateString()
              : 'N/A'}
          </Text>
        </View>
      </View>
    </AppCard>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="My Consultations" subtitle={`User ID: ${userId}`} />

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
          data={consultations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No consultations found for this user.
              </Text>
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: colors.error + '15',
  },
  actionTextDetails: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  actionTextDelete: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D32F2F',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  doctorLabel: {
    fontSize: 12,
    color: colors.gray,
    marginRight: 4,
  },
  doctorName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  mediaSection: {
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  mediaTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gray,
    marginBottom: 8,
  },
  mediaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  mediaId: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
    marginRight: 10,
  },
  mediaActions: {
    flexDirection: 'row',
    gap: 6,
  },
  mediaActionButton: {
    backgroundColor: colors.primary + '10',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  mediaDeleteButton: {
    backgroundColor: colors.error + '10',
    borderColor: colors.error + '30',
  },
  mediaShowText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
  },
  mediaDeleteText: {
    fontSize: 11,
    color: colors.error,
    fontWeight: '700',
  },
  questionText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 16,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  footerDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: colors.gray,
    marginRight: 4,
  },
  value: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.gray,
    fontSize: 16,
  },
  listLoadingAnimation: {
    width: 10,
    height: 300,
    bottom: 20,
  },
});

export default ConsultationList;
