
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

type PurchaseOrder = Tables<'purchase_orders'>;
type Quote = Tables<'quotes'>;

interface AnalysisResult {
  purchaseOrder: PurchaseOrder;
  quote: Quote | null;
  lineItemsComparison: any[];
  termsComparison: any[];
  summary: {
    totalMatched: number;
    totalMismatched: number;
    recommendation: 'accept' | 'amend';
    amendmentText?: string[];
  };
}

export const useDocumentAnalysis = () => {
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzePOAndQuote = async (poFile: File, quoteFile: File) => {
    setAnalysisStatus('analyzing');
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // For now, create mock data that follows our database schema
      // TODO: Replace with actual PDF parsing and comparison logic
      const mockPO: PurchaseOrder = {
        id: crypto.randomUUID(),
        po_number: `PO-${Date.now()}`,
        po_received_date: new Date().toISOString().split('T')[0],
        customer_name: 'ACME Manufacturing Ltd.',
        customer_code: 'ACME001',
        customer_id: null,
        quote_number: 'QT-2024-001',
        quote_id: null,
        payment_terms: '30 days net',
        delivery_mode: 'DDP Destination',
        requested_delivery_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        incoterms: 'DDP',
        warranty_terms: '24 months',
        cancellation_clause: null,
        force_majeure_clause: null,
        special_remarks: null,
        invoicing_address: null,
        billing_gst_number: null,
        status: 'Draft',
        processed_by: null,
        analysis_summary: null,
        user_id: (await supabase.auth.getUser()).data.user?.id || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Simulate API analysis
      setTimeout(() => {
        setProgress(100);
        setAnalysisStatus('complete');
        
        const mockResult: AnalysisResult = {
          purchaseOrder: mockPO,
          quote: null, // Would be fetched based on quote_number
          lineItemsComparison: [
            {
              poItem: {
                line_item_number: 1,
                customer_part_number: 'IL0-0100',
                item_description: 'Hydraulic Pump Assembly',
                unit_price: 38000,
                po_quantity: 2,
                total_price: 76000
              },
              quoteItem: {
                line_item_number: 1,
                part_number: 'IL0-0100',
                part_name: 'Hydraulic Pump Assembly',
                quoted_unit_price: 36080,
                quoted_quantity: 2
              },
              status: 'mismatched',
              issues: ['Unit price mismatch'],
              priceVariance: 5.3
            }
          ],
          termsComparison: [
            {
              category: 'Payment Terms',
              poTerm: '30 days net',
              quoteTerm: '45 days net',
              status: 'mismatched',
              risk: 'medium'
            }
          ],
          summary: {
            totalMatched: 1,
            totalMismatched: 1,
            recommendation: 'amend',
            amendmentText: [
              'Revise unit price for Part IL0-0100 to ₹36,080.00 as per our quote dated April 24.',
              'Confirm payment terms as 45 days net as originally quoted.'
            ]
          }
        };

        setAnalysisResult(mockResult);
        clearInterval(progressInterval);
      }, 3000);

    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
      setAnalysisStatus('idle');
    }
  };

  const savePOToDatabase = async () => {
    if (!analysisResult) return;

    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .insert(analysisResult.purchaseOrder)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Purchase Order saved to database",
      });

      return data;
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    analysisStatus,
    progress,
    analysisResult,
    analyzePOAndQuote,
    savePOToDatabase
  };
};
