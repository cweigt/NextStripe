import { CardStyles as styles } from '@/styles/Card.styles';
import React from 'react';
import {
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const TrainingCard = ({ session }) => {
    const totalDuration = 0; //used to add up the total amount of hours trained
    //session.notes

    return (
        <View style={styles.section}>
            <View style={styles.logsContainer}>
                
              <TouchableOpacity style={styles.logCard}>
                <Text style={styles.logDate}>{session.date}</Text>
                <Text style={styles.logTitle}>{session.title}</Text>
                <Text style={styles.logDetails}>Duration: {session.duration} hours</Text>
                
              </TouchableOpacity>

            </View>
          </View>
    );
};

export default TrainingCard;