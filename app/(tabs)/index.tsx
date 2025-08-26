
import { DashboardStyles as styles } from '@/styles/Dashboard.styles';
import {
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Dashboard = () => {
  return (
    <SafeAreaView style={styles.background}>
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 24, fontWeight: '600' }}>Dashboard</Text>
      </View>
    </SafeAreaView>
  );
}

export default Dashboard;
