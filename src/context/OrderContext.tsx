import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface CartItem {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceType: string;
  categoryId?: string;
  categoryName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
  iconName?: string;
}

export interface OrderState {
  items: CartItem[];
  pickupDate: string;
  pickupTime: string;
  deliveryDate: string;
  deliveryTime: string;
  pickupAddress: string;
  deliveryAddress: string;
  deliveryNotes: string;
}

type OrderAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_PICKUP_SCHEDULE'; payload: { date: string; time: string } }
  | { type: 'SET_DELIVERY_SCHEDULE'; payload: { date: string; time: string } }
  | { type: 'SET_ADDRESSES'; payload: { pickup: string; delivery: string; notes: string } }
  | { type: 'RESET_ORDER' };

const initialState: OrderState = {
  items: [],
  pickupDate: '',
  pickupTime: '',
  deliveryDate: '',
  deliveryTime: '',
  pickupAddress: '',
  deliveryAddress: '',
  deliveryNotes: '',
};

const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + action.payload.quantity;
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          totalPrice: existingItem.unitPrice * newQuantity,
        };
        return { ...state, items: updatedItems };
      } else {
        // Add new item
        return {
          ...state,
          items: [...state.items, action.payload],
        };
      }
    }

    case 'UPDATE_ITEM_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? {
              ...item,
              quantity: action.payload.quantity,
              totalPrice: item.unitPrice * action.payload.quantity,
            }
          : item
      ).filter(item => item.quantity > 0); // Remove items with 0 quantity

      return { ...state, items: updatedItems };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
      };
    }

    case 'CLEAR_CART': {
      return { ...state, items: [] };
    }

    case 'SET_PICKUP_SCHEDULE': {
      return {
        ...state,
        pickupDate: action.payload.date,
        pickupTime: action.payload.time,
      };
    }

    case 'SET_DELIVERY_SCHEDULE': {
      return {
        ...state,
        deliveryDate: action.payload.date,
        deliveryTime: action.payload.time,
      };
    }

    case 'SET_ADDRESSES': {
      return {
        ...state,
        pickupAddress: action.payload.pickup,
        deliveryAddress: action.payload.delivery,
        deliveryNotes: action.payload.notes,
      };
    }

    case 'RESET_ORDER': {
      return initialState;
    }

    default:
      return state;
  }
};

interface OrderContextType {
  state: OrderState;
  addItem: (item: Omit<CartItem, 'id' | 'totalPrice'>) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setPickupSchedule: (date: string, time: string) => void;
  setDeliverySchedule: (date: string, time: string) => void;
  setAddresses: (pickup: string, delivery: string, notes: string) => void;
  resetOrder: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemsByService: () => { [serviceId: string]: CartItem[] };
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  const addItem = (item: Omit<CartItem, 'id' | 'totalPrice'>) => {
    const id = `${item.serviceId}-${item.categoryId || 'custom'}`;
    const totalPrice = item.unitPrice * item.quantity;
    dispatch({
      type: 'ADD_ITEM',
      payload: { ...item, id, totalPrice },
    });
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    dispatch({
      type: 'UPDATE_ITEM_QUANTITY',
      payload: { id, quantity },
    });
  };

  const removeItem = (id: string) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { id },
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setPickupSchedule = (date: string, time: string) => {
    dispatch({
      type: 'SET_PICKUP_SCHEDULE',
      payload: { date, time },
    });
  };

  const setDeliverySchedule = (date: string, time: string) => {
    dispatch({
      type: 'SET_DELIVERY_SCHEDULE',
      payload: { date, time },
    });
  };

  const setAddresses = (pickup: string, delivery: string, notes: string) => {
    dispatch({
      type: 'SET_ADDRESSES',
      payload: { pickup, delivery, notes },
    });
  };

  const resetOrder = () => {
    dispatch({ type: 'RESET_ORDER' });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getItemsByService = () => {
    const grouped: { [serviceId: string]: CartItem[] } = {};
    state.items.forEach(item => {
      if (!grouped[item.serviceId]) {
        grouped[item.serviceId] = [];
      }
      grouped[item.serviceId].push(item);
    });
    return grouped;
  };

  const value: OrderContextType = {
    state,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    setPickupSchedule,
    setDeliverySchedule,
    setAddresses,
    resetOrder,
    getTotalItems,
    getTotalPrice,
    getItemsByService,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}; 