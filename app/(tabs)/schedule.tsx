import { ScheduleStyles as styles } from '@/styles/Schedule.styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Swiper from 'react-native-swiper';

import AddEventModal from '@/components/AddEventModal';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebase';
import { ref as dbRef, onValue, push, remove, set } from 'firebase/database';

type CalendarEvent = {
  id: string;
  title: string;
  startISO: string;
  endISO?: string;
  notes?: string;
  createdAt: string;
};

const dateKey = (d: Date) => moment(d).format('YYYY-MM-DD');
const toTime = (iso: string) => moment(iso).format('h:mm A');



/** ---------- Schedule Screen ---------- */
const Schedule = () => {
  const { user } = useAuth();
  const swiper = useRef<any>(null);
  const contentSwiper = useRef<any>(null);
  const [week, setWeek] = useState(0);
  const [value, setValue] = useState(new Date());

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [eventDays, setEventDays] = useState<Record<string, number>>({});

  const weeks = useMemo(() => {
    const start = moment().add(week, 'weeks').startOf('week');
    return [-1, 0, 1].map(adj =>
      Array.from({ length: 7 }).map((_, index) => {
        const date = moment(start).add(adj, 'week').add(index, 'day');
        return { weekday: date.format('ddd'), date: date.toDate() };
      }),
    );
  }, [week]);

  const days = useMemo(() => [
    moment(value).subtract(1, 'day').toDate(),
    value,
    moment(value).add(1, 'day').toDate(),
  ], [value]);

  //live-load events for the selected date
  useEffect(() => {
    if (!user?.uid) return;
    const k = dateKey(value);
    const r = dbRef(db, `users/${user.uid}/schedule/${k}`);
    const unsub = onValue(r, (snap) => {
      const raw = snap.val() as Record<string, Omit<CalendarEvent, 'id'>> | null;
      if (!raw) { setEvents([]); return; }
      const list: CalendarEvent[] = Object.entries(raw).map(([id, ev]) => ({ id, ...(ev as any) }));
      list.sort((a, b) => moment(a.startISO).valueOf() - moment(b.startISO).valueOf());
      setEvents(list);
    });
    return () => unsub();
  }, [user?.uid, value]);

  // track which dates have events for dot indicators
  useEffect(() => {
    if (!user?.uid) return;
    const r = dbRef(db, `users/${user.uid}/schedule`);
    const unsub = onValue(r, (snap) => {
      const all = snap.val() as Record<string, Record<string, Omit<CalendarEvent, 'id'>>> | null;
      if (!all) { setEventDays({}); return; }
      const counts: Record<string, number> = {};
      Object.entries(all).forEach(([k, day]) => {
        counts[k] = day ? Object.keys(day).length : 0;
      });
      setEventDays(counts);
    });
    return () => unsub();
  }, [user?.uid]);

  // ➕ Save event from modal
  const saveEvent = useCallback(async ({ title, time }: { title: string; time: Date }) => {
    if (!user?.uid) return;

    // Combine selected day with chosen time
    const start = new Date(value);
    start.setHours(time.getHours(), time.getMinutes(), 0, 0);

    //storing in firebase
    const k = dateKey(value);
    const path = `users/${user.uid}/schedule/${k}`;
    const newRef = push(dbRef(db, path));
    const payload: Omit<CalendarEvent, 'id'> = {
      title,
      startISO: start.toISOString(),
      createdAt: new Date().toISOString(),
    };

    await set(newRef, payload);
    setShowAdd(false);
  }, [user?.uid, value]);

  // 🗑️ Delete an event
  const handleDelete = useCallback(async (id: string) => {
    if (!user?.uid) return;
    const k = dateKey(value);
    await remove(dbRef(db, `users/${user.uid}/schedule/${k}/${id}`));
  }, [user?.uid, value]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Schedule</Text>
        </View>

        {/* Week picker */}
        <View style={styles.picker}>
          <Swiper
            index={1}
            ref={swiper}
            loop={false}
            showsPagination={false}
            onIndexChanged={ind => {
              if (ind === 1) return;
              const index = ind - 1;
              const next = moment(value).add(index, 'week').toDate();
              setValue(next);
              setTimeout(() => {
                setWeek(week + index);
                swiper.current?.scrollBy(-index, false);
              }, 10);
            }}
          >
            {weeks.map((dates, i) => (
              <View style={styles.itemRow} key={i}>
                {dates.map((item, j) => {
                  const isActive = value.toDateString() === item.date.toDateString();
                  const k = dateKey(item.date);
                  return (
                    <TouchableWithoutFeedback key={j} onPress={() => setValue(item.date)}>
                      <View style={[styles.item, isActive && { backgroundColor: '#007AFF', borderColor: '#007AFF' }]}>
                        <Text style={[styles.itemWeekday, isActive && { color: '#fff' }]}>{item.weekday}</Text>
                        <Text style={[styles.itemDate, isActive && { color: '#fff' }]}>{item.date.getDate()}</Text>
                        {Boolean(eventDays[k]) && (
                          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: isActive ? '#fff' : '#007AFF', alignSelf: 'center', marginTop: 4 }} />
                        )}
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </View>
            ))}
          </Swiper>
        </View>

        {/* Day content */}
        <Swiper
          index={1}
          ref={contentSwiper}
          loop={false}
          showsPagination={false}
          onIndexChanged={ind => {
            if (ind === 1) return;
            setTimeout(() => {
              const offset = ind - 1;
              const nextValue = moment(value).add(offset, 'days');
              if (moment(value).week() !== nextValue.week()) {
                setWeek(moment(value).isBefore(nextValue) ? week + 1 : week - 1);
              }
              setValue(nextValue.toDate());
              contentSwiper.current?.scrollBy(-offset, false);
            }, 10);
          }}
        >
          {days.map((day, index) => {
            const k = dateKey(day);
            const isSelected = dateKey(value) === k;
            return (
              <View key={index} style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 24 }}>
                <Text style={styles.subtitle}>
                  {day.toLocaleDateString('en-US', { dateStyle: 'full' })}
                </Text>

                <View style={[styles.placeholder, { padding: 12 }]}>
                  <FlatList
                    data={isSelected ? events : []}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={
                      <Text style={{ opacity: 0.6, textAlign: 'center', paddingVertical: 24 }}>
                        No events for this day.
                      </Text>
                    }
                    renderItem={({ item }) => (
                      <View style={styles.placeholderInset}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: '600' }}>{item.title}</Text>
                            <Text style={{ opacity: 0.7 }}>{toTime(item.startISO)}</Text>
                          </View>
                          <TouchableOpacity onPress={() => handleDelete(item.id)}>
                            <MaterialCommunityIcons color='red' name="trash-can-outline" size={20} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  />
                </View>
              </View>
            );
          })}
        </Swiper>

        {/* Footer: open modal */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => setShowAdd(true)}>
            <View style={styles.btn}>
              <MaterialCommunityIcons color="#fff" name="plus" size={22} style={{ marginRight: 6 }} />
              <Text style={styles.btnText}>Add Event</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Event Modal */}
      <AddEventModal
        visible={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={saveEvent}
        defaultDate={value}
      />
    </SafeAreaView>
  );
};

export default Schedule;
