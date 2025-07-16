import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';

const initialQuotes = [
  {
    id: '1',
    description: 'Clean and press 3-piece suit',
    status: 'Pending',
    createdAt: '2024-06-01',
    price: null,
    adminNote: '',
  },
  {
    id: '2',
    description: 'Wedding dress deep clean',
    status: 'Approved',
    createdAt: '2024-05-28',
    price: 120,
    adminNote: 'Ready for pickup in 5 days',
  },
];

const CustomQuotesScreen: React.FC = () => {
  const { colors } = useTheme();
  const [quotes, setQuotes] = useState(initialQuotes);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [newDesc, setNewDesc] = useState('');

  const handleAddQuote = () => {
    if (!newDesc.trim()) return;
    setQuotes([
      {
        id: (quotes.length + 1).toString(),
        description: newDesc,
        status: 'Pending',
        createdAt: new Date().toISOString().slice(0, 10),
        price: null,
        adminNote: '',
      },
      ...quotes,
    ]);
    setNewDesc('');
    setShowAddModal(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.primary }]}>Custom Quotes</Text>
        <Button title="Add Quote" size="small" onPress={() => setShowAddModal(true)} />
      </View>
      <FlatList
        data={quotes}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 32 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.quoteCard, { backgroundColor: colors.backgroundSecondary }]}
            onPress={() => { setSelectedQuote(item); setShowDetailModal(true); }}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="document-text-outline" size={24} color={colors.primary} style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.quoteDesc, { color: colors.textPrimary }]} numberOfLines={1}>{item.description}</Text>
                <Text style={[styles.quoteMeta, { color: colors.textSecondary }]}>Status: {item.status} • {item.createdAt}</Text>
              </View>
              {item.status === 'Approved' && item.price && (
                <Text style={[styles.quotePrice, { color: colors.success }]}>€{item.price}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 32 }}>No custom quotes yet.</Text>}
      />
      {/* Add Quote Modal */}
      <Modal visible={showAddModal} transparent animationType="slide" onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}> 
            <Text style={[styles.modalTitle, { color: colors.primary }]}>New Custom Quote</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.backgroundSecondary }]}
              placeholder="Describe your request..."
              placeholderTextColor={colors.textTertiary}
              value={newDesc}
              onChangeText={setNewDesc}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={{ flexDirection: 'row', marginTop: 16 }}>
              <Button title="Cancel" variant="secondary" style={{ flex: 1, marginRight: 8 }} onPress={() => setShowAddModal(false)} />
              <Button title="Add" style={{ flex: 1, marginLeft: 8 }} onPress={handleAddQuote} />
            </View>
          </View>
        </View>
      </Modal>
      {/* Quote Detail Modal */}
      <Modal visible={showDetailModal} transparent animationType="fade" onRequestClose={() => setShowDetailModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}> 
            {selectedQuote && (
              <>
                <Text style={[styles.modalTitle, { color: colors.primary }]}>Quote Details</Text>
                <Text style={[styles.quoteDesc, { color: colors.textPrimary, marginBottom: 8 }]}>{selectedQuote.description}</Text>
                <Text style={[styles.quoteMeta, { color: colors.textSecondary }]}>Status: {selectedQuote.status}</Text>
                <Text style={[styles.quoteMeta, { color: colors.textSecondary }]}>Requested: {selectedQuote.createdAt}</Text>
                {selectedQuote.price && (
                  <Text style={[styles.quotePrice, { color: colors.success }]}>Price: €{selectedQuote.price}</Text>
                )}
                {selectedQuote.adminNote ? (
                  <Text style={[styles.quoteMeta, { color: colors.info, marginTop: 8 }]}>Note: {selectedQuote.adminNote}</Text>
                ) : null}
                <Button title="Close" style={{ marginTop: 16 }} onPress={() => setShowDetailModal(false)} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  title: { fontSize: 28, fontWeight: '700' },
  quoteCard: { padding: 16, borderRadius: 12, marginHorizontal: 16, marginBottom: 12 },
  quoteDesc: { fontSize: 16, fontWeight: '600' },
  quoteMeta: { fontSize: 13, fontWeight: '400', marginTop: 2 },
  quotePrice: { fontSize: 16, fontWeight: '700', marginLeft: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', borderRadius: 16, padding: 24 },
  modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, minHeight: 80 },
});

export default CustomQuotesScreen; 