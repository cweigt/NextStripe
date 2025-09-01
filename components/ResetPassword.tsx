import { ResetPasswordStyles as styles } from '@/styles/ResetPassword.styles';
import { colors, spacing } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

//use interface for a cleaner and more detailed prop import
interface ResetPasswordProps {
  oldPassword: string;
  setOldPassword: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  error: string;
  showPasswordOld: boolean;
  setShowPasswordOld: (value: boolean) => void;
  showPasswordNew: boolean;
  setShowPasswordNew: (value: boolean) => void;
  showPasswordNewConfirm: boolean;
  setShowPasswordNewConfirm: (value: boolean) => void;
}

const Reset_Password = ({
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  error,
  showPasswordOld,
  setShowPasswordOld,
  showPasswordNew,
  setShowPasswordNew,
  showPasswordNewConfirm,
  setShowPasswordNewConfirm,
}: ResetPasswordProps) => {
    
    return (
        <View style={styles.container}>
            <View style={[styles.formContainer, { backgroundColor: colors.background }]}>
                        <Text style={[styles.requirements, { color: colors.textPrimary }]}>
                            Current Password
                        </Text>
                        <View style={{ position: 'relative', marginBottom: spacing.md }}>
                          <TextInput
                              style={[styles.input, { paddingRight: 40, backgroundColor: colors.card, borderColor: colors.border, color: colors.textPrimary }]}
                              placeholderTextColor={colors.gray500}
                              secureTextEntry={!showPasswordOld}
                              value={oldPassword}
                              onChangeText={setOldPassword}
                              accessibilityLabel="Current Password"
                              accessibilityHint="Enter your current password"
                          />
                          <TouchableOpacity
                            onPress={() => setShowPasswordOld(!showPasswordOld)}
                            style={styles.eye}
                          >
                            <Ionicons
                              name={showPasswordOld ? 'eye-off' : 'eye'}
                              size={22}
                              color={colors.gray500}
                            />
                          </TouchableOpacity>
                        </View>

                        <Text style={[styles.requirements, { color: colors.textPrimary }]}>
                            New Password
                        </Text>
                        <View style={{ position: 'relative', marginBottom: spacing.md }}>
                          <TextInput
                              style={[styles.input, { paddingRight: 40, backgroundColor: colors.card, borderColor: colors.border, color: colors.textPrimary }]}
                              placeholderTextColor={colors.gray500}
                              secureTextEntry={!showPasswordNew}
                              value={newPassword}
                              onChangeText={setNewPassword}
                              accessibilityLabel="New Password"
                              accessibilityHint="Enter your new password"
                          />
                          <TouchableOpacity
                            onPress={() => setShowPasswordNew(!showPasswordNew)}
                            style={styles.eye}
                          >
                            <Ionicons
                              name={showPasswordNew ? 'eye-off' : 'eye'}
                              size={22}
                              color={colors.gray500}
                            />
                          </TouchableOpacity>
                        </View>

                        <Text style={[styles.requirements, { color: colors.textPrimary }]}>
                            Confirm New Password
                        </Text>
                        <View style={{ position: 'relative', marginBottom: spacing.md }}>
                          <TextInput
                              style={[styles.input, { paddingRight: 40, backgroundColor: colors.card, borderColor: colors.border, color: colors.textPrimary }]}
                              placeholderTextColor={colors.gray500}
                              secureTextEntry={!showPasswordNewConfirm}
                              value={confirmPassword}
                              onChangeText={setConfirmPassword}
                              accessibilityLabel="Confirm new password"
                              accessibilityHint="Reenter your new password"
                          />
                          <TouchableOpacity
                            onPress={() => setShowPasswordNewConfirm(!showPasswordNewConfirm)}
                            style={styles.eye}
                          >
                            <Ionicons
                              name={showPasswordNewConfirm ? 'eye-off' : 'eye'}
                              size={22}
                              color={colors.gray500}
                            />
                          </TouchableOpacity>
                        </View>

                        {error ? (
                            <Text style={[styles.errorText, { color: colors.error }]} allowFontScaling={true}>
                                {error}
                            </Text>
                        ) : null}

            </View>
        </View>
    );
};

export default Reset_Password;