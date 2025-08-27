import DisplayImage from '@/components/DisplayImage';
import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';
import { useAuth } from '@/contexts/AuthContext';
import { auth, db } from '@/firebase';
import { AccountStyles as styles } from '@/styles/Account.styles';
import { colors } from '@/styles/theme';
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
        console.log("Error loading belt rank!");
    };
  };
  
  return (
    <SafeAreaView style={styles.background} edges={['top']}>
      <ScrollView>
      {user ? (
        <>
          <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={styles.headerText}>My Account</Text>
          </View>
          <View style={styles.headerBorder} />

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <DisplayImage />
          </View>
          <View>
          <Text style={styles.welcomeText}>
            {user.displayName}
          </Text>
          
          {beltRank && stripeCount !== null && (
            <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 10}}>
                <Text>
                {stripeCount} {beltRank} 
                </Text>
            </View>
          )}

          <View style={styles.whiteContainer}>
            <Text style={styles.containerTextCaptions}>Academy</Text>
            <View style={styles.headerBorder} />
            <Text style={styles.containerTextCaptions}>Training Since</Text>
          </View>

          <TouchableOpacity
            onPress={handleNavigateToProfile}
            style={styles.profileButton}
          >
            <Text style={{
              color: colors.primary,
              fontWeight: '600',
              fontSize: 16,
            }}>
              Edit Profile →
            </Text>
          </TouchableOpacity>
          </View>

          <View>
            <View style={{marginBottom: 40}}/>
            <TouchableOpacity
                onPress={() => {
                    auth.signOut();
                    //router.replace(ROUTES.ACCOUNT);
                }}
                style={[styles.signOut]}
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