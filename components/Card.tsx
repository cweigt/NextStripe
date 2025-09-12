import EditSessionModal from '@/components/EditSessionModal';
import StarRating from '@/components/StarRating';
import { auth, db } from '@/firebase';
import { CardStyles as styles } from '@/styles/Card.styles';
import { Ionicons } from '@expo/vector-icons';
import { ref, remove, set } from 'firebase/database';
import React, { useState } from 'react';
import {
  Alert,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const TrainingCard = ({ session, sessionId, onDelete, onUpdate }) => {
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const totalDuration = 0; //used to add up the total amount of hours trained
    //session.notes

    //this is for the edit one
    const openModalEdit = () => {
      setIsEditModalVisible(true);
    };

    const closeModalEdit = () => {
      //console.log('Closing modal, setting isModalVisible to false');
      setIsEditModalVisible(false);
    };
    const deleteLog = async () => {
        const user = auth.currentUser;
        if (!user) return;
        try {
            //console.log('Deleting session with ID:', sessionId);
            //console.log('Session data:', session);
            
            //delete specific session
            const sessionRef = ref(db, `users/${user.uid}/sessions/${sessionId}`);
            await remove(sessionRef);
            
            //console.log('Successfully deleted from Firebase');
            
            //call the parent's onDelete function to update local state
            if (onDelete) {
                onDelete(sessionId);
            }
            
            //show success message
            SuccessAlert();

        } catch (error: any) {
            console.log('Error deleting session:', error);
        }
    };

    //success alert to know when card is removed off of firebase to avoid any issues
    const SuccessAlert = () => {
        Alert.alert(
            'Success',
            'Training session has been successfully deleted.',
            [
                { text: 'OK', style: 'default' },
            ]
        );
    };
    //delete confirmation function for user safety
    const confirmDelete = () => {
        Alert.alert(
            'Delete Session',
            'Are you sure you want to delete this training session? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: deleteLog },
            ]
        );
    };

    //this function is passed to editSessionModal so it can update the existing session
    const handleUpdateSession = async (sessionData) => {
      const user = auth.currentUser;
      if (!user) return;
      
      try {
        //console.log('Updating session data:', sessionData);
        
        //update the existing session in Firebase
        const sessionRef = ref(db, `users/${user.uid}/sessions/${sessionId}`);
        await set(sessionRef, {
          title: sessionData.title,
          date: sessionData.date,
          duration: sessionData.duration,
          notes: sessionData.notes,
          qualityLevel: sessionData.qualityLevel,
          tags: sessionData.tags || [], //fetching all of the session data from firebase for the card
        });
        
        //console.log('Session updated successfully');
        
        //update local state in parent component
        if (onUpdate) {
          onUpdate(sessionId, sessionData);
        }
        
      } catch (error) {
        console.log('Error updating session:', error);
      }
    };
    return (
      <>
        <View style={styles.section}>
            <View style={styles.logsContainer}>
                
              <TouchableOpacity 
                style={styles.logCard}
                onPress={openModalEdit}
              >
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={styles.logDetails}>{session.date}</Text>
                  <TouchableOpacity onPress={confirmDelete}>
                    <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.logTitle}>{session.title}</Text>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={styles.logDetails}>Duration: {session.duration} hours</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.logDetails}>Quality: </Text>
                  <StarRating 
                    rating={parseFloat(session.qualityLevel) || 0} 
                    maxRating={10}
                    starSize={14}
                    showRating={false}
                  />
                </View>

                {session.tags && session.tags.length > 0 && (
                  //this uses the session.tags "import" to loop through what is in Firebase and displays it
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                    {session.tags.map((tag) => (
                      <View key={tag} style={styles.tagDisplay}>
                        <Text style={styles.tagDisplayText}>
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>

            </View>
          </View>

          <EditSessionModal
            isVisible={isEditModalVisible}
            onClose={closeModalEdit}
            onUpdate={handleUpdateSession}
            session={session} //this carries in all the session data from the set/ref above
          />
      </>
    );
};

export default TrainingCard;