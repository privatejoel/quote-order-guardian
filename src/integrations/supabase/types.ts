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
      customers: {
        Row: {
          address: string | null
          created_at: string
          currency: string | null
          customer_code: string
          customer_name: string
          gstin: string | null
          id: string
          preferred_incoterms: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          currency?: string | null
          customer_code: string
          customer_name: string
          gstin?: string | null
          id?: string
          preferred_incoterms?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          currency?: string | null
          customer_code?: string
          customer_name?: string
          gstin?: string | null
          id?: string
          preferred_incoterms?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      po_line_items: {
        Row: {
          created_at: string
          currency: string | null
          customer_part_number: string | null
          delivery_date: string | null
          deviation_notes: string | null
          hsn_code: string | null
          id: string
          internal_part_number: string | null
          item_description: string | null
          line_item_number: number
          match_status: Database["public"]["Enums"]["match_status"] | null
          matched_quote_line_id: string | null
          po_id: string
          po_quantity: number | null
          quote_reference_number: string | null
          requested_lead_time_weeks: number | null
          tax_amount: number | null
          tax_percent: number | null
          tax_type: string | null
          total_incl_tax: number | null
          total_price: number | null
          unit: string | null
          unit_price: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          customer_part_number?: string | null
          delivery_date?: string | null
          deviation_notes?: string | null
          hsn_code?: string | null
          id?: string
          internal_part_number?: string | null
          item_description?: string | null
          line_item_number: number
          match_status?: Database["public"]["Enums"]["match_status"] | null
          matched_quote_line_id?: string | null
          po_id: string
          po_quantity?: number | null
          quote_reference_number?: string | null
          requested_lead_time_weeks?: number | null
          tax_amount?: number | null
          tax_percent?: number | null
          tax_type?: string | null
          total_incl_tax?: number | null
          total_price?: number | null
          unit?: string | null
          unit_price?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          customer_part_number?: string | null
          delivery_date?: string | null
          deviation_notes?: string | null
          hsn_code?: string | null
          id?: string
          internal_part_number?: string | null
          item_description?: string | null
          line_item_number?: number
          match_status?: Database["public"]["Enums"]["match_status"] | null
          matched_quote_line_id?: string | null
          po_id?: string
          po_quantity?: number | null
          quote_reference_number?: string | null
          requested_lead_time_weeks?: number | null
          tax_amount?: number | null
          tax_percent?: number | null
          tax_type?: string | null
          total_incl_tax?: number | null
          total_price?: number | null
          unit?: string | null
          unit_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "po_line_items_matched_quote_line_id_fkey"
            columns: ["matched_quote_line_id"]
            isOneToOne: false
            referencedRelation: "quote_line_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "po_line_items_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_price: number | null
          category: string | null
          created_at: string
          hsn_code: string | null
          id: string
          part_name: string
          part_number: string
          tax_class: string | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          base_price?: number | null
          category?: string | null
          created_at?: string
          hsn_code?: string | null
          id?: string
          part_name: string
          part_number: string
          tax_class?: string | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          base_price?: number | null
          category?: string | null
          created_at?: string
          hsn_code?: string | null
          id?: string
          part_name?: string
          part_number?: string
          tax_class?: string | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      purchase_orders: {
        Row: {
          analysis_summary: Json | null
          billing_gst_number: string | null
          cancellation_clause: string | null
          created_at: string
          customer_code: string | null
          customer_id: string | null
          customer_name: string
          delivery_mode: string | null
          force_majeure_clause: string | null
          id: string
          incoterms: string | null
          invoicing_address: string | null
          payment_terms: string | null
          po_number: string
          po_received_date: string
          processed_by: string | null
          quote_id: string | null
          quote_number: string | null
          requested_delivery_date: string | null
          special_remarks: string | null
          status: Database["public"]["Enums"]["po_status"] | null
          updated_at: string
          user_id: string | null
          warranty_terms: string | null
        }
        Insert: {
          analysis_summary?: Json | null
          billing_gst_number?: string | null
          cancellation_clause?: string | null
          created_at?: string
          customer_code?: string | null
          customer_id?: string | null
          customer_name: string
          delivery_mode?: string | null
          force_majeure_clause?: string | null
          id?: string
          incoterms?: string | null
          invoicing_address?: string | null
          payment_terms?: string | null
          po_number: string
          po_received_date: string
          processed_by?: string | null
          quote_id?: string | null
          quote_number?: string | null
          requested_delivery_date?: string | null
          special_remarks?: string | null
          status?: Database["public"]["Enums"]["po_status"] | null
          updated_at?: string
          user_id?: string | null
          warranty_terms?: string | null
        }
        Update: {
          analysis_summary?: Json | null
          billing_gst_number?: string | null
          cancellation_clause?: string | null
          created_at?: string
          customer_code?: string | null
          customer_id?: string | null
          customer_name?: string
          delivery_mode?: string | null
          force_majeure_clause?: string | null
          id?: string
          incoterms?: string | null
          invoicing_address?: string | null
          payment_terms?: string | null
          po_number?: string
          po_received_date?: string
          processed_by?: string | null
          quote_id?: string | null
          quote_number?: string | null
          requested_delivery_date?: string | null
          special_remarks?: string | null
          status?: Database["public"]["Enums"]["po_status"] | null
          updated_at?: string
          user_id?: string | null
          warranty_terms?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_line_items: {
        Row: {
          created_at: string
          customs_duty_percent: number | null
          drawing_number: string | null
          exchange_rate: number | null
          freight_cost_unit: number | null
          gp_in_amount: number | null
          gp_percent: number | null
          hsn_code: string | null
          id: string
          item: string | null
          landed_cost_per_unit: number | null
          line_item_number: number
          local_transport: number | null
          other_local_expenses: number | null
          packing_forwarding_cost: number | null
          part_name: string | null
          part_number: string | null
          quote_id: string
          quote_line_item_status:
            | Database["public"]["Enums"]["quote_line_status"]
            | null
          quoted_currency: string | null
          quoted_lead_time_days: number | null
          quoted_quantity: number | null
          quoted_unit_price: number | null
          special_terms: string | null
          supplier: string | null
          supplier_currency: string | null
          supplier_quote_number: string | null
          supplier_unit_price: number | null
          total_cost_price: number | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customs_duty_percent?: number | null
          drawing_number?: string | null
          exchange_rate?: number | null
          freight_cost_unit?: number | null
          gp_in_amount?: number | null
          gp_percent?: number | null
          hsn_code?: string | null
          id?: string
          item?: string | null
          landed_cost_per_unit?: number | null
          line_item_number: number
          local_transport?: number | null
          other_local_expenses?: number | null
          packing_forwarding_cost?: number | null
          part_name?: string | null
          part_number?: string | null
          quote_id: string
          quote_line_item_status?:
            | Database["public"]["Enums"]["quote_line_status"]
            | null
          quoted_currency?: string | null
          quoted_lead_time_days?: number | null
          quoted_quantity?: number | null
          quoted_unit_price?: number | null
          special_terms?: string | null
          supplier?: string | null
          supplier_currency?: string | null
          supplier_quote_number?: string | null
          supplier_unit_price?: number | null
          total_cost_price?: number | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customs_duty_percent?: number | null
          drawing_number?: string | null
          exchange_rate?: number | null
          freight_cost_unit?: number | null
          gp_in_amount?: number | null
          gp_percent?: number | null
          hsn_code?: string | null
          id?: string
          item?: string | null
          landed_cost_per_unit?: number | null
          line_item_number?: number
          local_transport?: number | null
          other_local_expenses?: number | null
          packing_forwarding_cost?: number | null
          part_name?: string | null
          part_number?: string | null
          quote_id?: string
          quote_line_item_status?:
            | Database["public"]["Enums"]["quote_line_status"]
            | null
          quoted_currency?: string | null
          quoted_lead_time_days?: number | null
          quoted_quantity?: number | null
          quoted_unit_price?: number | null
          special_terms?: string | null
          supplier?: string | null
          supplier_currency?: string | null
          supplier_quote_number?: string | null
          supplier_unit_price?: number | null
          total_cost_price?: number | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_line_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          advance_payment_percent: number | null
          balance_payment_description: string | null
          cancellation_clause: string | null
          created_at: string
          customer_code: string | null
          customer_facing_version: boolean | null
          customer_id: string | null
          customer_name: string
          delivery_condition: string | null
          delivery_lead_time_days: number | null
          editable: boolean | null
          force_majeure_clause: string | null
          freight_inclusion_clause: string | null
          id: string
          offer_validity_days: number | null
          offer_validity_until: string | null
          payment_terms: string | null
          price_basis: string | null
          quote_created_by: string | null
          quote_date: string
          quote_number: string
          sale_term: string | null
          status: Database["public"]["Enums"]["quote_status"] | null
          tax_percent: number | null
          tax_type: string | null
          total_quote_amount: number | null
          updated_at: string
          user_id: string | null
          warranty_terms: string | null
        }
        Insert: {
          advance_payment_percent?: number | null
          balance_payment_description?: string | null
          cancellation_clause?: string | null
          created_at?: string
          customer_code?: string | null
          customer_facing_version?: boolean | null
          customer_id?: string | null
          customer_name: string
          delivery_condition?: string | null
          delivery_lead_time_days?: number | null
          editable?: boolean | null
          force_majeure_clause?: string | null
          freight_inclusion_clause?: string | null
          id?: string
          offer_validity_days?: number | null
          offer_validity_until?: string | null
          payment_terms?: string | null
          price_basis?: string | null
          quote_created_by?: string | null
          quote_date: string
          quote_number: string
          sale_term?: string | null
          status?: Database["public"]["Enums"]["quote_status"] | null
          tax_percent?: number | null
          tax_type?: string | null
          total_quote_amount?: number | null
          updated_at?: string
          user_id?: string | null
          warranty_terms?: string | null
        }
        Update: {
          advance_payment_percent?: number | null
          balance_payment_description?: string | null
          cancellation_clause?: string | null
          created_at?: string
          customer_code?: string | null
          customer_facing_version?: boolean | null
          customer_id?: string | null
          customer_name?: string
          delivery_condition?: string | null
          delivery_lead_time_days?: number | null
          editable?: boolean | null
          force_majeure_clause?: string | null
          freight_inclusion_clause?: string | null
          id?: string
          offer_validity_days?: number | null
          offer_validity_until?: string | null
          payment_terms?: string | null
          price_basis?: string | null
          quote_created_by?: string | null
          quote_date?: string
          quote_number?: string
          sale_term?: string | null
          status?: Database["public"]["Enums"]["quote_status"] | null
          tax_percent?: number | null
          tax_type?: string | null
          total_quote_amount?: number | null
          updated_at?: string
          user_id?: string | null
          warranty_terms?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_config: {
        Row: {
          applicable_on: string
          created_at: string
          gst_category: string | null
          id: string
          tax_percent: number
          tax_type: string
        }
        Insert: {
          applicable_on: string
          created_at?: string
          gst_category?: string | null
          id?: string
          tax_percent: number
          tax_type: string
        }
        Update: {
          applicable_on?: string
          created_at?: string
          gst_category?: string | null
          id?: string
          tax_percent?: number
          tax_type?: string
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
      match_status: "Matched" | "Mismatch" | "Unquoted" | "Price Deviation"
      po_status:
        | "Draft"
        | "Under Review"
        | "Amendment Needed"
        | "Accepted"
        | "Rejected"
      quote_line_status: "Quoted" | "Optional" | "Free Spare"
      quote_status: "Draft" | "Submitted" | "Accepted" | "Expired"
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
      match_status: ["Matched", "Mismatch", "Unquoted", "Price Deviation"],
      po_status: [
        "Draft",
        "Under Review",
        "Amendment Needed",
        "Accepted",
        "Rejected",
      ],
      quote_line_status: ["Quoted", "Optional", "Free Spare"],
      quote_status: ["Draft", "Submitted", "Accepted", "Expired"],
    },
  },
} as const
