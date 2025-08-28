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
                </View>
              )}
            </View>

            {/* Info Cards Section */}
            <View style={styles.infoSection}>
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>Academy</Text>
                <Text style={styles.infoCardValue}>NA</Text> {/*need textbox on profile page for it*/}
              </View>
              
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>Training Since</Text>
                <Text style={styles.infoCardValue}>NA</Text> {/*need another dropdown for date*/}
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