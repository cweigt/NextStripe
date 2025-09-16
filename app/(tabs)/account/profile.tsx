import UploadImage from '@/components/UploadImage';
//@ts-ignore
import { ProfileStyles as styles } from '@/styles/Profile.styles';
import { useCallback, useEffect, useState } from 'react';
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
import Reset_Password from '@/components/ResetPassword';
import { auth, db } from '@/firebase';
import { colors } from '@/styles/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { get, ref, set } from 'firebase/database';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const params = useLocalSearchParams();
  const [beltRank, setBeltRank] = useState(params.beltRank as string || null);
  const [stripeCount, setStripeCount] = useState(params.stripeCount as string || null);
  const [academy, setAcademy] = useState('');
  const [date, setDate] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPasswordOld, setShowPasswordOld] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordNewConfirm, setShowPasswordNewConfirm] = useState(false);
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  //this is the same function as shown in deleting an account
  //needs to reauthenticate for resetting the password as well
  const reauthenticate = async() => {
      setError('');
      if (newPassword !== confirmPassword) {
          setError('Passwords do not match');
          return;
      }
      const credential = EmailAuthProvider.credential(
          auth.currentUser.email,
          oldPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      //calling updatePassword once the user is authenticated
      await updatePassword(auth.currentUser, newPassword);

      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
  }

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

  //saving gender to database
  const saveGenderToDatabase = async (value: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const userRef = ref(db, `users/${uid}/gender`);
    await set(userRef, value);
  };
  
  //saving weight to database
  const saveWeightToDatabase = async (value: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const userRef = ref(db, `users/${uid}/weight`);
    await set(userRef, value);
  };

  //save height to database
  const saveHeightToDatabase = async (value: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const userRef = ref(db, `users/${uid}/height`);
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

  const genderData = [
    { label: 'Male', value: 'Male'},
    { label: 'Female', value: 'Female'},
    { label: 'Other', value: 'Other'}
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
        console.log("Error loading belt rank!");
    };
  };
  
  //modify your handlers to only update state (not database)
  const handleBeltChange = useCallback((value: string) => {
    setBeltRank(value);
  }, []);

  const handleDateChange = (text: string) => {
    const formatted = formatDate(text);
    setDate(formatted);
  };
  
  const handleStripeChange = useCallback((value: string) => {
    setStripeCount(value);
  }, []);

  const handleGenderChange = useCallback((value: string) => {
    setGender(value);
  }, []);

  const saveAllChanges = async () => {
    try {
      if (beltRank) await saveBeltRankToDatabase(beltRank);
      if (stripeCount) await saveStripeCountToDatabase(stripeCount);
      if (academy) await saveAcademyToDatabase(academy);
      if (date) await saveTrainingDateToDatabase(date);
      if (gender) await saveGenderToDatabase(gender);
      if (weight) await saveWeightToDatabase(weight);
      if (height) await saveHeightToDatabase(height);
      reauthenticate(); //make sure to retest at some point to make sure the modal works for reauthentication

      SuccessAlert();
    } catch (error){
      console.log(error);
    }
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
        <View style={styles.headerBKG}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{ position: 'absolute', top: 60, left: 20, zIndex: 1 }}
          >
            <Text style={[styles.back, {marginTop: 15}]}>
              ← Back
            </Text>
          </TouchableOpacity>
          <Text style={styles.heading}>
            Edit Profile
          </Text>
          <TouchableOpacity 
                style={{ position: 'absolute', top: 60, right: 25, zIndex: 1 }}
                onPress={saveAllChanges}
              >
                <Text style={[styles.back, {marginTop: 15}]}>Save</Text>
            </TouchableOpacity>
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
                style={[styles.input, {marginTop: 15, marginBottom: 30}]}
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
                style={[styles.input, {marginTop: 15, marginBottom: 30}]}
                onChangeText={handleDateChange}
                value={date}
                placeholder="MM/YYYY"
                placeholderTextColor='#d9d9d9'
                keyboardType="numeric"
                maxLength={7}
              >
              </TextInput>
              <View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 30}}>
                <Text style={styles.title}>
                  Gender
                </Text>
                <DropdownComp 
                    data={genderData} 
                    placeholder="Select Gender" 
                    value={gender} 
                    onChange={handleGenderChange} 
                />
              </View>
              <Text style={styles.title}>
                Weight (lbs)
              </Text>
              <TextInput 
                style={[styles.input, {marginTop: 15, marginBottom: 30}]}
                value={weight}
                onChangeText={setWeight}
                //keyboardType="email-address"
                placeholder= "Weight in pounds..."
                placeholderTextColor='#d9d9d9'
              >
              </TextInput>
              <Text style={styles.title}>
                Height (ft, in)
              </Text>
              <TextInput 
                style={[styles.input, {marginTop: 15, marginBottom: 30}]}
                value={height}
                onChangeText={setHeight}
                //keyboardType="email-address"
                placeholder={"Height... (5' 8\")"}
                placeholderTextColor='#d9d9d9'
              >
              </TextInput>



              <Text style={styles.title}>
                Reset Password
              </Text>
              <Reset_Password 
                oldPassword={oldPassword}
                setOldPassword={setOldPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                error={error}
                showPasswordOld={showPasswordOld}
                setShowPasswordOld={setShowPasswordOld}
                showPasswordNew={showPasswordNew}
                setShowPasswordNew={setShowPasswordNew}
                showPasswordNewConfirm={showPasswordNewConfirm}
                setShowPasswordNewConfirm={setShowPasswordNewConfirm}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Profile; 