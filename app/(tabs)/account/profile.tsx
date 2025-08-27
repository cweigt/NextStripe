import UploadImage from '@/components/UploadImage';
//@ts-ignore
import { ProfileStyles as styles } from '@/styles/Profile.styles';
import React, { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
//import NameChange from '@/components/NameChange';
//import ResetPassword from '@/components/ResetPassword';
import DropdownComp from '@/components/Dropdown';
import { auth, db } from '@/firebase';
import { colors } from '@/styles/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { get, ref, set } from 'firebase/database';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
//import DeleteAccountButton from '@/components/DeleteAccountButton';

const Profile = () => {
  const params = useLocalSearchParams();
  const [beltRank, setBeltRank] = useState(params.beltRank as string || null);
  const [stripeCount, setStripeCount] = useState(params.stripeCount as string || null);

  //saving the belt color to database
  const saveBeltRankToDatabase = async (value: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const userRef = ref(db, 'users/' + uid + '/rank/beltRank');
    await set(userRef, value);
  };
  
  //saving the stripe count to database
  const saveStripeCountToDatabase = async (value: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const userRef = ref(db, 'users/' + uid + '/rank/stripeCount');
    await set(userRef, value);
  };

  const beltData = [
    { label: 'White Belt', value: 'White Belt' },
    { label: 'Blue Belt', value: 'Blue Belt' },
    { label: 'Purple Belt', value: 'Purple Belt' },
    { label: 'Brown Belt', value: 'Brown Belt' },
    { label: 'Black Belt', value: 'Black Belt' },
  ];

  const stripeData = [
    { label: '0 Stripes', value: '0 Stripe' },
    { label: '1 Stripe', value: '1st Stripe' },
    { label: '2 Stripes', value: '2nd Stripe' },
    { label: '3 Stripes', value: '3rd Stripe' },
    { label: '4 Stripes', value: '4th Stripe' },
  ];

  //add useEffect to load saved values
  useEffect(() => {
    loadSavedBeltData();
  }, []);
  
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
  
  
  //modify your handlers to save to database
  const handleBeltChange = useCallback(async (value: string) => {
    setBeltRank(value);
    //Save to database here
    await saveBeltRankToDatabase(value);
  }, []);
  
  const handleStripeChange = useCallback(async (value: string) => {
    setStripeCount(value);
    // Save to database here
    await saveStripeCountToDatabase(value);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={[]}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Blue Header */}
        <View style={styles.headerBKG}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{ position: 'absolute', top: 60, left: 20, zIndex: 1 }}
          >
            <Text style={styles.back}>
              ← Back
            </Text>
          </TouchableOpacity>
          <Text style={styles.heading}>
            Edit Profile
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.background }}>
          <View style={{ backgroundColor: colors.background }}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Profile Information
            </Text>
            <UploadImage />
            <View style={{marginTop: 30}}/>

            <Text style={[styles.title, { color: colors.textPrimary }]}>
                    Belt Rank
                </Text>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <DropdownComp 
                    data={stripeData} 
                    placeholder="Select Stripe Count" 
                    value={stripeCount} 
                    onChange={handleStripeChange} 
                />
                <DropdownComp 
                    data={beltData} 
                    placeholder="Select Belt Rank" 
                    value={beltRank} 
                    onChange={handleBeltChange} 
                />
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Profile; 