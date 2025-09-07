import CalendarComp from '@/components/Calendar';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardStyles as styles } from '@/styles/Dashboard.styles';
import {
    ScrollView,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Schedule = () => {
    const { user } = useAuth();
    const uid = user?.uid;

    return (
        <SafeAreaView 
            style={styles.background} 
            edges={['top']
            }>
          {user ? (
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
            >
              {/* Header Section */}
              <View style={styles.headerSection}>
                <Text style={styles.headerText}>Schedule</Text>
                <Text style={styles.subtitleText}>Welcome to your schedule!</Text>
              </View>
            
              <CalendarComp />
            </ScrollView>
          ) : (
            <View style={[styles.container, {justifyContent: 'center', alignItems: 'center', marginTop: 340}]}>
              <Text>Please sign in to view this page.</Text>
            </View>
          )}
        </SafeAreaView>
      );
};

export default Schedule;


