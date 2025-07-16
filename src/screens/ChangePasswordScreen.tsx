import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../config/supabase';

const ChangePasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChangePassword = async () => {
    setError(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    setLoading(true);
    // Re-authenticate user (Supabase requires session, so we try sign in first)
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      setError('User not authenticated.');
      setLoading(false);
      return;
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.data.user.email || '',
      password: currentPassword,
    });
    if (signInError) {
      setError('Current password is incorrect.');
      setLoading(false);
      return;
    }
    // Update password
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (updateError) {
      setError('Failed to update password.');
    } else {
      Alert.alert('Password Changed', 'Your password has been updated.');
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Change Password</Text>
      </View>
      <View style={styles.form}>
        <TextInput
          style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
          placeholder="Current Password"
          placeholderTextColor={colors.textTertiary}
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
          placeholder="New Password"
          placeholderTextColor={colors.textTertiary}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
          placeholder="Confirm New Password"
          placeholderTextColor={colors.textTertiary}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {error && <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text>}
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleChangePassword} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.textInverse} />
          ) : (
            <Text style={{ color: colors.textInverse, fontWeight: '700', fontSize: 16 }}>Change Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  backButton: { marginRight: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  form: { padding: 24 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  button: { padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
});

export default ChangePasswordScreen; 