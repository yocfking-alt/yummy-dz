import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig'; 

const { width } = Dimensions.get('window');
const IMG_H = (width - 32) * 0.5625; 

// بيانات وهمية للطوارئ إذا فشل الاتصال
const mockRestaurants = [
  {
    id: '1',
    name: 'مطعم الجزائر الأصيل',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    isOpen: true,
    rating: '4.5',
    distance: '2.3'
  },
  {
    id: '2', 
    name: 'كشك الدار',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    isOpen: false,
    rating: '4.2',
    distance: '1.8'
  },
  {
    id: '3',
    name: 'مطعم القصبة',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400',
    isOpen: true,
    rating: '4.7',
    distance: '3.1'
  }
];

const RestaurantCard = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.imgWrapper}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={[styles.statusBadge, { backgroundColor: item.isOpen ? '#38b000' : '#E63946' }]}>
        <Text style={styles.statusText}>{item.isOpen ? 'مفتوح' : 'مغلق'}</Text>
      </View>
    </View>
    <View style={styles.details}>
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.row}>
        <Ionicons name="star" size={16} color="#FFB703" />
        <Text style={styles.rating}>{item.rating}</Text>
        <Text style={styles.distance}>{item.distance} كم</Text>
      </View>
    </View>
    <View style={styles.actions}>
      <TouchableOpacity style={[styles.btn, { backgroundColor: '#FFB703' }]}>
        <Text style={styles.btnTxt}>عرض التفاصيل</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, { backgroundColor: '#E63946' }]}>
        <Text style={styles.btnTxt}>اطلب الآن</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const Header = () => (
  <View style={styles.header}>
    <TouchableOpacity>
      <Ionicons name="location" size={24} color="#222222" />
    </TouchableOpacity>
    <Text style={styles.logo}>Yummy DZ</Text>
    <View style={{ width: 24 }} />
  </View>
);

export default function HomeScreen() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchRestaurants = async () => {
      try {
        console.log('جاري جلب البيانات من Firebase...');
        const snap = await getDocs(collection(db, 'Restaurants'));
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (isMounted) {
          if (data.length > 0) {
            setRestaurants(data);
            console.log('تم جلب البيانات بنجاح:', data.length, 'مطعم');
          } else {
            // إذا كانت قاعدة البيانات فارغة، استخدم البيانات الوهمية
            console.log('قاعدة البيانات فارغة، استخدام البيانات الوهمية');
            setRestaurants(mockRestaurants);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('خطأ في جلب البيانات: ', err);
        if (isMounted) {
          setError(err.message);
          // في حالة الخطأ، استخدم البيانات الوهمية
          setRestaurants(mockRestaurants);
          setLoading(false);
        }
      }
    };

    fetchRestaurants();
    return () => (isMounted = false);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#E63946" />
        <Text style={{ marginTop: 16, color: '#666' }}>جاري تحميل المطاعم...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    console.log('عرض حالة الخطأ:', error);
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <FlatList
        data={restaurants} 
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RestaurantCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
            <View style={{padding: 20, alignItems: 'center'}}>
                <Text style={{fontSize: 16, color: '#666'}}>لا توجد مطاعم متاحة حاليًا.</Text>
            </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222222',
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  imgWrapper: { position: 'relative' },
  image: { width: '100%', height: IMG_H },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 60, 
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  details: { paddingHorizontal: 12, paddingTop: 10 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#222222', textAlign: 'right' },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 4,
    justifyContent: 'flex-start'
  },
  rating: { marginLeft: 4, fontSize: 14, color: '#222222' },
  distance: { marginLeft: 12, fontSize: 14, color: '#222222' },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  btn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnTxt: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
});
