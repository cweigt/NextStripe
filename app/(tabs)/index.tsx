
import EditCompModal from '@/components/EditCompModal';
import { useAuth } from '@/contexts/AuthContext';
import { auth, db } from '@/firebase';
import { DashboardStyles as styles } from '@/styles/Dashboard.styles';
import { router } from 'expo-router';
import { get, onValue, ref, set } from 'firebase/database';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [resultType, setResultType] = useState<'win' | 'loss' | null>(null);
  const [lossCount, setLossCount] = useState(''); //0
  const [winCount, setWinCount] = useState(''); //0
  const [submissionWins, setSubmissionWins] = useState(0);
  const [pointsWins, setPointsWins] = useState(0);
  const [submissionLosses, setSubmissionLosses] = useState(0);
  const [pointsLosses, setPointsLosses] = useState(0);
  const [detail, setDetail] = useState('');
  const uid = user?.uid;
  


  //load stats when component mounts
  useEffect(() => {
    if (user) {
      loadHours();
      loadCount();
      loadRecentDate();
      loadMaxHours();
      loadAverageRating();
      loadWinCount();
      loadLossCount();
      loadMethodCounts();
    } else {
      //reset state when no user
      setTotalSessionHours(''); //0
      setSessionCount(0); //0
      setRecentDate('NA'); //NA
      setMaxHours(''); //0
      setAverageRating('') //0
      setDaysSinceLast(null);
      setWinCount('0');
      setLossCount('0');
      setSubmissionWins(0);
      setPointsWins(0);
      setSubmissionLosses(0);
      setPointsLosses(0);
    }
  }, [user]);

  const onSave = async (method: 'points' | 'submission') => {
    const uid = auth.currentUser?.uid;
    if (!uid || !resultType) return;

    try {
      const winRef = ref(db, `users/${uid}/comp/wins`);
      const lossRef = ref(db, `users/${uid}/comp/losses`);
      const submissionWinsRef = ref(db, `users/${uid}/comp/submissionWins`);
      const pointsWinsRef = ref(db, `users/${uid}/comp/pointsWins`);
      const submissionLossesRef = ref(db, `users/${uid}/comp/submissionLosses`);
      const pointsLossesRef = ref(db, `users/${uid}/comp/pointsLosses`);
      
      if (resultType === 'win') {
        // Increment total win count
        const currentWins = parseInt(winCount) || 0;
        const newWinCount = currentWins + 1;
        setWinCount(newWinCount.toString());
        
        //increment method-specific win count
        if (method === 'submission') {
          const newSubmissionWins = submissionWins + 1;
          setSubmissionWins(newSubmissionWins);
          await set(submissionWinsRef, newSubmissionWins);
        } else {
          const newPointsWins = pointsWins + 1;
          setPointsWins(newPointsWins);
          await set(pointsWinsRef, newPointsWins);
        }
        
        // Save total wins to Firebase
        await set(winRef, newWinCount);
      } else if (resultType === 'loss') {
        // Increment total loss count
        const currentLosses = parseInt(lossCount) || 0;
        const newLossCount = currentLosses + 1;
        setLossCount(newLossCount.toString());
        
        // Increment method-specific loss count
        if (method === 'submission') {
          const newSubmissionLosses = submissionLosses + 1;
          setSubmissionLosses(newSubmissionLosses);
          await set(submissionLossesRef, newSubmissionLosses);
        } else {
          const newPointsLosses = pointsLosses + 1;
          setPointsLosses(newPointsLosses);
          await set(pointsLossesRef, newPointsLosses);
        }
        
        // Save total losses to Firebase
        await set(lossRef, newLossCount);
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving competition result:', error);
    }
  };
  const openModal = (type: 'win' | 'loss') => {
    setResultType(type);
    setModalVisible(true);
  };
  
  const closeModal = () => {
    setModalVisible(false);
    setResultType(null);
    setDetail('');
  };

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

        //use the actual number of sessions from the data, not the separate sessionCount state
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

  //load win count
  const loadWinCount = async () => {
    if (!uid) return;

    try {
      const winRef = ref(db, `users/${uid}/comp/wins`);

      const listener = onValue(winRef, (snapshot) => {
        if (snapshot.exists()) {
          const winData = snapshot.val();
          setWinCount(winData?.toString() || '0');
        } else {
          setWinCount('0');
        }
      });
      return () => listener();
    } catch (error) {
      console.log('Error loading win count:', error);
    }
  };

  //load loss count
  const loadLossCount = async () => {
    if (!uid) return;

    try {
      const lossRef = ref(db, `users/${uid}/comp/losses`);

      const listener = onValue(lossRef, (snapshot) => {
        if (snapshot.exists()) {
          const lossData = snapshot.val();
          setLossCount(lossData?.toString() || '0');
        } else {
          setLossCount('0');
        }
      });
      return () => listener();
    } catch (error) {
      console.log('Error loading loss count:', error);
    }
  };

  //for removing submission wins
  const removeSubWins = async () => {
    if (!uid) return;

    const winRef = ref(db, `users/${uid}/comp/wins`);
    const subWinsRef = ref(db, `users/${uid}/comp/submissionWins`);

    try {
      //get current values
      const winSnapshot = await get(winRef);
      const subWinSnapshot = await get(subWinsRef);
      
      const currentWins = winSnapshot.exists() ? winSnapshot.val() : 0;
      const currentSubWins = subWinSnapshot.exists() ? subWinSnapshot.val() : 0;
      
      //only decrement if values are greater than 0
      if (currentWins > 0) {
        await set(winRef, currentWins - 1);
      }
      
      if (currentSubWins > 0) {
        await set(subWinsRef, currentSubWins - 1);
      }
      
      //console.log('Removed 1 from wins and submission wins');
    } catch (error) {
      console.log('Error removing wins:', error);
    }
  }
  //for removing points wins
  const removePointsWins = async () => {
    if (!uid) return;

    const winRef = ref(db, `users/${uid}/comp/wins`);
    const pointsWinsRef = ref(db, `users/${uid}/comp/pointsWins`);

    try {
      //get current values
      const winSnapshot = await get(winRef);
      const pointsWinSnapshot = await get(pointsWinsRef);
      
      const currentWins = winSnapshot.exists() ? winSnapshot.val() : 0;
      const currentPointsWins = pointsWinSnapshot.exists() ? pointsWinSnapshot.val() : 0;
      
      //only decrement if values are greater than 0
      if (currentWins > 0) {
        await set(winRef, currentWins - 1);
      }
      
      if (currentPointsWins > 0) {
        await set(pointsWinsRef, currentPointsWins - 1);
      }
      
      //console.log('Removed 1 from wins and submission wins');
    } catch (error) {
      console.log('Error removing wins:', error);
    }
  };
  //for removing loss points 
  const removePointsLoss = async () => {
    if (!uid) return;

    const lossesRef = ref(db, `users/${uid}/comp/losses`);
    const pointsLossesRef = ref(db, `users/${uid}/comp/pointsLosses`);

    try {
      //get current values
      const lossSnapshot = await get(lossesRef);
      const pointsLossesSnapshot = await get(pointsLossesRef);
      
      const currentLosses = lossSnapshot.exists() ? lossSnapshot.val() : 0;
      const currentPointsLosses = pointsLossesSnapshot.exists() ? pointsLossesSnapshot.val() : 0;
      
      //only decrement if values are greater than 0
      if (currentLosses > 0) {
        await set(lossesRef, currentLosses - 1);
      }
      
      if (currentPointsLosses > 0) {
        await set(pointsLossesRef, currentPointsLosses - 1);
      }
      
      //console.log('Removed 1 from wins and submission wins');
    } catch (error) {
      console.log('Error removing wins:', error);
    }
  };
  //for removing submission losses
  const removeSubLoss = async () => {
    if (!uid) return;

    const lossesRef = ref(db, `users/${uid}/comp/losses`);
    const subLossesRef = ref(db, `users/${uid}/comp/submissionLosses`);

    try {
      //get current values
      const lossSnapshot = await get(lossesRef);
      const subLossesSnapshot = await get(subLossesRef);
      
      const currentLosses = lossSnapshot.exists() ? lossSnapshot.val() : 0;
      const currentSubLosses = subLossesSnapshot.exists() ? subLossesSnapshot.val() : 0;
      
      //only decrement if values are greater than 0
      if (currentLosses > 0) {
        await set(lossesRef, currentLosses - 1);
      }
      
      if (currentSubLosses > 0) {
        await set(subLossesRef, currentSubLosses - 1);
      }
      
      //console.log('Removed 1 from wins and submission wins');
    } catch (error) {
      console.log('Error removing wins:', error);
    }
  };

  //load method-specific counts
  const loadMethodCounts = async () => {
    if (!uid) return;

    try {
      const submissionWinsRef = ref(db, `users/${uid}/comp/submissionWins`);
      const pointsWinsRef = ref(db, `users/${uid}/comp/pointsWins`);
      const submissionLossesRef = ref(db, `users/${uid}/comp/submissionLosses`);
      const pointsLossesRef = ref(db, `users/${uid}/comp/pointsLosses`);

      // Load submission wins
      onValue(submissionWinsRef, (snapshot) => {
        setSubmissionWins(snapshot.exists() ? snapshot.val() : 0);
      });

      // Load points wins
      onValue(pointsWinsRef, (snapshot) => {
        setPointsWins(snapshot.exists() ? snapshot.val() : 0);
      });

      // Load submission losses
      onValue(submissionLossesRef, (snapshot) => {
        setSubmissionLosses(snapshot.exists() ? snapshot.val() : 0);
      });

      // Load points losses
      onValue(pointsLossesRef, (snapshot) => {
        setPointsLosses(snapshot.exists() ? snapshot.val() : 0);
      });
    } catch (error) {
      console.log('Error loading method counts:', error);
    }
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
              style={[styles.quickActionButton, {borderRadius: 12}]}
              onPress={navigateToTraining}
            >
              <Text style={styles.quickActionText}>Training Log</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.quickActionButton, {borderRadius: 12}]}
              onPress={navigateToAnalytics}
            >
              <Text style={styles.quickActionText}>View Analytics</Text> 
            </TouchableOpacity>
          </View>

          {/*Quick stats section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Training Stats</Text>
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
          
          {/*Comp stats section*/}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Competition Stats</Text>
            
            {/*Wins container*/}
            <View style={{
              //backgroundColor: '#228B22',
              borderRadius: 12,
              //padding: 15,
              marginBottom: 15
            }}>
              <View style={styles.analyticsContainer}>
                <TouchableOpacity 
                  style={styles.analyticsCard}
                  onPress={() => openModal('win')}
                >
                  <Text style={[styles.analyticsLabel, { fontSize: 10, fontStyle: 'italic' }]}>Add Result</Text>
                  <Text style={[styles.analyticsNumber, { color: '#4CAF50' }]}>{winCount}</Text>
                  <Text style={styles.analyticsLabel}>Wins</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.analyticsCard}
                  onPress={removeSubWins}
                >
                  <Text style={[styles.analyticsLabel, {fontSize: 10, fontStyle: 'italic'}]}>Tap to Decrease</Text>
                  <Text style={[styles.analyticsNumber, { color: '#4CAF50' }]}>{submissionWins}</Text>
                  <Text style={styles.analyticsLabel}>Sub Wins</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.analyticsCard}
                  onPress={removePointsWins}
                >
                  <Text style={[styles.analyticsLabel, {fontSize: 10, fontStyle: 'italic'}]}>Tap to Decrease</Text>
                  <Text style={[styles.analyticsNumber, { color: '#4CAF50' }]}>{pointsWins}</Text>
                  <Text style={styles.analyticsLabel}>Points Wins</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/*Losses container*/}
            <View style={{
              //backgroundColor: '#B22222',
              borderRadius: 12,
              //padding: 15
            }}>
              <View style={styles.analyticsContainer}>
                <TouchableOpacity 
                  style={styles.analyticsCard}
                  onPress={() => openModal('loss')}
                >
                  <Text style={[styles.analyticsLabel, { fontSize: 10, fontStyle: 'italic' }]}>Add Result</Text>
                  <Text style={[styles.analyticsNumber, { color: '#D32F2F' }]}>{lossCount}</Text>
                  <Text style={styles.analyticsLabel}>Losses</Text>
                </TouchableOpacity>
                <TouchableOpacity
                   style={styles.analyticsCard}
                   onPress={removeSubLoss}
                  >
                  <Text style={[styles.analyticsLabel, {fontSize: 10, fontStyle: 'italic'}]}>Tap to Decrease</Text>
                  <Text style={[styles.analyticsNumber, { color: '#D32F2F' }]}>{submissionLosses}</Text>
                  <Text style={styles.analyticsLabel}>Sub Losses</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.analyticsCard}
                  onPress={removePointsLoss}
                >
                  <Text style={[styles.analyticsLabel, {fontSize: 10, fontStyle: 'italic'}]}>Tap to Decrease</Text>
                  <Text style={[styles.analyticsNumber, { color: '#D32F2F' }]}>{pointsLosses}</Text>
                  <Text style={styles.analyticsLabel}>Points Losses</Text>
                </TouchableOpacity>
              </View>
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
              
          <EditCompModal 
            visible={modalVisible}
            resultType={resultType || 'win'}
            onClose={closeModal}
            onSave={onSave}
          />
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
