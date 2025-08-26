import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/firebase';
import { AccountStyles as styles } from '@/styles/Account.styles';
import { useState } from 'react';
import { router } from 'expo-router';
import { ROUTES } from '@/constants/Routes';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AccountScreen = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const { user } = useAuth();
  
  return (
    <SafeAreaView style={styles.background} edges={['top']}>
      <ScrollView>
      {user ? (
        <>
          <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingTop: 60 }]}>
            <Text style={styles.headerText}>Account</Text>
            <Text>Profile goes here.</Text>
          </View>

          <View>
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