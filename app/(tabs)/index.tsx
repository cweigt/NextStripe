
import { useAuth } from '@/contexts/AuthContext';
import { auth, db } from '@/firebase';
import { DashboardStyles as styles } from '@/styles/Dashboard.styles';
import { router } from 'expo-router';
import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Dashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);

  //make sure to parse to an int for math and then back to string for display
  const [sessionHours, setSessionHours] = useState(''); //for each session
  const [totalSessionHours, setTotalSessionHours] = useState(''); //for the total hours

  //load hours when component mounts
  useEffect(() => {
    if (user) {
      loadHours();
    }
  }, [user]);

  const loadHours = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const sessionsRef = ref(db, `users/${uid}/sessions`);
    //listening to the change on the sessions with onValue
    const listener = onValue(sessionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const sessionsData = snapshot.val();
        
        //calculate total hours from all sessions
        const totalHours = (Object.values(sessionsData) as any[])
        .reduce((sum, session: any) => sum + (parseFloat(session.duration) || 0), 0);
        
        setTotalSessionHours(totalHours.toString());
      } else {
        setTotalSessionHours('0');
      }
    });

    return () => listener();
  };

  const navigateToTraining = () => {
    router.push('/training');
  };

  return (
    <SafeAreaView style={styles.background} edges={['top']}>
      {user ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.headerText}>Dashboard</Text>
            <Text style={styles.subtitleText}>Welcome back, {user.displayName}!</Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={navigateToTraining}
            >
              <Text style={styles.quickActionText}>Training Log</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              {/*progress page will be milestones*/}
              <Text style={styles.quickActionText}>View Progress</Text> 
            </TouchableOpacity>
          </View>

          {/* Training Analytics Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Training Analytics</Text>
            <View style={styles.analyticsContainer}>
              <View style={styles.analyticsCard}>
                <Text style={styles.analyticsNumber}>{totalSessionHours}</Text>
                <Text style={styles.analyticsLabel}>Hours</Text>
              </View>
              <View style={styles.analyticsCard}>
                <Text style={styles.analyticsNumber}>3</Text>
                <Text style={styles.analyticsLabel}>Sessions</Text>
              </View>
              {/*
              <View style={styles.analyticsCard}>
                <Text style={styles.analyticsNumber}>85%</Text>
                <Text style={styles.analyticsLabel}>Consistency</Text>
              </View>
              */}
            </View>
          </View>

          {/* Training Streak Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Training Streak</Text>
            <View style={styles.streakContainer}>
              <View style={styles.streakCard}>
                <Text style={styles.streakNumber}>7</Text>
                <Text style={styles.streakLabel}>Days</Text>
                <Text style={styles.streakSubtext}>Current Streak</Text>
              </View>
              <View style={styles.streakInfo}>
                <Text style={styles.streakText}>🔥 Keep it up! You're on fire!</Text>
                <Text style={styles.streakText}>Longest streak: 14 days</Text>
              </View>
            </View>
          </View>

          {/* Techniques Section 
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Techniques</Text>
            <View style={styles.techniquesContainer}>
              <TouchableOpacity style={styles.techniqueCard}>
                <Text style={styles.techniqueTitle}>Arm Bar</Text>
                <Text style={styles.techniqueSubtext}>Last practiced: 2 days ago</Text>
                <Text style={styles.techniqueProgress}>Progress: 75%</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.techniqueCard}>
                <Text style={styles.techniqueTitle}>Triangle Choke</Text>
                <Text style={styles.techniqueSubtext}>Last practiced: 1 week ago</Text>
                <Text style={styles.techniqueProgress}>Progress: 60%</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.techniqueCard}>
                <Text style={styles.techniqueTitle}>Kimura</Text>
                <Text style={styles.techniqueSubtext}>Last practiced: 3 days ago</Text>
                <Text style={styles.techniqueProgress}>Progress: 85%</Text>
              </TouchableOpacity>
            </View>
          </View>
          */}


          {/* Recent Training Logs Section */}
          {/*training log sessions need to render dynamically based on recent ones from training log itself
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Training Logs</Text>
            <View style={styles.logsContainer}>
              <TouchableOpacity style={styles.logCard}>
                <Text style={styles.logDate}>Today</Text>
                <Text style={styles.logTitle}>Morning Training Session</Text>
                <Text style={styles.logDetails}>Focus: Guard passing • Duration: 1.5 hours</Text>
              </TouchableOpacity>
            </View>
          </View>
            */}

        </ScrollView>
      ) : (
        <View style={[styles.container, {justifyContent: 'center', alignItems: 'center', marginTop: 340}]}>
          <Text>Please sign in to view this page.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

export default Dashboard;
