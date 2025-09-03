import { colors } from '@/styles/theme';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';

type DateObject = {
  dateString: string; day: number; month: number; year: number; timestamp: number;
};

const CalendarComp = () => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const [selected, setSelected] = useState<string>(today);

  return (
    <View>
      <Calendar
        current={selected || today}
        minDate="2022-01-01"
        maxDate="2035-12-31"
        markedDates={{
          [selected]: { selected: true, selectedColor: colors.primary },
        }}
        onDayPress={(day: DateObject) => {
          setSelected(day.dateString);
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
