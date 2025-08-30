import UploadImage from '@/components/UploadImage';
//@ts-ignore
import { ProfileStyles as styles } from '@/styles/Profile.styles';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
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

const Profile = () => {
  const params = useLocalSearchParams();
  const [beltRank, setBeltRank] = useState(params.beltRank as string || null);
  const [stripeCount, setStripeCount] = useState(params.stripeCount as string || null);
  const [academy, setAcademy] = useState('');
  const [date, setDate] = useState('');
  //const [trainingStart, setTrainingStart] = useState('');

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


  //saving the academy to database
  const saveAcademyToDatabase = async (value: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const userRef = ref(db, `users/${uid}/academy`);
    await set(userRef, value);
  };

  //saving the training start date to database
  const saveTrainingDateToDatabase = async (value: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const userRef = ref(db, `users/${uid}/timeTraining`);
    await set(userRef, value);
  };

  const formatDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length === 0) return '';
  
    let month = cleaned.slice(0, 2);
    let year = cleaned.slice(2, 6);
  
    // clamp invalid months
    if (parseInt(month) > 12) month = '12';
  
    if (cleaned.length <= 2) return month;
    return `${month}/${year}`;
  };

  const handleDateChange = (text: string) => {
    const formatted = formatDate(text);
    setDate(formatted);
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
    loadData();
  }, []);
  
  const loadData = async () => {
    //load belt rank and stripe count from your database
    //set them to state: setBeltRank(savedBeltRank), setStripeCount(savedStripeCount)
    const uid = auth.currentUser?.uid; 
    if (!uid) return; //if no user then leave

    try {
        const beltRef = ref(db, `users/${uid}/rank/beltRank`);
        const stripeRef = ref(db, `users/${uid}/rank/stripeCount`);
        const academyRef = ref(db, `users/${uid}/academy`);
        const trainingRef = ref(db, `users/${uid}/timeTraining`);

        const beltSnapshot = await get(beltRef);
        const stripeSnapshot = await get(stripeRef);
        const academySnapshot = await get(academyRef);
        const trainingSnapshot = await get(trainingRef);
        
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

    } catch (error) {
        console.log("Error loading belt rank!");
    };
  };
  
  
  //modify your handlers to only update state (not database)
  const handleBeltChange = useCallback((value: string) => {
    setBeltRank(value);
  }, []);
  
  const handleStripeChange = useCallback((value: string) => {
    setStripeCount(value);
  }, []);

  const saveAllChanges = async () => {
    if (beltRank) await saveBeltRankToDatabase(beltRank);
    if (stripeCount) await saveStripeCountToDatabase(stripeCount);
    if (academy) await saveAcademyToDatabase(academy);
    if (date) await saveTrainingDateToDatabase(date);

    SuccessAlert();
  };

  //success alert to know when card is removed off of firebase to avoid any issues
  const SuccessAlert = () => {
    Alert.alert(
        'Success',
        'Changes have been saved.',
        [
            { text: 'OK', style: 'default' },
        ]
    );
};

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
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
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
            <View>
              <Text style={styles.title}>
                Academy
              </Text>
              <TextInput 
                style={[styles.input, {marginTop: 15}]}
                value={academy}
                onChangeText={setAcademy}
                //keyboardType="email-address"
                placeholder= "Training school here..."
                placeholderTextColor='#d9d9d9'
              >
              </TextInput>

              <Text style={styles.title}>
                Training Start Date
              </Text>
              <TextInput 
                style={[styles.input, {marginTop: 15}]}
                onChangeText={handleDateChange}
                value={date}
                placeholder="MM/YYYY"
                placeholderTextColor='#d9d9d9'
                keyboardType="numeric"
                maxLength={7}
              >
              </TextInput>
              <TouchableOpacity 
                style={[styles.quickActionButton, {marginTop: 20}]}
                onPress={saveAllChanges}
              >
                <Text style={styles.quickActionText}>Save Changes</Text>
            </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Profile; 