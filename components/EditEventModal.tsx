import { AddEventModalStyles as styles } from '@/styles/AddEventModal.styles';
import DatePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    Keyboard,
    Modal,
    Platform,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  parentEventId?: string;
  isRecurringInstance?: boolean;
};

type EditEventModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (payload: { 
    id: string;
    title: string; 
    time: Date;
    recurring?: boolean;
    recurrenceType?: 'weekly' | 'daily' | 'monthly' | 'yearly' | 'none';
    recurrenceEndDate?: Date | null;
  }) => void;
  onDelete: (id: string) => void;
  event: CalendarEvent | null;
};

const EditEventModal: React.FC<EditEventModalProps> = ({
  visible,
  onClose,
  onSave,
  onDelete,
  event,
}) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState<Date>(new Date());
  const [timeText, setTimeText] = useState('');
  const [showNativePicker, setShowNativePicker] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<'weekly' | 'daily' | 'monthly' | 'yearly' | 'none'>('none');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | null>(null);

  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(0)).current;

  // Initialize form with event data
  useEffect(() => {
    if (event && visible) {
      setTitle(event.title);
      const eventTime = new Date(event.startISO);
      setTime(eventTime);
      setTimeText(moment(eventTime).format('HH:mm'));
      setRecurring(event.recurring || false);
      setRecurrenceType(event.recurrenceType || 'none');
      setRecurrenceEndDate(event.recurrenceEndDate ? new Date(event.recurrenceEndDate) : null);
    }
  }, [event, visible]);

  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: any) => {
      const h = e?.endCoordinates?.height ?? 0;
      const target = -Math.max(0, h - (insets?.bottom ?? 0));
      Animated.timing(translateY, {
        toValue: target,
        duration: e?.duration ?? 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    };
    const onHide = (e: any) => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: e?.duration ?? 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    };

    const s = Keyboard.addListener(showEvt, onShow);
    const hSub = Keyboard.addListener(hideEvt, onHide);
    return () => {
      s.remove();
      hSub.remove();
    };
  }, [translateY, insets.bottom]);

  const onChangeTime = (_: any, selected?: Date) => {
    setShowNativePicker(false);
    if (selected) {
      setTime(selected);
      setTimeText(moment(selected).format('HH:mm'));
    }
  };

  const onBlurTimeText = () => {
    if (!timeText) return;
    const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.test(timeText);
    if (!match) return;
    const [h, m] = timeText.split(':').map(Number);
    const d = new Date(time);
    d.setHours(h, m, 0, 0);
    setTime(d);
  };

  const handleSave = () => {
    if (!event) return;
    onSave({
      id: event.id,
      title: title.trim(),
      time,
      recurring,
      recurrenceType,
      recurrenceEndDate
    });
  };

  const handleDelete = () => {
    if (!event) return;
    onDelete(event.id);
  };

  const disabled = title.trim().length === 0;

  if (!event) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="overFullScreen"
      transparent
      hardwareAccelerated
      onRequestClose={onClose}
    >
      {/* Dim backdrop */}
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
        </TouchableWithoutFeedback>

        {/* Bottom sheet */}
        <Animated.View
          style={[
            styles.sheet,
            {
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              minHeight: 320,
              maxHeight: '75%',
              transform: [{ translateY }],
            },
          ]}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 16, paddingTop: 12 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === 'ios' ? 'on-drag' : 'none'}
          >
            <Text style={styles.title}>Edit Event</Text>

            <Text style={styles.label}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              returnKeyType="done"
            />

            <Text style={styles.label}>Time</Text>
            <View style={styles.timeRow}>
              <TextInput
                value={timeText}
                onChangeText={setTimeText}
                onBlur={onBlurTimeText}
                placeholder="HH:mm"
                placeholderTextColor="#9CA3AF"
                keyboardType="numbers-and-punctuation"
                autoCapitalize="none"
                style={styles.timeTextInput}
                returnKeyType="done"
              />
              <TouchableOpacity
                onPress={() => setShowNativePicker(true)}
                style={styles.timeDisplayButton}
              >
                <Text>{moment(time).format('h:mm A')}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Repeat Event</Text>
            <View style={styles.recurringRow}>
              <Text style={styles.recurringText}>Repeat this event</Text>
              <Switch 
                value={recurring} 
                onValueChange={setRecurring}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor={recurring ? '#FFFFFF' : '#F3F4F6'}
              />
            </View>
            
            {recurring && (
              <View style={styles.recurringOptions}>
                <Text style={styles.label}>Frequency</Text>
                <Dropdown
                  data={[
                    { label: 'Weekly', value: 'weekly' },
                    { label: 'Daily', value: 'daily' },
                    { label: 'Monthly', value: 'monthly' }
                  ]}
                  value={recurrenceType}
                  onChange={item => setRecurrenceType(item.value as any)}
                  labelField="label"
                  valueField="value"
                  placeholder="Select frequency"
                  style={styles.dropdown}
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownSelectedText}
                  itemTextStyle={styles.dropdownItemText}
                />
                
                <Text style={styles.label}>End Date (Optional)</Text>
                <View style={styles.datePickerContainer}>
                  <DatePicker
                    value={recurrenceEndDate || new Date()}
                    onChange={(event, selectedDate) => {
                      if (selectedDate) {
                        setRecurrenceEndDate(selectedDate);
                      }
                    }}
                    mode="date"
                    display="default"
                    style={styles.datePicker}
                  />
                </View>
              </View>
            )}

            <View style={styles.actionsRow}>
              <TouchableOpacity onPress={handleDelete} style={[styles.cancelBtn, { backgroundColor: '#EF4444' }]}>
                <Text style={[styles.cancelBtnText, { color: '#FFFFFF' }]}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={disabled}
                onPress={handleSave}
                style={[styles.btn, disabled && { opacity: 0.5 }]}
              >
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default EditEventModal;
