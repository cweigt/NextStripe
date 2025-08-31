import { auth } from '@/firebase';
import { SignUpStyles as styles } from '@/styles/SignUp.styles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { colors } from '../styles/theme';

const Sign_Up = ({ setUser }) => {
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const database = getDatabase();
    const router = useRouter();

    const signUp = async() => {
        try {
            //these are all the password checks to make sure it meets criteria
            if (password1 !== password2) {
                setErrorMessage('Passwords do not match.');
                return;
            }

            else if(password1.length < 10) {
                setErrorMessage('Password must be at least 10 characters long.');
                return;
            }

            else if(!/[A-Z]/.test(password1)) {
                setErrorMessage('Password must contain at least one uppercase letter.');
                return;
            }

            else if(!/[a-z]/.test(password1)) {
                setErrorMessage('Password must contain at least one lowercase letter.');
                return;
            }

            else if(!/[0-9]/.test(password1)) {
                setErrorMessage('Password must contain at least one number.');
                return;
            }

            else if(!/[!@#$%^&*(),.?":{}|<>]/.test(password1)) {
                setErrorMessage('Password must contain at least one special character.');
                return;
            } 

            //tries to create the account once the password meets all checks
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password1);
            
            //update user profile
            //for whatever reason, this needed to be explicity defined and written for it to work
            //this udpates in Auth
            await updateProfile(userCredentials.user, {
                displayName: `${firstName} ${lastName}`
            });

            //store user data in Realtime Database
            //email: john.smith@gmail.com
            //firstName: John
            //lastName: Smith
            //displayName: John Smith
            await set(ref(database, `users/${userCredentials.user.uid}`), {
                email: email,
                firstName: firstName,
                lastName: lastName,
                displayName: `${firstName} ${lastName}`,
                createdAt: new Date().toISOString(),
                photoURL: null //defaulting to null because obviously there is nothing there in the user account
            });

            setUser(userCredentials.user); //automatically signs the user in after account creation
            setErrorMessage('');
            setPassword1('');
            setPassword2('');
            setEmail('');
            setFirstName('');
            setLastName('');
        } catch (error) {
            //setErrorMessage(error.message || 'Error creating account. Please try again.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    Create Account
                </Text>
            </View>
            <View style={styles.headerBorder} />
                <View style={styles.formContainer}>
                    <Text style={styles.requirements}>
                        Password must be:
                        At least 10 characters long.
                        At least one uppercase letter.
                        At least one lowercase letter.
                        At least one number.
                        At least one special character.
                    </Text>
                    <View style={{marginTop: 20}}></View>
                    <Text style={styles.requirements}>
                        First name
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholderTextColor={colors.gray}
                    />
                    <Text style={styles.requirements}>
                        Last name
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={lastName}
                        onChangeText={setLastName}
                        placeholderTextColor={colors.gray}
                    />
                    <Text style={styles.requirements}>
                        Email
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        placeholderTextColor={colors.gray}
                    />
                    <Text style={styles.requirements}>
                        Password
                    </Text>
                    <View style={{position: 'relative'}}>
                        <TextInput
                            style={styles.input}
                            secureTextEntry={!showPassword1}
                            value={password1}
                            onChangeText={setPassword1}
                            placeholderTextColor={colors.gray}
                        />
                        <TouchableOpacity 
                            onPress={() => setShowPassword1(!showPassword1)}
                            style={styles.eye}
                        >
                            <Ionicons
                                name={showPassword1 ? 'eye-off' : 'eye'}
                                size={22}
                                color={colors.gray500}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.requirements}>
                        Confirm Password
                    </Text>
                    <View style={{position: 'relative'}}>
                        <TextInput
                            style={styles.input}
                            secureTextEntry={!showPassword2}
                            value={password2}
                            onChangeText={setPassword2}
                            placeholderTextColor={colors.gray}
                        />
                        <TouchableOpacity 
                            onPress={() => setShowPassword2(!showPassword2)}
                            style={styles.eye}
                        >
                            <Ionicons
                                name={showPassword2 ? 'eye-off' : 'eye'}
                                size={22}
                                color={colors.gray500}
                            />
                        </TouchableOpacity>
                    </View>
                    {errorMessage ? (
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : null}
                    <TouchableOpacity 
                        style={styles.signUpButton} 
                        onPress={signUp}
                    >
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setUser(null)}
                    >
                        <Text style={styles.toggleText}>
                            Already have an account? Sign in.
                        </Text>
                    </TouchableOpacity>
                </View>
        </KeyboardAvoidingView>
    );
};

export default Sign_Up;