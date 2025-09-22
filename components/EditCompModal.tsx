import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface EditCompModalProps {
  visible: boolean;
  resultType: 'win' | 'loss';
  onClose: () => void;
  onSave: (method: 'points' | 'submission') => void;
}

const EditCompModal: React.FC<EditCompModalProps> = ({
  visible,
  resultType,
  onClose,
  onSave
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'points' | 'submission' | null>(null);

  const handleSave = () => {
    if (selectedMethod) {
      onSave(selectedMethod);
      setSelectedMethod(null);
      onClose();
    }
  };

  const closeModal = () => {
    setSelectedMethod(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={closeModal}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <View style={{
          width: '80%',
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 15,
          alignItems: 'center'
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
            Add {resultType === 'win' ? 'Win' : 'Loss'}
          </Text>

          <Text style={{ fontSize: 16, marginBottom: 15, textAlign: 'center' }}>
            {resultType === 'win' ? 'How did you win?' : 'How did you lose?'}
          </Text>

          <View style={{ width: '100%', marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => setSelectedMethod('points')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 15,
                borderWidth: 1,
                borderColor: selectedMethod === 'points' ? '#4CAF50' : '#ccc',
                borderRadius: 8,
                marginBottom: 10,
                backgroundColor: selectedMethod === 'points' ? '#E8F5E8' : 'white'
              }}
            >
              <View style={{
                width: 20,
                height: 20,
                borderWidth: 2,
                borderColor: selectedMethod === 'points' ? '#4CAF50' : '#ccc',
                borderRadius: 10,
                marginRight: 12,
                backgroundColor: selectedMethod === 'points' ? '#4CAF50' : 'white',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedMethod === 'points' && (
                  <View style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'white'
                  }} />
                )}
              </View>
              <Text style={{ fontSize: 16, color: selectedMethod === 'points' ? '#4CAF50' : '#333' }}>
                By Points
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedMethod('submission')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 15,
                borderWidth: 1,
                borderColor: selectedMethod === 'submission' ? '#4CAF50' : '#ccc',
                borderRadius: 8,
                backgroundColor: selectedMethod === 'submission' ? '#E8F5E8' : 'white'
              }}
            >
              <View style={{
                width: 20,
                height: 20,
                borderWidth: 2,
                borderColor: selectedMethod === 'submission' ? '#4CAF50' : '#ccc',
                borderRadius: 10,
                marginRight: 12,
                backgroundColor: selectedMethod === 'submission' ? '#4CAF50' : 'white',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedMethod === 'submission' && (
                  <View style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'white'
                  }} />
                )}
              </View>
              <Text style={{ fontSize: 16, color: selectedMethod === 'submission' ? '#4CAF50' : '#333' }}>
                By Submission
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', gap: 15 }}>
            <TouchableOpacity
              onPress={handleSave}
              style={{
                backgroundColor: selectedMethod ? '#4CAF50' : '#ccc',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8
              }}
              disabled={!selectedMethod}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={closeModal}
              style={{
                backgroundColor: '#ccc',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8
              }}
            >
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditCompModal;
