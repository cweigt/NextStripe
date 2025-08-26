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
        <Text>This is Account Screen</Text>
      </View>
    </SafeAreaView>
    
    
  );
}


export default AccountScreen;