//@ts-ignore
import { DeleteAccountButtonStyles as styles } from '@/styles/DeleteAccountButton.styles';
import { colors } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { deleteUser, EmailAuthProvider, getAuth, reauthenticateWithCredential, signOut } from "firebase/auth";
import { getDatabase, ref, remove } from "firebase/database";
import React, { useState } from "react";
import {
    Alert,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

const DeleteAccountButton = () => {
    const auth = getAuth();
    const database = getDatabase();
    //this modal shows up for the user to enter password if not recently authenticated
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [pendingDelete, setPendingDelete] = useState(false);

    //deletes the account off of firebase… both the authentication and realtime database
    //only executes once the user is authenticated 
    const actuallyDeleteAccount = async () => {
        const user = auth.currentUser;
        if (!user) {
            console.log('No current user found');
            return;
        }
        
        console.log('Starting account deletion for user:', user.uid);
        
        try {
            //delete all user data
            const userRef = ref(database, `users/${user.uid}`);
            await remove(userRef);
            console.log('User data deleted from database');
            
            //delete Firebase Authentication account
            await deleteUser(user);
            console.log('User account deleted from authentication');
            
            //sign out the user after deletion
            await signOut(auth);
            console.log('User signed out successfully');
            
        } catch (error: any) {
            console.log('Error during account deletion:', error.code, error.message);
            
            if (error.code === 'auth/requires-recent-login') {
                console.log('Requires recent login, showing password modal');
                setShowPasswordModal(true);
                setPendingDelete(true);
            } else {
                Alert.alert('Error', `Failed to delete account: ${error.message}`);
            }
        }
    };

    //this is handling reauthentication
    const handleReauthAndDelete = async () => {
        setError("");
        const user = auth.currentUser; //takes the email and password
        if (!user || !user.email) {
            setError("User not found or missing email.");
            return;
        }
        try {
            //tries to reauthenticate the user with the email and entered password
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);
            setShowPasswordModal(false);
            setPassword("");
            setPendingDelete(false);
            
            //now try to delete the account again
            await actuallyDeleteAccount();
        } catch (err: any) {
            setError(err.message || "Re-authentication failed.");
        }
    };

    //delete confirmation function
    const confirmDelete = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account and all associated data? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => {
                    setPendingDelete(true);
                    actuallyDeleteAccount();
                }},
            ]
        );
    };

    return (
        <>
            <TouchableOpacity
                onPress={confirmDelete}
                style={[styles.deleteAccount, { alignItems: 'center', paddingTop: 10 }]}
            >
                <Text style={styles.deleteAccountText}>Delete Account</Text>
            </TouchableOpacity>
            <Modal
                visible={showPasswordModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowPasswordModal(false)}
            >
                <View style={styles.bkgContainer}>
                    <View style={styles.container}>
                        <Text style={styles.passwordTitle}>Re-enter Password</Text>
                        <Text style={styles.modalDescription}>For security, please enter your password to confirm account deletion.</Text>
                        <View style={{ position: 'relative', marginBottom: 12 }}>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Password..."
                                placeholderTextColor={colors.gray400}
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                                autoFocus
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eye}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={22}
                                    color={colors.gray400}
                                />
                            </TouchableOpacity>
                        </View>
                        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity 
                                onPress={() => { setShowPasswordModal(false); setPassword(""); setError(""); setPendingDelete(false); }} 
                                style={styles.cancelButton}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleReauthAndDelete} style={styles.deleteConfirmButton}>
                                <Text style={styles.deleteConfirmButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

export default DeleteAccountButton; 