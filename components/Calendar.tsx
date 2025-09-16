import { colors } from '@/styles/theme';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';

type CalendarEvent = {
  id: string;
  title: string;
  startISO: string;
  endISO?: string;
  notes?: string;
  createdAt: string;
  recurring?: boolean;
  recurrenceType?: 'weekly' | 'daily' | 'monthly' | 'none';
  recurrenceEndDate?: string;
  parentEventId?: string;
  isRecurringInstance?: boolean;
};

type DateObject = {
  dateString: string; day: number; month: number; year: number; timestamp: number;
};

type CalendarProps = {
  selected?: string;
  onSelect?: (dateString: string) => void;
};

const CalendarComp = ({ selected: selectedProp, onSelect }: CalendarProps) => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const [internalSelected, setInternalSelected] = useState<string>(selectedProp || today);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Keep internal state in sync when controlled prop changes
  useEffect(() => {
    if (selectedProp) {
      setInternalSelected(selectedProp);
    }
  }, [selectedProp]);

  // Function to process events for markedDates
  const processEventsForMarkedDates = (rawEvents: CalendarEvent[]) => {
    const markedDates: any = {};
    
    rawEvents.forEach(event => {
      const dateKey = event.startISO.split('T')[0]; // Get YYYY-MM-DD
      markedDates[dateKey] = {
        marked: true,
        dotColor: event.isRecurringInstance ? '#4CAF50' : '#2196F3',
        // Add custom styling for recurring events
        ...(event.isRecurringInstance && { 
          customStyles: {
            container: {
              backgroundColor: '#4CAF50',
              borderRadius: 4,
            },
            text: {
              color: 'white',
              fontWeight: 'bold',
            }
          }
        })
      };
    });
    
    return markedDates;
  };
  

  const selected = selectedProp ?? internalSelected;

  return (
    <View
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 8,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      <Calendar
        current={selected || today}
        minDate="2022-01-01"
        maxDate="2035-12-31"
        markedDates={{
          [selected]: { selected: true, selectedColor: colors.primary },
          ...processEventsForMarkedDates(events),
        }}
        onDayPress={(day: DateObject) => {
          if (onSelect) {
            onSelect(day.dateString);
          } else {
            setInternalSelected(day.dateString);
          }
        }}
        theme={{
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: colors.white,
          todayTextColor: colors.textPrimary,
          dayTextColor: colors.textPrimary,
          arrowColor: colors.primary,
        }}
        enableSwipeMonths
      />
    </View>
  );
};

export default CalendarComp;
