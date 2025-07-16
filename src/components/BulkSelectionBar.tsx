import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Card from './Card';

interface BulkSelectionBarProps {
  isVisible: boolean;
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearAll: () => void;
  onAddSelected: () => void;
}

const BulkSelectionBar: React.FC<BulkSelectionBarProps> = ({
  isVisible,
  selectedCount,
  totalCount,
  onSelectAll,
  onClearAll,
  onAddSelected,
}) => {
  const { colors } = useTheme();

  if (!isVisible) return null;

  const isAllSelected = selectedCount === totalCount;
  const hasSelection = selectedCount > 0;

  return (
    <Card style={styles.container} padding="medium">
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Text style={[styles.selectionText, { color: colors.textPrimary }]}>
            {selectedCount} of {totalCount} selected
          </Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.backgroundSecondary }]}
              onPress={isAllSelected ? onClearAll : onSelectAll}
            >
              <Ionicons 
                name={isAllSelected ? 'close-circle-outline' : 'checkmark-circle-outline'} 
                size={16} 
                color={colors.textSecondary} 
              />
              <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                {isAllSelected ? 'Clear All' : 'Select All'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.addButton,
            { 
              backgroundColor: hasSelection ? colors.primary : colors.backgroundSecondary,
              opacity: hasSelection ? 1 : 0.6
            }
          ]}
          onPress={onAddSelected}
          disabled={!hasSelection}
        >
          <Ionicons 
            name="add-circle-outline" 
            size={20} 
            color={hasSelection ? colors.textInverse : colors.textSecondary} 
          />
          <Text style={[
            styles.addText,
            { color: hasSelection ? colors.textInverse : colors.textSecondary }
          ]}>
            Add ({selectedCount})
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
  },
  selectionText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default BulkSelectionBar; 