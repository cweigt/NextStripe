
import { useAuth } from '@/contexts/AuthContext';
import { DashboardStyles as styles } from '@/styles/Dashboard.styles';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.background}>
      {user ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={styles.title}>Dashboard</Text>
          </View>
        </ScrollView>
      ):(
        <View style={[styles.container, {justifyContent: 'center', alignItems: 'center', marginTop: 340}]}>
          <Text>Please sign in to view this page.</Text>
        </View>
      )}
      
    </SafeAreaView>
  );
}

export default Dashboard;
