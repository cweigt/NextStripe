import DeleteAccountButton from '@/components/DeleteAccountButton';
import DisplayImage from '@/components/DisplayImage';
import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';
import { useAuth } from '@/contexts/AuthContext';
import { auth, db } from '@/firebase';
import { AccountStyles as styles } from '@/styles/Account.styles';
import { router, useFocusEffect } from 'expo-router';
import { get, ref } from 'firebase/database';
import { useCallback, useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AccountScreen = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const { user } = useAuth();
  const [beltRank, setBeltRank] = useState(null);
  const [stripeCount, setStripeCount] = useState(null);
  const [academy, setAcademy] = useState('');
  const [date, setDate] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  //load belt data when component mounts and when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [user]) //add user as dependency to reload data when user changes
  );

  const loadData = async () => {
    //clear all state first when loading data for a new user
    setBeltRank(null);
    setStripeCount(null);
    setAcademy('--');
    setDate('--');
    setGender('--');
    setWeight('--');
    
    const uid = auth.currentUser?.uid; 
    if (!uid) return; //if no user then leave

    try {
      const beltRef = ref(db, `users/${uid}/rank/beltRank`);
      const stripeRef = ref(db, `users/${uid}/rank/stripeCount`);
      const academyRef = ref(db, `users/${uid}/academy`);
      const trainingRef = ref(db, `users/${uid}/timeTraining`);
      const genderRef = ref(db, `users/${uid}/gender`);
      const weightRef = ref(db, `users/${uid}/weight`);
      const heightRef = ref(db, `users/${uid}/height`);

      const beltSnapshot = await get(beltRef);
      const stripeSnapshot = await get(stripeRef);
      const academySnapshot = await get(academyRef);
      const trainingSnapshot = await get(trainingRef);
      const genderSnapshot = await get(genderRef);
      const weightSnapshot = await get(weightRef);
      const heightSnapshot = await get(heightRef);
      
      if(beltSnapshot.exists()){
          setBeltRank(beltSnapshot.val());
      }
      if(stripeSnapshot.exists()){
          setStripeCount(stripeSnapshot.val());
      }
      if(academySnapshot.exists()){
        setAcademy(academySnapshot.val());
      }
      if(trainingSnapshot.exists()){
        setDate(trainingSnapshot.val());
      }
      if(genderSnapshot.exists()){
        setGender(genderSnapshot.val());
      }
      if(weightSnapshot.exists()){
        setWeight(weightSnapshot.val());
      }
      if(heightSnapshot.exists()){
        setHeight(heightSnapshot.val());
      }


    } catch (error) {
        console.log("Error loading user data:", error);
    };
  };

  //belt image mapping
  const beltImageMap = {
    'White Belt_0 Stripe': require('@/assets/belts/white-0.png'),
    'White Belt_1st Stripe': require('@/assets/belts/white-1.png'),
    'White Belt_2nd Stripe': require('@/assets/belts/white-2.png'),
    'White Belt_3rd Stripe': require('@/assets/belts/white-3.png'),
    'White Belt_4th Stripe': require('@/assets/belts/white-4.png'),
    'Blue Belt_0 Stripe': require('@/assets/belts/blue-0.png'),
    'Blue Belt_1st Stripe': require('@/assets/belts/blue-1.png'),
    'Blue Belt_2nd Stripe': require('@/assets/belts/blue-2.png'),
    'Blue Belt_3rd Stripe': require('@/assets/belts/blue-3.png'),
    'Blue Belt_4th Stripe': require('@/assets/belts/blue-4.png'),
    'Purple Belt_0 Stripe': require('@/assets/belts/purple-0.png'),
    'Purple Belt_1st Stripe': require('@/assets/belts/purple-1.png'),
    'Purple Belt_2nd Stripe': require('@/assets/belts/purple-2.png'),
    'Purple Belt_3rd Stripe': require('@/assets/belts/purple-3.png'),
    'Purple Belt_4th Stripe': require('@/assets/belts/purple-4.png'),
    'Brown Belt_0 Stripe': require('@/assets/belts/brown-0.png'),
    'Brown Belt_1st Stripe': require('@/assets/belts/brown-1.png'),
    'Brown Belt_2nd Stripe': require('@/assets/belts/brown-2.png'),
    'Brown Belt_3rd Stripe': require('@/assets/belts/brown-3.png'),
    'Brown Belt_4th Stripe': require('@/assets/belts/brown-4.png'),
    'Black Belt_0 Stripe': require('@/assets/belts/black-0.png'),
    'Black Belt_1st Stripe': require('@/assets/belts/black-1.png'),
    'Black Belt_2nd Stripe': require('@/assets/belts/black-2.png'),
    'Black Belt_3rd Stripe': require('@/assets/belts/black-3.png'),
    'Black Belt_4th Stripe': require('@/assets/belts/black-4.png'),
  };

  // Belt mapping function
  const getBeltImage = () => {
    if (!beltRank || stripeCount === null) return null;
    
    const key = `${beltRank}_${stripeCount}`;
    return beltImageMap[key] || null;
  };
  
  return (
    <SafeAreaView style={styles.background} edges={['top']}>
      {/* Header Section */}

      {user && (
        <View style={[styles.headerBKG, {paddingBottom: -30}]}> 
          <Text style={styles.heading}>
            My Account
          </Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {user ? (
          <>

            {/* Profile Section */}
            <View style={styles.profileSection}>
              <DisplayImage />
              <Text style={styles.welcomeText}>
                {user.displayName || 'User'}
              </Text>
              
              {beltRank && stripeCount !== null && (
                <View>

                  {getBeltImage() && (
                    <Image 
                      source={getBeltImage()}
                      style={styles.beltImage}
                    />
                  )}
                </View>
              )}
            </View>

            {/* Info Cards Section */}
            <View style={styles.infoSection}>
              <View style={[styles.infoCard, styles.academyCard]}>
                <Text style={styles.infoCardTitle}>Academy</Text>
                <Text style={[styles.infoCardValue, academy === '--' && styles.emptyValue]}>
                  {academy === '--' ? 'Not set' : academy}
                </Text>
              </View>
              
              <View style={[styles.infoCard, styles.trainingCard]}>
                <Text style={styles.infoCardTitle}>Training Since</Text>
                <Text style={[styles.infoCardValue, date === '--' && styles.emptyValue]}>
                  {date === '--' ? 'Not set' : date}
                </Text>
              </View>
              
              <View style={[styles.infoCard, styles.genderCard]}>
                <Text style={styles.infoCardTitle}>Gender</Text>
                <Text style={[styles.infoCardValue, gender === '--' && styles.emptyValue]}>
                  {gender === '--' ? 'Not set' : gender}
                </Text>
              </View>
              
              <View style={[styles.infoCard, styles.weightCard]}>
                <Text style={styles.infoCardTitle}>Weight (lbs)</Text>
                <Text style={[styles.infoCardValue, weight === '--' && styles.emptyValue]}>
                  {weight === '--' ? 'Not set' : weight}
                </Text>
              </View>
              
              <View style={[styles.infoCard, styles.heightCard]}>
                <Text style={styles.infoCardTitle}>Height</Text>
                <Text style={[styles.infoCardValue, height === '--' && styles.emptyValue]}>
                  {height === '--' ? 'Not set' : height}
                </Text>
              </View>
            </View>

            {/* Edit Profile Button */}
            <View style={styles.editSection}>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => router.push('/(tabs)/account/profile')} 
              >
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionSection}>
              <TouchableOpacity
                onPress={() => {
                  auth.signOut();
                }}
                style={styles.signOutButton}
              >
                <Text style={styles.signOutText}>
                  Sign Out
                </Text>
              </TouchableOpacity>
              <View style={{marginBottom: 10}}/>
              <DeleteAccountButton />
              <View style={{marginBottom: 10}}/>
            </View>
          </>
        ) : (
          <>
            {showSignUp ? (
              <SignUp setUser={setShowSignUp} />
            ) : (
              <SignIn setUser={setShowSignUp} />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default AccountScreen;