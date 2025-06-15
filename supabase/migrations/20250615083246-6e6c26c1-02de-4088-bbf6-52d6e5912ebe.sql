
-- Create enums for status tracking and standardized values
CREATE TYPE public.po_status AS ENUM ('Draft', 'Under Review', 'Amendment Needed', 'Accepted', 'Rejected');
CREATE TYPE public.quote_status AS ENUM ('Draft', 'Submitted', 'Accepted', 'Expired');
CREATE TYPE public.match_status AS ENUM ('Matched', 'Mismatch', 'Unquoted', 'Price Deviation');
CREATE TYPE public.quote_line_status AS ENUM ('Quoted', 'Optional', 'Free Spare');

-- Create Customer Master table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_code TEXT UNIQUE NOT NULL,
  gstin TEXT,
  address TEXT,
  preferred_incoterms TEXT,
  currency TEXT DEFAULT 'INR',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Product Master table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  part_number TEXT UNIQUE NOT NULL,
  part_name TEXT NOT NULL,
  hsn_code TEXT,
  unit TEXT DEFAULT 'Nos',
  base_price DECIMAL(15,2),
  category TEXT,
  tax_class TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Tax Config table
CREATE TABLE public.tax_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tax_type TEXT NOT NULL,
  tax_percent DECIMAL(5,2) NOT NULL,
  applicable_on TEXT NOT NULL, -- 'item' or 'service'
  gst_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Quote Header table
CREATE TABLE public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_number TEXT UNIQUE NOT NULL,
  quote_date DATE NOT NULL,
  offer_validity_days INTEGER,
  offer_validity_until DATE,
  customer_name TEXT NOT NULL,
  customer_code TEXT,
  customer_id UUID REFERENCES public.customers(id),
  sale_term TEXT,
  price_basis TEXT,
  delivery_lead_time_days INTEGER,
  delivery_condition TEXT,
  payment_terms TEXT,
  freight_inclusion_clause TEXT,
  warranty_terms TEXT,
  cancellation_clause TEXT,
  force_majeure_clause TEXT,
  tax_type TEXT,
  tax_percent DECIMAL(5,2),
  advance_payment_percent DECIMAL(5,2),
  balance_payment_description TEXT,
  total_quote_amount DECIMAL(15,2),
  status quote_status DEFAULT 'Draft',
  quote_created_by TEXT,
  customer_facing_version BOOLEAN DEFAULT false,
  editable BOOLEAN DEFAULT true,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Quote Line Items table
CREATE TABLE public.quote_line_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  line_item_number INTEGER NOT NULL,
  item TEXT,
  part_name TEXT,
  part_number TEXT,
  drawing_number TEXT,
  hsn_code TEXT,
  unit TEXT DEFAULT 'Nos',
  quoted_quantity DECIMAL(15,3),
  quoted_unit_price DECIMAL(15,2),
  quoted_currency TEXT DEFAULT 'INR',
  quoted_lead_time_days INTEGER,
  supplier TEXT,
  supplier_quote_number TEXT,
  supplier_unit_price DECIMAL(15,2),
  supplier_currency TEXT,
  exchange_rate DECIMAL(10,4),
  landed_cost_per_unit DECIMAL(15,2),
  freight_cost_unit DECIMAL(15,2),
  customs_duty_percent DECIMAL(5,2),
  local_transport DECIMAL(15,2),
  packing_forwarding_cost DECIMAL(15,2),
  other_local_expenses DECIMAL(15,2),
  gp_percent DECIMAL(5,2),
  gp_in_amount DECIMAL(15,2),
  total_cost_price DECIMAL(15,2),
  special_terms TEXT,
  quote_line_item_status quote_line_status DEFAULT 'Quoted',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(quote_id, line_item_number)
);

-- Create PO Header table
CREATE TABLE public.purchase_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  po_number TEXT UNIQUE NOT NULL,
  po_received_date DATE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_code TEXT,
  customer_id UUID REFERENCES public.customers(id),
  quote_number TEXT,
  quote_id UUID REFERENCES public.quotes(id),
  payment_terms TEXT,
  delivery_mode TEXT,
  requested_delivery_date DATE,
  incoterms TEXT,
  warranty_terms TEXT,
  cancellation_clause TEXT,
  force_majeure_clause TEXT,
  special_remarks TEXT,
  invoicing_address TEXT,
  billing_gst_number TEXT,
  status po_status DEFAULT 'Draft',
  processed_by TEXT,
  analysis_summary JSONB,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create PO Line Items table
CREATE TABLE public.po_line_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  po_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  line_item_number INTEGER NOT NULL,
  customer_part_number TEXT,
  internal_part_number TEXT,
  item_description TEXT,
  hsn_code TEXT,
  unit TEXT DEFAULT 'Nos',
  po_quantity DECIMAL(15,3),
  unit_price DECIMAL(15,2),
  currency TEXT DEFAULT 'INR',
  total_price DECIMAL(15,2),
  requested_lead_time_weeks INTEGER,
  delivery_date DATE,
  tax_type TEXT,
  tax_percent DECIMAL(5,2),
  tax_amount DECIMAL(15,2),
  total_incl_tax DECIMAL(15,2),
  quote_reference_number TEXT,
  matched_quote_line_id UUID REFERENCES public.quote_line_items(id),
  deviation_notes TEXT,
  match_status match_status DEFAULT 'Matched',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(po_id, line_item_number)
);

-- Create indexes for better performance
CREATE INDEX idx_quotes_customer_code ON public.quotes(customer_code);
CREATE INDEX idx_quotes_quote_number ON public.quotes(quote_number);
CREATE INDEX idx_quotes_user_id ON public.quotes(user_id);
CREATE INDEX idx_po_customer_code ON public.purchase_orders(customer_code);
CREATE INDEX idx_po_po_number ON public.purchase_orders(po_number);
CREATE INDEX idx_po_user_id ON public.purchase_orders(user_id);
CREATE INDEX idx_quote_line_items_quote_id ON public.quote_line_items(quote_id);
CREATE INDEX idx_po_line_items_po_id ON public.po_line_items(po_id);

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.po_line_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Users can view all customers" ON public.customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view all products" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view all tax configs" ON public.tax_config FOR SELECT TO authenticated USING (true);

-- Quotes policies
CREATE POLICY "Users can view their own quotes" ON public.quotes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own quotes" ON public.quotes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own quotes" ON public.quotes FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own quotes" ON public.quotes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Quote line items policies
CREATE POLICY "Users can view quote line items for their quotes" ON public.quote_line_items FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.quotes WHERE quotes.id = quote_line_items.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "Users can create quote line items for their quotes" ON public.quote_line_items FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM public.quotes WHERE quotes.id = quote_line_items.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "Users can update quote line items for their quotes" ON public.quote_line_items FOR UPDATE TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.quotes WHERE quotes.id = quote_line_items.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "Users can delete quote line items for their quotes" ON public.quote_line_items FOR DELETE TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.quotes WHERE quotes.id = quote_line_items.quote_id AND quotes.user_id = auth.uid()));

-- Purchase Orders policies
CREATE POLICY "Users can view their own purchase orders" ON public.purchase_orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own purchase orders" ON public.purchase_orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own purchase orders" ON public.purchase_orders FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own purchase orders" ON public.purchase_orders FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- PO line items policies
CREATE POLICY "Users can view PO line items for their POs" ON public.po_line_items FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.purchase_orders WHERE purchase_orders.id = po_line_items.po_id AND purchase_orders.user_id = auth.uid()));
CREATE POLICY "Users can create PO line items for their POs" ON public.po_line_items FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM public.purchase_orders WHERE purchase_orders.id = po_line_items.po_id AND purchase_orders.user_id = auth.uid()));
CREATE POLICY "Users can update PO line items for their POs" ON public.po_line_items FOR UPDATE TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.purchase_orders WHERE purchase_orders.id = po_line_items.po_id AND purchase_orders.user_id = auth.uid()));
CREATE POLICY "Users can delete PO line items for their POs" ON public.po_line_items FOR DELETE TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.purchase_orders WHERE purchase_orders.id = po_line_items.po_id AND purchase_orders.user_id = auth.uid()));

-- Insert some sample tax configurations
INSERT INTO public.tax_config (tax_type, tax_percent, applicable_on, gst_category) VALUES
('CGST+SGST', 18.00, 'item', 'Standard'),
('IGST', 18.00, 'item', 'Standard'),
('CGST+SGST', 12.00, 'item', 'Reduced'),
('IGST', 12.00, 'item', 'Reduced'),
('CGST+SGST', 5.00, 'item', 'Lower'),
('IGST', 5.00, 'item', 'Lower');
