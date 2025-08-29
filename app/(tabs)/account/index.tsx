import DisplayImage from '@/components/DisplayImage';
import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';
import { useAuth } from '@/contexts/AuthContext';
import { auth, db } from '@/firebase';
import { AccountStyles as styles } from '@/styles/Account.styles';
import { router, useFocusEffect } from 'expo-router';
import { get, ref } from 'firebase/database';
import React, { useState } from 'react';
import {
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

  //load belt data when component mounts and when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadSavedBeltData();
    }, [])
  );

  //uses URL parameter approach
  const handleNavigateToProfile = () => {
    router.push(`/account/profile?beltRank=${beltRank}&stripeCount=${stripeCount}`);
  };

  const loadSavedBeltData = async () => {
    //load belt rank and stripe count from your database
    //set them to state: setBeltRank(savedBeltRank), setStripeCount(savedStripeCount)
    const uid = auth.currentUser?.uid; 
    if (!uid) return; //if no user then leave

    try {
        const beltRef = ref(db, 'users/' + uid + '/rank/beltRank');
        const stripeRef = ref(db, 'users/' + uid + '/rank/stripeCount');

        const beltSnapshot = await get(beltRef);
        const stripeSnapshot = await get(stripeRef);
        
        if(beltSnapshot.exists()){
            setBeltRank(beltSnapshot.val());
        }
        if(stripeSnapshot.exists()){
            setStripeCount(stripeSnapshot.val());
        }

    } catch (error) {
        // console.log("Error loading belt rank!");
    };
  };

  // Belt image mapping
  const beltImageMap = {
    'White Belt_0 Stripe': require('@/assets/belts/white_0.png'),
    /*'White Belt_1st Stripe': require('@/assets/belts/white_1.png'),
    'White Belt_2nd Stripe': require('@/assets/belts/white_2.png'),
    'White Belt_3rd Stripe': require('@/assets/belts/white_3.png'),
    'White Belt_4th Stripe': require('@/assets/belts/white_4.png'),
    'Blue Belt_0 Stripe': require('@/assets/belts/blue_0.png'),
    'Blue Belt_1st Stripe': require('@/assets/belts/blue_1.png'),
    'Blue Belt_2nd Stripe': require('@/assets/belts/blue_2.png'),
    'Blue Belt_3rd Stripe': require('@/assets/belts/blue_3.png'),
    'Blue Belt_4th Stripe': require('@/assets/belts/blue_4.png'),
    'Purple Belt_0 Stripe': require('@/assets/belts/purple_0.png'),
    'Purple Belt_1st Stripe': require('@/assets/belts/purple_1.png'),
    'Purple Belt_2nd Stripe': require('@/assets/belts/purple_2.png'),
    'Purple Belt_3rd Stripe': require('@/assets/belts/purple_3.png'),
    'Purple Belt_4th Stripe': require('@/assets/belts/purple_4.png'),
    'Brown Belt_0 Stripe': require('@/assets/belts/brown_0.png'),
    'Brown Belt_1st Stripe': require('@/assets/belts/brown_1.png'),
    'Brown Belt_2nd Stripe': require('@/assets/belts/brown_2.png'),
    'Brown Belt_3rd Stripe': require('@/assets/belts/brown_3.png'),
    'Brown Belt_4th Stripe': require('@/assets/belts/brown_4.png'),
    'Black Belt_0 Stripe': require('@/assets/belts/black_0.png'),
    'Black Belt_1st Stripe': require('@/assets/belts/black_1.png'),
    'Black Belt_2nd Stripe': require('@/assets/belts/black_2.png'),
    'Black Belt_3rd Stripe': require('@/assets/belts/black_3.png'),
    'Black Belt_4th Stripe': require('@/assets/belts/black_4.png'),*/
  };

  // Belt mapping function
  const getBeltImage = () => {
    if (!beltRank || stripeCount === null) return null;
    
    const key = `${beltRank}_${stripeCount}`;
    return beltImageMap[key] || null;
  };
  
  return (
    <SafeAreaView style={styles.background} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {user ? (
          <>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Text style={styles.headerText}>My Account</Text>
            </View>

            {/* Profile Section */}
            <View style={styles.profileSection}>
              <DisplayImage />
              <Text style={styles.welcomeText}>
                {user.displayName || 'User'}
              </Text>
              
              {beltRank && stripeCount !== null && (
                <View style={styles.beltRankContainer}>
                  <Text style={styles.beltRankText}>
                    {stripeCount || ''} {beltRank || ''}

                  </Text>
                  {/*{getBeltImage() && (
                    <Image 
                      source={getBeltImage()}
                      style={styles.beltImage}
                    />
                  )}*/}
                </View>
              )}
            </View>

            {/* Info Cards Section */}
            <View style={styles.infoSection}>
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>Academy</Text>
                {/*need textbox on profile page for it*/}
                <Text style={styles.infoCardValue}>NA</Text>
              </View>
              
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>Training Since</Text>
                {/*need another dropdown for date*/}
                <Text style={styles.infoCardValue}>NA</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionSection}>
              <TouchableOpacity
                onPress={handleNavigateToProfile}
                style={styles.profileButton}
              >
                <Text style={styles.profileButtonText}>
                  Edit Profile →
                </Text>
              </TouchableOpacity>

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