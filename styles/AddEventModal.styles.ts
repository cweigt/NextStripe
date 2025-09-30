import { StyleSheet } from 'react-native';

export const AddEventModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  timeTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  timeDisplayButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 10,
  },
  cancelBtn: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },
  cancelBtnText: {
    color: '#111827',
    fontWeight: '600',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  btnText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: '#fff',
  },
  recurringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
  },
  recurringText: {
    fontSize: 16,
    color: '#374151',
  },
  recurringOptions: {
    marginTop: 8,
    marginBottom: 12,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  dropdownPlaceholder: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  dropdownSelectedText: {
    color: '#111827',
    fontSize: 16,
  },
  dropdownItemText: {
    color: '#111827',
    fontSize: 16,
  },
  datePickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  datePicker: {
    width: '100%',
  },
  
  // Video Modal Styles
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cancelButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  saveButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  videoPickerButton: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  selectedVideoContainer: {
    alignItems: 'center',
  },
  selectedVideoText: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '600',
    marginBottom: 4,
  },
  selectedVideoSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  progressText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  categoryButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  categoryButtonTextSelected: {
    color: '#fff',
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  difficultyButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  difficultyButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  difficultyButtonTextSelected: {
    color: '#fff',
  },
});


