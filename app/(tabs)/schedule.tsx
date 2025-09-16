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
import EditEventModal from '@/components/EditEventModal';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebase';
import { ref as dbRef, endAt, equalTo, get, onValue, orderByChild, push, query, ref, remove, set, startAt } from 'firebase/database';

type CalendarEvent = {
  id: string;
  title: string;
  startISO: string;
  endISO?: string;
  notes?: string;
  createdAt: string;

  recurring?: boolean;
  recurrenceType?: 'weekly' | 'daily' | 'monthly' | 'yearly' | 'none';
  recurrenceEndDate?: string;
  parentEventId?: string; //linking recurring instances to original
  isRecurringInstance?: boolean; //to see if this is not an original instance
};

// Event item component
const EventItem = ({ event }: { event: CalendarEvent }) => {
  return (
    <View style={styles.eventItem}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        {event.isRecurringInstance && (
          <Text style={styles.recurringIcon}>🔄</Text>
        )}
      </View>
      <Text style={styles.eventTime}>{toTime(event.startISO)}</Text>
      {event.isRecurringInstance && (
        <Text style={styles.recurringText}>Recurring Event</Text>
      )}
    </View>
  );
};

const dateKey = (d: Date) => moment(d).format('YYYY-MM-DD');
const toTime = (iso: string) => moment(iso).format('h:mm A');

// Generate recurring events
const generateRecurringEvents = ({
  title,
  startDate,
  recurrenceType,
  recurrenceEndDate,
  userUid
}: {
  title: string;
  startDate: Date;
  recurrenceType: 'weekly' | 'daily' | 'monthly' | 'yearly';
  recurrenceEndDate: Date;
  userUid: string;
}) => {
  const events: Array<{ startDate: Date; payload: Omit<CalendarEvent, 'id'> }> = [];
  const parentEventId = `parent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  let currentDate = moment(startDate);
  const endDate = moment(recurrenceEndDate);
  
  // Add the original event
  events.push({
    startDate: startDate,
    payload: {
      title,
      startISO: startDate.toISOString(),
      createdAt: new Date().toISOString(),
      recurring: true,
      recurrenceType,
      recurrenceEndDate: recurrenceEndDate.toISOString(),
      parentEventId,
      isRecurringInstance: false, // This is the original event
    }
  });
  
  // Generate recurring instances
  while (currentDate.isBefore(endDate)) {
    let nextDate: moment.Moment;
    
    switch (recurrenceType) {
      case 'daily':
        nextDate = currentDate.clone().add(1, 'day');
        break;
      case 'weekly':
        nextDate = currentDate.clone().add(1, 'week');
        break;
      case 'monthly':
        nextDate = currentDate.clone().add(1, 'month');
        break;
      case 'yearly':
        nextDate = currentDate.clone().add(1, 'year');
        break;
      default:
        nextDate = currentDate.clone().add(1, 'day');
    }
    
    if (nextDate.isAfter(endDate)) break;
    
    const nextStartDate = nextDate.toDate();
    nextStartDate.setHours(startDate.getHours(), startDate.getMinutes(), 0, 0);
    
    events.push({
      startDate: nextStartDate,
      payload: {
        title,
        startISO: nextStartDate.toISOString(),
        createdAt: new Date().toISOString(),
        recurring: true,
        recurrenceType,
        recurrenceEndDate: recurrenceEndDate.toISOString(),
        parentEventId,
        isRecurringInstance: true, // This is a recurring instance
      }
    });
    
    currentDate = nextDate;
  }
  
  return events;
};

const Schedule = () => {
  const { user } = useAuth();

  // Function to get events for a date range
  const getEventsForDateRange = async (startDate: Date, endDate: Date) => {
    const eventsRef = ref(db, `users/${user.uid}/events`);
    const snapshot = await get(query(eventsRef, 
      orderByChild('date'),
      startAt(startDate.toISOString()),
      endAt(endDate.toISOString())
    ));
    
    return snapshot.val() || {};
  };

  // Function to get recurring events
  const getRecurringEvents = async (parentEventId: string) => {
    const eventsRef = ref(db, `users/${user.uid}/events`);
    const snapshot = await get(query(eventsRef, 
      orderByChild('parentEventId'),
      equalTo(parentEventId)
    ));
    
    return snapshot.val() || {};
  };
  const swiper = useRef<any>(null);
  const contentSwiper = useRef<any>(null);
  const [week, setWeek] = useState(0);
  const [value, setValue] = useState(new Date());

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
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
  const saveEvent = useCallback(async ({ 
    title, 
    time, 
    recurring, 
    recurrenceType, 
    recurrenceEndDate 
  }: { 
    title: string; 
    time: Date;
    recurring?: boolean;
    recurrenceType?: 'weekly' | 'daily' | 'monthly' | 'yearly' | 'none';
    recurrenceEndDate?: Date | null;
  }) => {
    if (!user?.uid) return;

    // Combine selected day with chosen time
    const start = new Date(value);
    start.setHours(time.getHours(), time.getMinutes(), 0, 0);

    if (recurring && recurrenceType && recurrenceType !== 'none') {
      // Generate recurring events
      const events = generateRecurringEvents({
        title,
        startDate: start,
        recurrenceType,
        recurrenceEndDate: recurrenceEndDate || moment().add(1, 'year').toDate(), // Default to 1 year if no end date
        userUid: user.uid
      });

      // Save all recurring events
      for (const event of events) {
        const k = dateKey(event.startDate);
        const path = `users/${user.uid}/schedule/${k}`;
        const newRef = push(dbRef(db, path));
        await set(newRef, event.payload);
      }
    } else {
      // Single event
      const k = dateKey(value);
      const path = `users/${user.uid}/schedule/${k}`;
      const newRef = push(dbRef(db, path));
      const payload: Omit<CalendarEvent, 'id'> = {
        title,
        startISO: start.toISOString(),
        createdAt: new Date().toISOString(),
        recurring,
        recurrenceType,
        recurrenceEndDate: recurrenceEndDate?.toISOString(),
      };

      await set(newRef, payload);
    }

    setShowAdd(false);
  }, [user?.uid, value]);

  //Delete an event
  const handleDelete = useCallback(async (id: string) => {
    if (!user?.uid) return;
    const k = dateKey(value);
    await remove(dbRef(db, `users/${user.uid}/schedule/${k}/${id}`));
  }, [user?.uid, value]);

  
  //Update an event
  const handleUpdateEvent = useCallback(async ({ id, title, time, recurring, recurrenceType, recurrenceEndDate }: {
    id: string;
    title: string;
    time: Date;
    recurring?: boolean;
    recurrenceType?: 'weekly' | 'daily' | 'monthly' | 'none';
    recurrenceEndDate?: Date | null;
  }) => {
    if (!user?.uid) return;

    const start = new Date(value);
    start.setHours(time.getHours(), time.getMinutes(), 0, 0);

    const k = dateKey(value);
    const path = `users/${user.uid}/schedule/${k}/${id}`;
    const payload: Partial<CalendarEvent> = {
      title,
      startISO: start.toISOString(),
      recurring,
      recurrenceType,
      recurrenceEndDate: recurrenceEndDate?.toISOString(),
    };

    await set(dbRef(db, path), payload);
    setEditingEvent(null);
  }, [user?.uid, value]);

  //Delete from edit modal
  const handleDeleteFromEdit = useCallback(async (id: string) => {
    await handleDelete(id);
    setEditingEvent(null);
  }, [handleDelete]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {user ? (
      <>
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
                      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                      ListEmptyComponent={
                        <Text style={{ opacity: 0.6, textAlign: 'center', paddingVertical: 24 }}>
                          No events for this day.
                        </Text>
                      }
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => setEditingEvent(item)}>
                          <View style={styles.placeholderInset}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                              <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: '600' }}>{item.title}</Text>
                                <Text style={{ opacity: 0.7 }}>{toTime(item.startISO)}</Text>
                              </View>
                              <TouchableOpacity onPress={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id);
                              }}>
                                <MaterialCommunityIcons color='red' name="trash-can-outline" size={20} />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </TouchableOpacity>
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

        {/* Edit Event Modal */}
        <EditEventModal
          visible={!!editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={handleUpdateEvent}
          onDelete={handleDeleteFromEdit}
          event={editingEvent}
        />
      </>
        ) : (
          <View style={[styles.container1, {justifyContent: 'center', alignItems: 'center', marginTop: 340}]}>
            <Text>Please sign in to view this page.</Text>
          </View>
        )}
    </SafeAreaView>
  );
};



export default Schedule;
