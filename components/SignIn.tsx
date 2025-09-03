import { auth } from '@/firebase';
import { SignInStyles as styles } from '@/styles/SignIn.styles';
import { colors } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const Sign_In = ({ setUser }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const signIn = async() => {
        try {
            //signing in to Authentication
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredentials.user);
            //clearing the text fields
            setErrorMessage('');
            setPassword('');
            setEmail('');

        } catch (error) {
            setErrorMessage('Invalid email or password.');
        }
    };

    const sendPasswordEmail = async() => {
        try {
            //sending password reset email
            await sendPasswordResetEmail(auth, email);
            alert('Password reset email sent! Please check your inbox.');
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Error sending reset email. Please try again.');
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    Welcome Back
                </Text>
                <Text style={styles.subtitle}>
                    Login to your account
                </Text>
            </View>
            <View style={styles.headerBorder} />

            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <Text style={[styles.forgot, {marginTop: -10, color: colors.gray500,}]}>
                        To reset your password, enter email, then click "Forgot Password?"
                    </Text>
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
                    <View style={{ position: 'relative' }}>
                        <TextInput
                            style={styles.input}
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                            placeholderTextColor={colors.gray}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eye}
                        >
                            <Ionicons
                                name={showPassword ? 'eye-off' : 'eye'}
                                size={22}
                                color={colors.gray500}
                            />
                        </TouchableOpacity>
                    </View>

                    {errorMessage ? (
                        <Text style={[styles.errorText, { color: colors.error }]}>
                            {errorMessage}
                        </Text>
                    ) : null}

                    <TouchableOpacity
                        onPress={sendPasswordEmail}
                        style={{marginTop: -10}}
                    >
                        <Text style={[styles.forgot, { color: colors.gray500 }]}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>
                    <View style={{marginTop: 60}}/>

                    <TouchableOpacity
                        style={[styles.signInButton, { marginTop: 10 }]}
                        onPress={signIn}
                    >
                        <Text style={[styles.buttonText, { color: colors.black }]}>
                            Log In
                        </Text>
                    </TouchableOpacity> 
                    <TouchableOpacity
                        onPress={() => setUser(true)}
                    >
                        <Text style={[styles.toggleText, { color: colors.primary }]}>
                            Don't have an account? Sign up.
                        </Text>
                    </TouchableOpacity>
        
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Sign_In;