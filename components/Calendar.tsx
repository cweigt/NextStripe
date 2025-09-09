import { colors } from '@/styles/theme';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';

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

  // Keep internal state in sync when controlled prop changes
  useEffect(() => {
    if (selectedProp) {
      setInternalSelected(selectedProp);
    }
  }, [selectedProp]);

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
