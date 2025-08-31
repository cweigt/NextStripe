import { Text, View } from "react-native";
// @ts-ignore
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebase';
import { GraphsStyles as styles } from '@/styles/Graphs.styles';
import buildTagData from '@/utils/TagData';
import { get, ref } from 'firebase/database';
import { useEffect, useMemo, useState } from "react";

const BarChartTAGS = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState([])

    type Session = {
        id: string;
        tags?: string[] | Record<string, string>;
      };

    useEffect(() => {
        loadSessions();
    }, [user]);

    const loadSessions = async () => {
        if(!user?.uid) return;

        const sessionRef = ref(db, `users/${user.uid}/sessions`);

        const sessionSnapshot = await get(sessionRef);

        if(sessionSnapshot.exists()){
            const raw = sessionSnapshot.val() as Record<string, any>;
            const sessionsArray: Session[] = Object.entries(raw).map(([id, session]: [string, any]) => ({
              id,
              ...session,
              }));
        setSessions(sessionsArray);
        } else {
            setSessions([]);
        }
    };

    //useMemo allows us to cache result of a calculation in between re-renders
    const DATA = useMemo(() => {
        const result = buildTagData(sessions);
        return result;
    }, [sessions]);

    return (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Technique Stats</Text>
      
          {/* Conditional subtitle */}
          {DATA.length === 0 && (
            <Text style={styles.subtitle}>Nothing to see here!</Text>
          )}
      
          {DATA.map((item, index) => {
            const maxCount = Math.max(...DATA.map(d => d.count));
            const barWidth = (item.count / maxCount) * 200; // 200 is max bar width
      
            return (
              <View key={index} style={styles.barItem}>
                <View style={styles.barHeader}>
                  <Text style={styles.barLabel}>
                    <Text style={styles.tagBold}>{item.tag}</Text>
                    {`: ${item.count}`}
                  </Text>
                </View>
                <View style={styles.barBackground}>
                  <View style={[styles.barFill, { width: barWidth }]} />
                </View>
              </View>
            );
          })}
        </View>
      );
      
};

export default BarChartTAGS;