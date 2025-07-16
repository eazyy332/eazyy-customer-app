import { supabase, TABLES, Database } from '../config/supabase';

type User = Database['public']['Tables']['users']['Row'];
type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];
type Service = Database['public']['Tables']['services']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type Item = Database['public']['Tables']['items']['Row'];
type Address = Database['public']['Tables']['user_addresses']['Row'];

// User Services
export const userService = {
  // Get current user
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  },

  // Get user by email (for existing website users)
  // Since profiles table doesn't have email, we need to get user from Supabase Auth
  async getUserByEmail(email: string): Promise<User | null> {
    // For now, we'll return null since we can't easily query by email
    // The authentication will be handled by Supabase Auth directly
    return null;
  },

  // Create or update user
  async upsertUser(userData: Partial<User>): Promise<User | null> {
    // For the profiles table, we don't need user_identifier logic
    // Just upsert the user data directly
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .upsert(userData, { onConflict: 'id' })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error upserting user:', error);
      return null;
    }

    return data;
  },

  // Sync user from database to Supabase Auth (for existing website users)
  async syncUserToAuth(email: string, password: string): Promise<User | null> {
    // This function is no longer needed since we're using Supabase Auth directly
    // Users will be created in Auth and profiles will be created separately
    return null;
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }

    return data;
  },
};

// Order Services
export const orderService = {
  // Get all orders for a user
  async getUserOrders(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }

    return data || [];
  },

  // Get order by ID with items
  async getOrderWithItems(orderId: string): Promise<{ order: Order; items: OrderItem[] } | null> {
    const { data: order, error: orderError } = await supabase
      .from(TABLES.ORDERS)
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.error('Error fetching order:', orderError);
      return null;
    }

    const { data: items, error: itemsError } = await supabase
      .from(TABLES.ORDER_ITEMS)
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
      return { order, items: [] };
    }

    return { order, items: items || [] };
  },

  // Create new order
  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order | null> {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .insert(orderData)
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return null;
    }

    return data;
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order | null> {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      return null;
    }

    return data;
  },

  // Cancel order
  async cancelOrder(orderId: string): Promise<Order | null> {
    return this.updateOrderStatus(orderId, 'cancelled');
  },

  // Add items to order
  async addOrderItems(items: Omit<OrderItem, 'id' | 'created_at'>[]): Promise<OrderItem[]> {
    const { data, error } = await supabase
      .from(TABLES.ORDER_ITEMS)
      .insert(items)
      .select();

    if (error) {
      console.error('Error adding order items:', error);
      return [];
    }

    return data || [];
  },

  // Update order by ID with arbitrary fields
  async updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      return null;
    }

    return data;
  },
};

// Service Services
export const serviceService = {
  // Get all active services
  async getActiveServices(): Promise<Service[]> {
    const { data, error } = await supabase
      .from(TABLES.SERVICES)
      .select('*')
      .eq('status', true)
      .order('sequence', { ascending: true });

    if (error) {
      console.error('Error fetching services:', error);
      return [];
    }

    return data || [];
  },

  // Get popular services
  async getPopularServices(): Promise<Service[]> {
    const { data, error } = await supabase
      .from(TABLES.SERVICES)
      .select('*')
      .eq('status', true)
      .eq('is_popular', true)
      .order('sequence', { ascending: true });

    if (error) {
      console.error('Error fetching popular services:', error);
      return [];
    }

    return data || [];
  },

  // Get service by ID
  async getServiceById(serviceId: string): Promise<Service | null> {
    const { data, error } = await supabase
      .from(TABLES.SERVICES)
      .select('*')
      .eq('id', serviceId)
      .single();

    if (error) {
      console.error('Error fetching service:', error);
      return null;
    }

    return data;
  },

  // Get service by identifier
  async getServiceByIdentifier(serviceIdentifier: string): Promise<Service | null> {
    const { data, error } = await supabase
      .from(TABLES.SERVICES)
      .select('*')
      .eq('service_identifier', serviceIdentifier)
      .eq('status', true)
      .single();

    if (error) {
      console.error('Error fetching service by identifier:', error);
      return null;
    }

    return data;
  },
};

// Category Services
export const categoryService = {
  // Get categories for a specific service
  async getCategoriesByService(serviceId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from(TABLES.CATEGORIES)
      .select('*')
      .eq('service_id', serviceId)
      .eq('status', true)
      .order('sequence', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data || [];
  },

  // Get category by ID
  async getCategoryById(categoryId: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from(TABLES.CATEGORIES)
      .select('*')
      .eq('id', categoryId)
      .single();

    if (error) {
      console.error('Error fetching category:', error);
      return null;
    }

    return data;
  },

  // Get items within a category from Supabase only
  async getItemsByCategory(categoryId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.ITEMS)
        .select('*')
        .eq('category_id', categoryId)
        .eq('status', true)
        .order('sequence', { ascending: true });

      if (error) {
        console.error('Error fetching items from Supabase:', error);
        return [];
      }

      if (!data || data.length === 0) {
        console.log('No items found in Supabase for category:', categoryId);
        return [];
      }

      // Get category details to add categoryName and iconName
      const category = await this.getCategoryById(categoryId);
      
      return data.map(item => ({
        ...item,
        categoryId,
        categoryName: category?.name || 'Unknown Category',
        iconName: category?.icon_name || item.icon_name,
      }));
    } catch (error) {
      console.error('Error in getItemsByCategory:', error);
      return [];
    }
  },
};

// Address Services
export const addressService = {
  // Get user addresses
  async getUserAddresses(userId: string): Promise<Address[]> {
    const { data, error } = await supabase
      .from(TABLES.USER_ADDRESSES)
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (error) {
      console.error('Error fetching user addresses:', error);
      return [];
    }

    return data || [];
  },

  // Add new address
  async addAddress(addressData: Omit<Address, 'id' | 'created_at' | 'updated_at'>): Promise<Address | null> {
    const { data, error } = await supabase
      .from(TABLES.USER_ADDRESSES)
      .insert(addressData)
      .select()
      .single();

    if (error) {
      console.error('Error adding address:', error);
      return null;
    }

    return data;
  },

  // Update address
  async updateAddress(addressId: string, updates: Partial<Address>): Promise<Address | null> {
    const { data, error } = await supabase
      .from(TABLES.USER_ADDRESSES)
      .update(updates)
      .eq('id', addressId)
      .select()
      .single();

    if (error) {
      console.error('Error updating address:', error);
      return null;
    }

    return data;
  },

  // Delete address
  async deleteAddress(addressId: string): Promise<boolean> {
    const { error } = await supabase
      .from(TABLES.USER_ADDRESSES)
      .delete()
      .eq('id', addressId);

    if (error) {
      console.error('Error deleting address:', error);
      return false;
    }

    return true;
  },

  // Set default address
  async setDefaultAddress(userId: string, addressId: string): Promise<boolean> {
    // First, unset all default addresses for this user
    const { error: unsetError } = await supabase
      .from(TABLES.USER_ADDRESSES)
      .update({ is_default: false })
      .eq('user_id', userId);

    if (unsetError) {
      console.error('Error unsetting default addresses:', unsetError);
      return false;
    }

    // Then set the new default address
    const { error: setError } = await supabase
      .from(TABLES.USER_ADDRESSES)
      .update({ is_default: true })
      .eq('id', addressId);

    if (setError) {
      console.error('Error setting default address:', setError);
      return false;
    }

    return true;
  },
};

// Analytics Services
export const analyticsService = {
  // Get user order statistics
  async getUserOrderStats(userId: string): Promise<{
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate: string | null;
  }> {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .select('total_amount, created_at')
      .eq('user_id', userId)
      .not('status', 'eq', 'cancelled');

    if (error) {
      console.error('Error fetching order stats:', error);
      return {
        totalOrders: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        lastOrderDate: null,
      };
    }

    const orders = data || [];
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0);
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    const lastOrderDate = orders.length > 0 
      ? orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
      : null;

    return {
      totalOrders,
      totalSpent,
      averageOrderValue,
      lastOrderDate,
    };
  },
}; 