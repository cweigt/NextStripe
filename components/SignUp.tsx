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
    const [loading, setLoading] = useState(false);

    const PASSWORD_RULES = [
        { test: (p:string)=> p.length >= 10, msg: 'At least 10 characters' },
        { test: (p:string)=> /[A-Z]/.test(p), msg: 'At least one uppercase letter' },
        { test: (p:string)=> /[a-z]/.test(p), msg: 'At least one lowercase letter' },
        { test: (p:string)=> /[0-9]/.test(p), msg: 'At least one number' },
        { test: (p:string)=> /[!@#$%^&*(),.?":{}|<>]/.test(p), msg: 'At least one special character' },
    ];

    const validatePassword = (p1: string, p2: string): string | null => {
        if (p1 !== p2) return 'Passwords do not match.';
        for (const r of PASSWORD_RULES) if (!r.test(p1)) return `Password rule not met: ${r.msg}.`;
        return null;
    };

    const mapFirebaseError = (code?: string): string => {
        switch (code) {
            case 'auth/email-already-in-use':
                return 'That email is already in use.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/weak-password':
        // You likely won’t see this since you pre-validate, but keep it just in case
                return 'Password is too weak.';
            case 'auth/operation-not-allowed':
                return 'Email/password sign-up is disabled for this project.';
            case 'auth/network-request-failed':
                return 'Network error. Check your connection and try again.';
            default:
                return 'Error creating account. Please try again.';
        }
    };


    const signUp = async () => {
        if (loading) return;
        setErrorMessage('');
        setLoading(true);
        try {
          // normalize inputs
          const cleanEmail = email.trim().toLowerCase();
          const cleanFirst = firstName.trim();
          const cleanLast = lastName.trim();
      
          // basic required fields
          if (!cleanFirst || !cleanLast || !cleanEmail) {
            setErrorMessage('Please fill out first name, last name, and email.');
            setLoading(false);
            return;
          }
      
          // password validation
          const pwError = validatePassword(password1, password2);
          if (pwError) {
            setErrorMessage(pwError);
            setLoading(false);
            return;
          }
      
          // create user
          const userCredentials = await createUserWithEmailAndPassword(auth, cleanEmail, password1);
      
          await updateProfile(userCredentials.user, { displayName: `${cleanFirst} ${cleanLast}` });
      
          await set(ref(database, `users/${userCredentials.user.uid}`), {
            email: cleanEmail,
            firstName: cleanFirst,
            lastName: cleanLast,
            displayName: `${cleanFirst} ${cleanLast}`,
            createdAt: new Date().toISOString(),
            photoURL: null,
          });
      
          setUser(userCredentials.user);
      
          // reset local form state
          setErrorMessage('');
          setPassword1('');
          setPassword2('');
          setEmail('');
          setFirstName('');
          setLastName('');
        } catch (error: any) {
          setErrorMessage(mapFirebaseError(error?.code));
        } finally {
          setLoading(false);
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