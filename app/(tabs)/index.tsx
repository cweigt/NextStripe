
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebase';
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
  const [sessionCount, setSessionCount] = useState(0);
  //make sure to parse to an int for math and then back to string for display
  const [totalSessionHours, setTotalSessionHours] = useState(''); //for the total hours
  const [recentDate, setRecentDate] = useState(''); //for recent date
  const [maxHours, setMaxHours] = useState('');
  const [daysSinceLast, setDaysSinceLast] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState('');
  const uid = user?.uid;


  //load stats when component mounts
  useEffect(() => {
    if (user) {
      loadHours();
      loadCount();
      loadRecentDate();
      loadMaxHours();
      loadAverageRating();
    } else {
      //reset state when no user
      setTotalSessionHours(''); //0
      setSessionCount(0); //0
      setRecentDate('NA'); //NA
      setMaxHours(''); //0
      setAverageRating('') //0
      setDaysSinceLast(null);
    }
  }, [user]);

  //NOTE: onValue will fetch everytime the value of path changes
  //load max hours for a session
  const loadMaxHours = async () => {
    if (!uid) return;

    try {
      const maxHourRef = ref(db, `users/${uid}/records/maxHours`);

      const listener = onValue(maxHourRef, (snapshot) => {
        if(snapshot.exists()){
          const hourSnap = snapshot.val();
          setMaxHours(hourSnap);
        } else {
          setMaxHours('NA');
        }
      });
      return () => listener();
    } catch (error) {
      console.log(error);
    }
  }
  //loading most recent date
  const loadRecentDate = async () => {
    if (!uid) return;

    try {
      const dateRef = ref(db, `users/${uid}/mostRecentDate/lastTrained`);

      const listener = onValue(dateRef, (snapshot) => {
        if(snapshot.exists()){
          const dateSnap = snapshot.val();
          setRecentDate(dateSnap);

          //parse and compute difference
          const [month, day, year] = dateSnap.split('/').map((x: string) => parseInt(x, 10));
          const recent = new Date(year, month - 1, day); //months are 0-based
          //can't use toLocaleString because you can do string math with dates
          const today = new Date();
          today.setHours(0,0,0,0); //normalize to locale time
          recent.setHours(0,0,0,0);

          const diffTime = today.getTime() - recent.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          setDaysSinceLast(diffDays);
        } else {
          setRecentDate('NA');
          setDaysSinceLast(null);
        }
      });
      return () => listener();

    } catch (error){
      console.log(error);
    }
  }
  //loading hours
  const loadCount = async () => {
    if (!uid) return;

    try {
      const sessionsCountRef = ref(db, `users/${uid}/sessionCount`);

      const listener = onValue(sessionsCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const sessionsCountSnap = snapshot.val();
          setSessionCount(sessionsCountSnap);
        } else {
          setSessionCount(0);
        }
      });
      
      return () => listener();
      
    } catch (error) {
      console.log(error);
    }
  };

  //load sum of hours
  const loadHours = async () => {
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

  //load average quality
  const loadAverageRating = async () => {
    if (!uid) return;

    const sessionsRef = ref(db, `users/${uid}/sessions`);
    const listener = onValue(sessionsRef, (snapshot) => {
      if(snapshot.exists()){
        const sessionData = snapshot.val();
        const sessions = Object.values(sessionData) as any[];

        //calculate total rating
        const totalRating = sessions
        .reduce((sum, session: any) => sum + (parseFloat(session.qualityLevel) || 0), 0);

        // Use the actual number of sessions from the data, not the separate sessionCount state
        const actualSessionCount = sessions.length;
        const average = actualSessionCount > 0 ? totalRating / actualSessionCount : 0;
        //console.log('Average calculation:', { totalRating, actualSessionCount, average });
        const averageOneDecimals = average.toFixed(1); //two decimals

        //making sure it's a string, although I'm pretty sure .toFixed() does that
        setAverageRating(averageOneDecimals.toString());
      } else {
        setAverageRating('0');
      }
    });
    return () => listener();
  };

  //navigation 
  const navigateToTraining = () => {
    router.push('/training');
  };

  const navigateToAnalytics = () => {
    router.push('/analytics');
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
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={navigateToAnalytics}
            >
              <Text style={styles.quickActionText}>View Analytics</Text> 
            </TouchableOpacity>
          </View>

          {/*Quick stats section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Stats</Text>
            <View style={styles.analyticsContainer}>
              <View style={styles.analyticsCard}>
                <Text style={styles.analyticsNumber}>{totalSessionHours}</Text>
                <Text style={styles.analyticsLabel}>Hours</Text>
              </View>
              <View style={styles.analyticsCard}>
                <Text style={styles.analyticsNumber}>{sessionCount}</Text>
                <Text style={styles.analyticsLabel}>Sessions</Text>
              </View>
              <View style={styles.analyticsCard}>
                <Text style={styles.analyticsNumber}>{averageRating}/10</Text>
                <Text style={styles.analyticsLabel}>AVG Quality</Text>
              </View>
            </View>
          </View>
          <View style={[styles.section, {marginTop: -23}]}>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsNumber}>{recentDate}</Text>
              {daysSinceLast !== null && (
                <Text style={[styles.analyticsLabel, {fontStyle: 'italic'}]}>
                  <Text style={{ fontWeight: 'bold' }}>{daysSinceLast}</Text> day
                  {daysSinceLast === 1 ? '' : 's'} ago
                </Text>
              )}
              <Text style={styles.analyticsLabel}>Last Trained</Text>
            </View>
          </View>
          



          {/*Records section*/}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Records</Text>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsNumber}>{maxHours}</Text>
              <Text style={styles.analyticsLabel}>Most Hours in a Session</Text>
            </View>
          </View>


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
