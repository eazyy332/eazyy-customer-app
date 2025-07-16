import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jamgmyljyydryxaonbgk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphbWdteWxqeXlkcnl4YW9uYmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMzUwNTIsImV4cCI6MjA1NzcxMTA1Mn0.N3v4C2PtSuW_VZ9ngyyjEMC06brPchLL4r8bsMjwXic';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  USERS: 'profiles', // Use profiles table instead of users
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  SERVICES: 'services',
  CATEGORIES: 'categories',
  ITEMS: 'items',
  USER_ADDRESSES: 'user_addresses',
  PROFILES: 'profiles',
  ORIGINAL_ORDERS: 'original_orders',
  ORIGINAL_ORDER_ITEMS: 'original_order_items',
} as const;

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          phone: string;
          address: string | null;
          city: string | null;
          postal_code: string | null;
          preferences: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          phone: string;
          address?: string | null;
          city?: string | null;
          postal_code?: string | null;
          preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          phone?: string;
          address?: string | null;
          city?: string | null;
          postal_code?: string | null;
          preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          customer_name: string;
          email: string;
          phone: string;
          shipping_address: string;
          status: string;
          payment_method: string;
          payment_status: string;
          transaction_id: string;
          shipping_method: string;
          special_instructions: string;
          subtotal: number;
          tax: number;
          shipping_fee: number;
          total_amount: number;
          created_at: string;
          updated_at: string;
          qr_code: string;
          assigned_driver_id: string | null;
          last_status_update: string;
          type: string;
          facility_id: string | null;
          latitude: string | null;
          longitude: string | null;
          is_pickup_completed: boolean;
          is_facility_processing: boolean;
          is_dropoff_completed: boolean;
          pickup_date: string;
          delivery_date: string;
          order_type: string;
          quote_status: string;
          facility_updated_items: any | null;
          facility_notes: string | null;
          item_discrepancy_photo_url: string | null;
          customer_item_decision: string | null;
          admin_comment: string | null;
          assigned_pickup_driver_id: string | null;
          assigned_dropoff_driver_id: string | null;
          estimated_pickup_time: string;
          estimated_dropoff_time: string;
          discrepancy_status: string | null;
          is_discrepancy_order: boolean;
          original_order_id: string | null;
          discrepancy_number: string | null;
          discrepancy_resolution_notes: string | null;
          discrepancy_resolved_at: string | null;
          discrepancy_resolved_by: string | null;
          service_id: string;
          service_name: string;
          category_id: string | null;
          category_name: string | null;
          internal_notes: string | null;
          customer_id: string | null;
          has_discrepancy: boolean;
          delivery_by: string | null;
        };
        Insert: {
          id?: string;
          order_number?: string;
          user_id: string;
          customer_name: string;
          email: string;
          phone: string;
          shipping_address: string;
          status?: string;
          payment_method?: string;
          payment_status?: string;
          transaction_id?: string;
          shipping_method?: string;
          special_instructions?: string;
          subtotal: number;
          tax?: number;
          shipping_fee?: number;
          total_amount: number;
          created_at?: string;
          updated_at?: string;
          qr_code?: string;
          assigned_driver_id?: string | null;
          last_status_update?: string;
          type?: string;
          facility_id?: string | null;
          latitude?: string | null;
          longitude?: string | null;
          is_pickup_completed?: boolean;
          is_facility_processing?: boolean;
          is_dropoff_completed?: boolean;
          pickup_date: string;
          delivery_date: string;
          order_type?: string;
          quote_status?: string;
          facility_updated_items?: any | null;
          facility_notes?: string | null;
          item_discrepancy_photo_url?: string | null;
          customer_item_decision?: string | null;
          admin_comment?: string | null;
          assigned_pickup_driver_id?: string | null;
          assigned_dropoff_driver_id?: string | null;
          estimated_pickup_time?: string;
          estimated_dropoff_time?: string;
          discrepancy_status?: string | null;
          is_discrepancy_order?: boolean;
          original_order_id?: string | null;
          discrepancy_number?: string | null;
          discrepancy_resolution_notes?: string | null;
          discrepancy_resolved_at?: string | null;
          discrepancy_resolved_by?: string | null;
          service_id: string;
          service_name: string;
          category_id?: string | null;
          category_name?: string | null;
          internal_notes?: string | null;
          customer_id?: string | null;
          has_discrepancy?: boolean;
          delivery_by?: string | null;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string;
          customer_name?: string;
          email?: string;
          phone?: string;
          shipping_address?: string;
          status?: string;
          payment_method?: string;
          payment_status?: string;
          transaction_id?: string;
          shipping_method?: string;
          special_instructions?: string;
          subtotal?: number;
          tax?: number;
          shipping_fee?: number;
          total_amount?: number;
          created_at?: string;
          updated_at?: string;
          qr_code?: string;
          assigned_driver_id?: string | null;
          last_status_update?: string;
          type?: string;
          facility_id?: string | null;
          latitude?: string | null;
          longitude?: string | null;
          is_pickup_completed?: boolean;
          is_facility_processing?: boolean;
          is_dropoff_completed?: boolean;
          pickup_date?: string;
          delivery_date?: string;
          order_type?: string;
          quote_status?: string;
          facility_updated_items?: any | null;
          facility_notes?: string | null;
          item_discrepancy_photo_url?: string | null;
          customer_item_decision?: string | null;
          admin_comment?: string | null;
          assigned_pickup_driver_id?: string | null;
          assigned_dropoff_driver_id?: string | null;
          estimated_pickup_time?: string;
          estimated_dropoff_time?: string;
          discrepancy_status?: string | null;
          is_discrepancy_order?: boolean;
          original_order_id?: string | null;
          discrepancy_number?: string | null;
          discrepancy_resolution_notes?: string | null;
          discrepancy_resolved_at?: string | null;
          discrepancy_resolved_by?: string | null;
          service_id?: string;
          service_name?: string;
          category_id?: string | null;
          category_name?: string | null;
          internal_notes?: string | null;
          customer_id?: string | null;
          has_discrepancy?: boolean;
          delivery_by?: string | null;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          service_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          service_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          service_id?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          created_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string;
          short_description: string;
          icon: string;
          image_url: string;
          price_starts_at: number;
          price_unit: string;
          features: string[];
          benefits: string[];
          service_identifier: string;
          color_scheme: any;
          sequence: number;
          is_popular: boolean;
          status: boolean;
          created_at: string;
          updated_at: string;
          color_hex: string;
          icon_name: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          short_description: string;
          icon?: string;
          image_url?: string;
          price_starts_at: number;
          price_unit: string;
          features?: string[];
          benefits?: string[];
          service_identifier: string;
          color_scheme?: any;
          sequence?: number;
          is_popular?: boolean;
          status?: boolean;
          created_at?: string;
          updated_at?: string;
          color_hex?: string;
          icon_name?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          short_description?: string;
          icon?: string;
          image_url?: string;
          price_starts_at?: number;
          price_unit?: string;
          features?: string[];
          benefits?: string[];
          service_identifier?: string;
          color_scheme?: any;
          sequence?: number;
          is_popular?: boolean;
          status?: boolean;
          created_at?: string;
          updated_at?: string;
          color_hex?: string;
          icon_name?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string | null;
          sequence: number;
          status: boolean;
          created_at: string;
          updated_at: string;
          service_id: string;
          icon_name: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon?: string | null;
          sequence?: number;
          status?: boolean;
          created_at?: string;
          updated_at?: string;
          service_id: string;
          icon_name?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon?: string | null;
          sequence?: number;
          status?: boolean;
          created_at?: string;
          updated_at?: string;
          service_id?: string;
          icon_name?: string | null;
        };
      };
      items: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category_id: string;
          sequence: number;
          status: boolean;
          created_at: string;
          updated_at: string;
          icon_name: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          category_id: string;
          sequence?: number;
          status?: boolean;
          created_at?: string;
          updated_at?: string;
          icon_name?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          category_id?: string;
          sequence?: number;
          status?: boolean;
          created_at?: string;
          updated_at?: string;
          icon_name?: string | null;
        };
      };
      user_addresses: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          street: string;
          house_number: string;
          additional_info: string | null;
          city: string;
          postal_code: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          street: string;
          house_number: string;
          additional_info?: string | null;
          city: string;
          postal_code: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          street?: string;
          house_number?: string;
          additional_info?: string | null;
          city?: string;
          postal_code?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
} 