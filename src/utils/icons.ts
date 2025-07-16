import { Ionicons } from '@expo/vector-icons';

// Map of service types to default icons
export const SERVICE_ICONS: { [key: string]: keyof typeof Ionicons.glyphMap } = {
  easybag: 'bag-outline',
  washiron: 'shirt-outline',
  drycleaning: 'shirt-outline',
  repairs: 'construct-outline',
  custom: 'camera-outline',
  default: 'shirt-outline',
};

// Map of category types to default icons
export const CATEGORY_ICONS: { [key: string]: keyof typeof Ionicons.glyphMap } = {
  shirts: 'shirt-outline',
  pants: 'shirt-outline',
  dresses: 'shirt-outline',
  suits: 'shirt-outline',
  jackets: 'shirt-outline',
  coats: 'shirt-outline',
  sweaters: 'shirt-outline',
  jeans: 'shirt-outline',
  skirts: 'shirt-outline',
  blouses: 'shirt-outline',
  tshirts: 'shirt-outline',
  hoodies: 'shirt-outline',
  towels: 'shirt-outline',
  bedding: 'shirt-outline',
  curtains: 'shirt-outline',
  rugs: 'shirt-outline',
  shoes: 'shirt-outline',
  bags: 'bag-outline',
  accessories: 'shirt-outline',
  default: 'shirt-outline',
};

// Valid Ionicons for validation
const VALID_ICONS = new Set(Object.keys(Ionicons.glyphMap));

export const getValidIcon = (
  iconName: string | null | undefined,
  type: 'service' | 'category' = 'service',
  fallback?: string
): keyof typeof Ionicons.glyphMap => {
  if (!iconName) {
    return fallback as keyof typeof Ionicons.glyphMap || 
           (type === 'service' ? SERVICE_ICONS.default : CATEGORY_ICONS.default);
  }

  // Check if the icon name is valid
  if (VALID_ICONS.has(iconName)) {
    return iconName as keyof typeof Ionicons.glyphMap;
  }

  // Try to find a similar icon
  const normalizedName = iconName.toLowerCase().replace(/[^a-z]/g, '');
  
  // Check service icons first
  for (const [key, icon] of Object.entries(SERVICE_ICONS)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return icon;
    }
  }

  // Check category icons
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return icon;
    }
  }

  // Return fallback or default
  return fallback as keyof typeof Ionicons.glyphMap || 
         (type === 'service' ? SERVICE_ICONS.default : CATEGORY_ICONS.default);
};

export const getServiceIcon = (serviceType: string): keyof typeof Ionicons.glyphMap => {
  return SERVICE_ICONS[serviceType] || SERVICE_ICONS.default;
};

export const getCategoryIcon = (categoryName: string): keyof typeof Ionicons.glyphMap => {
  const normalizedName = categoryName.toLowerCase();
  
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return icon;
    }
  }
  
  return CATEGORY_ICONS.default;
}; 