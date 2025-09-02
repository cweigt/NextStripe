import { StyleSheet } from 'react-native';

export const VoiceStyles = StyleSheet.create({
  imessageMicBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imessageMicBtnActive: {
    backgroundColor: '#007AFF',
  },
});
