export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Categories: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          image_url: string | null
          is_active: boolean | null
          name: string | null
          slug: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string
          created_at?: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean | null
          name?: string | null
          slug?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean | null
          name?: string | null
          slug?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ProductImages: {
        Row: {
          alt_text: string | null
          created_at: string
          image_id: string
          is_primary: boolean | null
          product_id: string | null
          url: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          image_id?: string
          is_primary?: boolean | null
          product_id?: string | null
          url?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          image_id?: string
          is_primary?: boolean | null
          product_id?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ProductImages_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "Products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      Products: {
        Row: {
          billing_interval: string | null
          category_id: string | null
          cost_price: number | null
          created_at: string | null
          description: string | null
          fulfillment_service: string | null
          is_active: boolean | null
          is_backorderable: boolean | null
          name: string | null
          notes: string | null
          price: number | null
          product_id: string
          quantity: number | null
          sale_price: number | null
          ship_from_location: string | null
          sku: string
          slug: string | null
          stripe_price_id: string | null
          stripe_product_id: string | null
          updated_at: string | null
          weight_grams: number | null
        }
        Insert: {
          billing_interval?: string | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          fulfillment_service?: string | null
          is_active?: boolean | null
          is_backorderable?: boolean | null
          name?: string | null
          notes?: string | null
          price?: number | null
          product_id?: string
          quantity?: number | null
          sale_price?: number | null
          ship_from_location?: string | null
          sku: string
          slug?: string | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          updated_at?: string | null
          weight_grams?: number | null
        }
        Update: {
          billing_interval?: string | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          fulfillment_service?: string | null
          is_active?: boolean | null
          is_backorderable?: boolean | null
          name?: string | null
          notes?: string | null
          price?: number | null
          product_id?: string
          quantity?: number | null
          sale_price?: number | null
          ship_from_location?: string | null
          sku?: string
          slug?: string | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          updated_at?: string | null
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "Categories"
            referencedColumns: ["category_id"]
          },
        ]
      }
      ProductSupplier: {
        Row: {
          base_cost: number | null
          created_at: string
          is_primary: boolean | null
          min_order_qty: number | null
          product_id: string
          supplier_id: string | null
          supplier_sku: string | null
        }
        Insert: {
          base_cost?: number | null
          created_at?: string
          is_primary?: boolean | null
          min_order_qty?: number | null
          product_id: string
          supplier_id?: string | null
          supplier_sku?: string | null
        }
        Update: {
          base_cost?: number | null
          created_at?: string
          is_primary?: boolean | null
          min_order_qty?: number | null
          product_id?: string
          supplier_id?: string | null
          supplier_sku?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ProductSupplier_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "Products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "ProductSupplier_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "Suppliers"
            referencedColumns: ["supplier_id"]
          },
        ]
      }
      Suppliers: {
        Row: {
          address: Json | null
          contact_email: string | null
          created_at: string
          is_active: boolean | null
          lead_time_days: number | null
          name: string | null
          payment_terms: string | null
          phone: string | null
          stripe_connect_id: string | null
          supplier_id: string
        }
        Insert: {
          address?: Json | null
          contact_email?: string | null
          created_at?: string
          is_active?: boolean | null
          lead_time_days?: number | null
          name?: string | null
          payment_terms?: string | null
          phone?: string | null
          stripe_connect_id?: string | null
          supplier_id?: string
        }
        Update: {
          address?: Json | null
          contact_email?: string | null
          created_at?: string
          is_active?: boolean | null
          lead_time_days?: number | null
          name?: string | null
          payment_terms?: string | null
          phone?: string | null
          stripe_connect_id?: string | null
          supplier_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      Category: "Veges, Fruits, Eggs"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      Category: ["Veges, Fruits, Eggs"],
    },
  },
} as const
