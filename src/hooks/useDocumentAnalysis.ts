
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';
import { parsePOPdf, parseQuotePdf, ParsedPOData, ParsedQuoteData } from '@/utils/pdfParser';

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
      // Parse PDF files
      setProgress(20);
      const parsedPO = await parsePOPdf(poFile);
      
      setProgress(40);
      const parsedQuote = await parseQuotePdf(quoteFile);
      
      setProgress(60);
      
      // Compare the extracted data
      const comparison = comparePoAndQuote(parsedPO, parsedQuote);
      
      setProgress(80);

      // Create database objects
      const user = await supabase.auth.getUser();
      
      const purchaseOrder: PurchaseOrder = {
        id: crypto.randomUUID(),
        po_number: parsedPO.poNumber,
        po_received_date: parsedPO.poReceivedDate,
        customer_name: parsedPO.customerName,
        customer_code: parsedPO.customerCode || null,
        customer_id: null,
        quote_number: parsedQuote.quoteNumber,
        quote_id: null,
        payment_terms: parsedPO.paymentTerms || null,
        delivery_mode: parsedPO.deliveryMode || null,
        requested_delivery_date: parsedPO.requestedDeliveryDate || null,
        incoterms: parsedPO.incoterms || null,
        warranty_terms: parsedPO.warrantyTerms || null,
        cancellation_clause: null,
        force_majeure_clause: null,
        special_remarks: null,
        invoicing_address: null,
        billing_gst_number: null,
        status: 'Draft',
        processed_by: null,
        analysis_summary: null,
        user_id: user.data.user?.id || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const quote: Quote = {
        id: crypto.randomUUID(),
        quote_number: parsedQuote.quoteNumber,
        quote_date: parsedQuote.quoteDate,
        customer_name: parsedQuote.customerName,
        customer_code: parsedQuote.customerCode || null,
        customer_id: null,
        offer_validity_until: null,
        sale_term: null,
        price_basis: null,
        quote_created_by: null,
        delivery_condition: parsedQuote.deliveryTerms || null,
        payment_terms: parsedQuote.paymentTerms || null,
        freight_inclusion_clause: null,
        warranty_terms: parsedQuote.warrantyTerms || null,
        cancellation_clause: null,
        force_majeure_clause: null,
        advance_payment_percent: null,
        tax_percent: null,
        tax_type: null,
        offer_validity_days: null,
        delivery_lead_time_days: null,
        balance_payment_description: null,
        total_quote_amount: null,
        editable: true,
        customer_facing_version: false,
        status: 'Draft',
        user_id: user.data.user?.id || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setProgress(100);
      setAnalysisStatus('complete');
      
      const result: AnalysisResult = {
        purchaseOrder,
        quote,
        lineItemsComparison: comparison.lineItems,
        termsComparison: comparison.terms,
        summary: comparison.summary
      };

      setAnalysisResult(result);

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

  const comparePoAndQuote = (po: ParsedPOData, quote: ParsedQuoteData) => {
    const lineItemsComparison: any[] = [];
    let matchedItems = 0;
    let mismatchedItems = 0;

    // Compare line items
    po.lineItems.forEach(poItem => {
      const quoteItem = quote.lineItems.find(qi => 
        qi.partNumber.toLowerCase() === poItem.partNumber.toLowerCase()
      );

      let status = 'matched';
      const issues: string[] = [];
      let priceVariance = 0;

      if (!quoteItem) {
        status = 'mismatched';
        issues.push('Part not found in quote');
        mismatchedItems++;
      } else {
        // Check price variance
        priceVariance = ((poItem.unitPrice - quoteItem.quotedUnitPrice) / quoteItem.quotedUnitPrice) * 100;
        
        if (Math.abs(priceVariance) > 5) {
          status = 'mismatched';
          issues.push('Price variance exceeds 5%');
          mismatchedItems++;
        } else if (Math.abs(priceVariance) > 0) {
          status = 'price_deviation';
          issues.push('Minor price difference');
          matchedItems++;
        } else {
          matchedItems++;
        }

        // Check quantity
        if (poItem.quantity !== quoteItem.quotedQuantity) {
          status = 'mismatched';
          issues.push('Quantity mismatch');
        }
      }

      lineItemsComparison.push({
        poItem: {
          line_item_number: poItem.lineNumber,
          customer_part_number: poItem.partNumber,
          item_description: poItem.description,
          unit_price: poItem.unitPrice,
          po_quantity: poItem.quantity,
          total_price: poItem.totalPrice
        },
        quoteItem: quoteItem ? {
          line_item_number: quoteItem.lineNumber,
          part_number: quoteItem.partNumber,
          part_name: quoteItem.partName,
          quoted_unit_price: quoteItem.quotedUnitPrice,
          quoted_quantity: quoteItem.quotedQuantity
        } : null,
        status,
        issues,
        priceVariance: Math.abs(priceVariance)
      });
    });

    // Compare terms
    const termsComparison: any[] = [];
    
    if (po.paymentTerms && quote.paymentTerms) {
      termsComparison.push({
        category: 'Payment Terms',
        poTerm: po.paymentTerms,
        quoteTerm: quote.paymentTerms,
        status: po.paymentTerms.toLowerCase() === quote.paymentTerms.toLowerCase() ? 'matched' : 'mismatched',
        risk: po.paymentTerms.toLowerCase() === quote.paymentTerms.toLowerCase() ? 'low' : 'medium'
      });
    }

    if (po.warrantyTerms && quote.warrantyTerms) {
      termsComparison.push({
        category: 'Warranty Terms',
        poTerm: po.warrantyTerms,
        quoteTerm: quote.warrantyTerms,
        status: po.warrantyTerms.toLowerCase() === quote.warrantyTerms.toLowerCase() ? 'matched' : 'mismatched',
        risk: po.warrantyTerms.toLowerCase() === quote.warrantyTerms.toLowerCase() ? 'low' : 'medium'
      });
    }

    // Generate recommendations
    const amendmentText: string[] = [];
    
    if (mismatchedItems > 0) {
      amendmentText.push(`${mismatchedItems} line items require price/quantity adjustments`);
    }
    
    termsComparison.forEach(term => {
      if (term.status === 'mismatched') {
        amendmentText.push(`Align ${term.category}: "${term.quoteTerm}" as per original quote`);
      }
    });

    return {
      lineItems: lineItemsComparison,
      terms: termsComparison,
      summary: {
        totalMatched: matchedItems,
        totalMismatched: mismatchedItems,
        recommendation: mismatchedItems > 0 || termsComparison.some(t => t.status === 'mismatched') ? 'amend' : 'accept',
        amendmentText: amendmentText.length > 0 ? amendmentText : undefined
      }
    };
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

      // Save line items
      if (analysisResult.lineItemsComparison.length > 0) {
        const lineItems = analysisResult.lineItemsComparison.map((comparison, index) => ({
          po_id: data.id,
          line_item_number: comparison.poItem.line_item_number,
          customer_part_number: comparison.poItem.customer_part_number,
          item_description: comparison.poItem.item_description,
          unit_price: comparison.poItem.unit_price,
          po_quantity: comparison.poItem.po_quantity,
          total_price: comparison.poItem.total_price,
          match_status: comparison.status === 'matched' ? 'Matched' : 'Mismatch',
          deviation_notes: comparison.issues.join(', ') || null
        }));

        const { error: lineItemsError } = await supabase
          .from('po_line_items')
          .insert(lineItems);

        if (lineItemsError) throw lineItemsError;
      }

      toast({
        title: "Success",
        description: "Purchase Order saved to database with extracted data",
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
