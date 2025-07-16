import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { addressService } from '../services/database';
import { useTranslation } from 'react-i18next';
import i18n from '../config/i18n';
import { Picker } from '@react-native-picker/picker';

const AccountScreen: React.FC = () => {
  const { colors } = useTheme();
  const { user, updateProfile, signOut } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const { t } = useTranslation();

  // State for edit profile modal
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [editFirstName, setEditFirstName] = React.useState(user?.first_name || '');
  const [editLastName, setEditLastName] = React.useState(user?.last_name || '');
  const [editPhone, setEditPhone] = React.useState(user?.phone || '');
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Address management state
  const [addresses, setAddresses] = React.useState<any[]>([]);
  const [addressLoading, setAddressLoading] = React.useState(false);
  const [addressError, setAddressError] = React.useState<string | null>(null);
  const [addressModalVisible, setAddressModalVisible] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState<any | null>(null);
  const [addressForm, setAddressForm] = React.useState({
    name: '',
    street: '',
    house_number: '',
    additional_info: '',
    city: '',
    postal_code: '',
    is_default: false,
  });
  // Fetch addresses on mount
  React.useEffect(() => {
    if (user?.id) fetchAddresses();
  }, [user?.id]);
  const fetchAddresses = async () => {
    if (!user) return;
    setAddressLoading(true);
    setAddressError(null);
    try {
      const data = await addressService.getUserAddresses(user.id);
      setAddresses(data);
    } catch (e) {
      setAddressError('Failed to load addresses.');
    }
    setAddressLoading(false);
  };
  // Open add/edit modal
  const openAddressModal = (address: any | null = null) => {
    setEditingAddress(address);
    setAddressForm(address ? { ...address } : {
      name: '', street: '', house_number: '', additional_info: '', city: '', postal_code: '', is_default: false,
    });
    setAddressModalVisible(true);
  };
  // Save address (add or edit)
  const handleSaveAddress = async () => {
    if (!user) return;
    setAddressLoading(true);
    setAddressError(null);
    try {
      if (editingAddress) {
        await addressService.updateAddress(editingAddress.id, addressForm);
      } else {
        await addressService.addAddress({ ...addressForm, user_id: user.id });
      }
      setAddressModalVisible(false);
      fetchAddresses();
    } catch (e) {
      setAddressError('Failed to save address.');
    }
    setAddressLoading(false);
  };
  // Delete address
  const handleDeleteAddress = async (addressId: string) => {
    if (!user) return;
    setAddressLoading(true);
    setAddressError(null);
    try {
      await addressService.deleteAddress(addressId);
      fetchAddresses();
    } catch (e) {
      setAddressError('Failed to delete address.');
    }
    setAddressLoading(false);
  };
  // Set default address
  const handleSetDefault = async (addressId: string) => {
    if (!user) return;
    setAddressLoading(true);
    setAddressError(null);
    try {
      await addressService.setDefaultAddress(user.id, addressId);
      fetchAddresses();
    } catch (e) {
      setAddressError('Failed to set default address.');
    }
    setAddressLoading(false);
  };

  const openEditModal = () => {
    setEditFirstName(user?.first_name || '');
    setEditLastName(user?.last_name || '');
    setEditPhone(user?.phone || '');
    setError(null);
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(null);
    const updates: any = { first_name: editFirstName, last_name: editLastName, phone: editPhone };
    const { error } = await updateProfile(updates);
    setSaving(false);
    if (error) {
      setError('Failed to update profile.');
    } else {
      setEditModalVisible(false);
      Alert.alert('Profile updated', 'Your profile information has been updated.');
    }
  };

  const [showLanguageModal, setShowLanguageModal] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState(i18n.language);
  const languageOptions = [
    { label: 'English', value: 'en' },
    { label: 'Nederlands', value: 'nl' },
  ];
  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const [showCurrencyModal, setShowCurrencyModal] = React.useState(false);
  const [selectedCurrency, setSelectedCurrency] = React.useState(user?.preferences?.currency || 'EUR');
  const currencyOptions = [
    { label: 'EUR (€)', value: 'EUR' },
    { label: 'USD ($)', value: 'USD' },
    { label: 'GBP (£)', value: 'GBP' },
  ];
  const handleCurrencyChange = async (currency: string) => {
    setSelectedCurrency(currency);
    if (user) {
      const newPrefs = { ...user.preferences, currency };
      await updateProfile({ preferences: newPrefs });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Language Selector */}
        <View style={{ marginBottom: 16 }}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginBottom: 8 }]}>{t('language')}</Text>
          {Platform.OS === 'ios' ? (
            <TouchableOpacity
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12 }}
              onPress={() => setShowLanguageModal(true)}
            >
              <Text style={{ color: colors.textPrimary }}>{languageOptions.find(l => l.value === selectedLanguage)?.label}</Text>
            </TouchableOpacity>
          ) : (
            <Picker
              selectedValue={selectedLanguage}
              onValueChange={handleLanguageChange}
              style={{ color: colors.textPrimary }}
            >
              {languageOptions.map(lang => (
                <Picker.Item key={lang.value} label={lang.label} value={lang.value} />
              ))}
            </Picker>
          )}
        </View>
        {/* Currency Selector */}
        <View style={{ marginBottom: 16 }}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginBottom: 8 }]}>{t('currency')}</Text>
          {Platform.OS === 'ios' ? (
            <TouchableOpacity
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12 }}
              onPress={() => setShowCurrencyModal(true)}
            >
              <Text style={{ color: colors.textPrimary }}>{currencyOptions.find(c => c.value === selectedCurrency)?.label}</Text>
            </TouchableOpacity>
          ) : (
            <Picker
              selectedValue={selectedCurrency}
              onValueChange={handleCurrencyChange}
              style={{ color: colors.textPrimary }}
            >
              {currencyOptions.map(cur => (
                <Picker.Item key={cur.value} label={cur.label} value={cur.value} />
              ))}
            </Picker>
          )}
        </View>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{t('account')}</Text>
        {/* Profile */}
        <Card style={styles.profileCard} padding="large">
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}> 
              <Ionicons name="person-outline" size={32} color={colors.textInverse} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>{user ? `${user.first_name} ${user.last_name}` : t('user')}</Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{user?.phone || ''}</Text>
            </View>
            <TouchableOpacity onPress={openEditModal}>
              <Ionicons name="create-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </Card>
        {/* Payment Methods */}
        <Card style={styles.sectionCard} padding="large">
          <View style={styles.sectionHeader}>
            <Ionicons name="card-outline" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('payment_methods')}</Text>
          </View>
          <TouchableOpacity style={styles.row}>
            <Ionicons name="logo-apple" size={20} color={colors.textPrimary} />
            <Text style={[styles.rowText, { color: colors.textPrimary }]}>{t('apple_pay')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Ionicons name="card-outline" size={20} color={colors.textPrimary} />
            <Text style={[styles.rowText, { color: colors.textPrimary }]}>{t('credit_card')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
            <Text style={[styles.addButtonText, { color: colors.primary }]}>{t('add_payment_method')}</Text>
          </TouchableOpacity>
        </Card>
        {/* Notifications */}
        <Card style={styles.sectionCard} padding="large">
          <View style={styles.sectionHeader}>
            <Ionicons name="notifications-outline" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('notifications')}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.rowText, { color: colors.textPrimary }]}>{t('order_updates')}</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={notificationsEnabled ? colors.primary : colors.border}
            />
          </View>
        </Card>
        {/* Saved Addresses */}
        <Card style={styles.sectionCard} padding="large">
          <View style={styles.sectionHeader}>
            <Ionicons name="home-outline" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('saved_addresses')}</Text>
          </View>
          {addressLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : addressError ? (
            <Text style={{ color: 'red' }}>{addressError}</Text>
          ) : addresses.length === 0 ? (
            <Text style={{ color: colors.textSecondary }}>{t('no_addresses_saved')}</Text>
          ) : (
            addresses.map(addr => (
              <View key={addr.id} style={[styles.row, { alignItems: 'flex-start' }]}> 
                <Ionicons name={addr.is_default ? 'star' : 'home-outline'} size={20} color={addr.is_default ? colors.success : colors.textPrimary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rowText, { color: colors.textPrimary }]}>{addr.name} - {addr.street} {addr.house_number}, {addr.city} {addr.postal_code}</Text>
                  {addr.additional_info ? <Text style={[styles.rowText, { color: colors.textSecondary, fontSize: 12 }]}>{addr.additional_info}</Text> : null}
                </View>
                <TouchableOpacity onPress={() => openAddressModal(addr)} style={{ marginLeft: 8 }}>
                  <Ionicons name="create-outline" size={18} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteAddress(addr.id)} style={{ marginLeft: 8 }}>
                  <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                </TouchableOpacity>
                {!addr.is_default && (
                  <TouchableOpacity onPress={() => handleSetDefault(addr.id)} style={{ marginLeft: 8 }}>
                    <Ionicons name="star-outline" size={18} color={colors.success} />
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
          <TouchableOpacity style={styles.addButton} onPress={() => openAddressModal(null)}>
            <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
            <Text style={[styles.addButtonText, { color: colors.primary }]}>{t('add_address')}</Text>
          </TouchableOpacity>
        </Card>
        {/* Change Password */}
        <Card style={styles.sectionCard} padding="large">
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('ChangePassword')}>
            <Ionicons name="key-outline" size={20} color={colors.primary} />
            <Text style={[styles.rowText, { color: colors.primary }]}>{t('change_password')}</Text>
          </TouchableOpacity>
        </Card>

        {/* Sign Out */}
        <Card style={styles.sectionCard} padding="large">
          <TouchableOpacity 
            style={styles.signOutButton}
            onPress={signOut}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={[styles.signOutText, { color: '#FF3B30' }]}>{t('sign_out')}</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ backgroundColor: colors.background, padding: 24, borderRadius: 16, width: '90%' }}>
            <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 16, color: colors.textPrimary }}>{t('edit_profile')}</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 12, color: colors.textPrimary }}
              placeholder={t('first_name')}
              placeholderTextColor={colors.textTertiary}
              value={editFirstName}
              onChangeText={setEditFirstName}
            />
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 12, color: colors.textPrimary }}
              placeholder={t('last_name')}
              placeholderTextColor={colors.textTertiary}
              value={editLastName}
              onChangeText={setEditLastName}
            />
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 12, color: colors.textPrimary }}
              placeholder={t('phone')}
              placeholderTextColor={colors.textTertiary}
              value={editPhone}
              onChangeText={setEditPhone}
              keyboardType="phone-pad"
            />
            {error && <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={{ marginRight: 16 }}>
                <Text style={{ color: colors.textSecondary, fontSize: 16 }}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveProfile} disabled={saving}>
                {saving ? (
                  <ActivityIndicator color={colors.primary} />
                ) : (
                  <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '700' }}>{t('save')}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Address Modal */}
      <Modal
        visible={addressModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ backgroundColor: colors.background, padding: 24, borderRadius: 16, width: '90%' }}>
            <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 16, color: colors.textPrimary }}>{editingAddress ? t('edit_address') : t('add_address')}</Text>
            <TextInput style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 12, color: colors.textPrimary }} placeholder={t('address_name_placeholder')} placeholderTextColor={colors.textTertiary} value={addressForm.name} onChangeText={v => setAddressForm(f => ({ ...f, name: v }))} />
            <TextInput style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 12, color: colors.textPrimary }} placeholder={t('street')} placeholderTextColor={colors.textTertiary} value={addressForm.street} onChangeText={v => setAddressForm(f => ({ ...f, street: v }))} />
            <TextInput style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 12, color: colors.textPrimary }} placeholder={t('house_number')} placeholderTextColor={colors.textTertiary} value={addressForm.house_number} onChangeText={v => setAddressForm(f => ({ ...f, house_number: v }))} />
            <TextInput style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 12, color: colors.textPrimary }} placeholder={t('additional_info')} placeholderTextColor={colors.textTertiary} value={addressForm.additional_info} onChangeText={v => setAddressForm(f => ({ ...f, additional_info: v }))} />
            <TextInput style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 12, color: colors.textPrimary }} placeholder={t('city')} placeholderTextColor={colors.textTertiary} value={addressForm.city} onChangeText={v => setAddressForm(f => ({ ...f, city: v }))} />
            <TextInput style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 12, color: colors.textPrimary }} placeholder={t('postal_code')} placeholderTextColor={colors.textTertiary} value={addressForm.postal_code} onChangeText={v => setAddressForm(f => ({ ...f, postal_code: v }))} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => setAddressModalVisible(false)} style={{ marginRight: 16 }}>
                <Text style={{ color: colors.textSecondary, fontSize: 16 }}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveAddress} disabled={addressLoading}>
                {addressLoading ? (
                  <ActivityIndicator color={colors.primary} />
                ) : (
                  <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '700' }}>{editingAddress ? t('save') : t('add')}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 24 },
  profileCard: { marginBottom: 16 },
  profileHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '600' },
  profileEmail: { fontSize: 14, fontWeight: '400' },
  sectionCard: { marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginLeft: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  rowText: { fontSize: 14, fontWeight: '500', marginLeft: 12, flex: 1 },
  addButton: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  addButtonText: { fontSize: 14, fontWeight: '600', marginLeft: 4 },
  signOutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  signOutText: { fontSize: 16, fontWeight: '600', marginLeft: 8 },
});

export default AccountScreen; 