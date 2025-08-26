import { AccountStyles as styles } from '@/styles/Account.styles';
import {
  SafeAreaView,
  Text,
  View,
} from 'react-native';

const AccountScreen = () => {
  return (
    <SafeAreaView style={styles.background}>
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.title}>Account</Text>
      </View>
    </SafeAreaView>
    
    
  );
}


export default AccountScreen;