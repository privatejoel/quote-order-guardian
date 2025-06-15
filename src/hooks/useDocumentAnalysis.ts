
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';
import { extractDataFromPdf, ExtractedData } from '@/utils/simplePdfParser';

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
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'extracting' | 'validating' | 'analyzing' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [extractedPOData, setExtractedPOData] = useState<ExtractedData | null>(null);
  const [extractedQuoteData, setExtractedQuoteData] = useState<ExtractedData | null>(null);
  const [validationStep, setValidationStep] = useState<'po' | 'quote' | 'analysis' | null>(null);
  const { toast } = useToast();

  const startExtraction = async (poFile: File, quoteFile: File) => {
    setAnalysisStatus('extracting');
    setProgress(0);

    try {
      // Extract data from PO
      setProgress(25);
      const poData = await extractDataFromPdf(poFile, 'po');
      setExtractedPOData(poData);
      
      setProgress(50);
      
      // Extract data from Quote
      const quoteData = await extractDataFromPdf(quoteFile, 'quote');
      setExtractedQuoteData(quoteData);
      
      setProgress(75);
      
      // Move to validation step
      setAnalysisStatus('validating');
      setValidationStep('po');
      setProgress(100);

      toast({
        title: "Data extracted successfully",
        description: "Please review and validate the extracted data.",
      });

    } catch (error: any) {
      console.error('Extraction error:', error);
      toast({
        title: "Extraction failed",
        description: error.message,
        variant: "destructive",
      });
      setAnalysisStatus('idle');
    }
  };

  const validatePOData = (validatedData: ExtractedData) => {
    setExtractedPOData(validatedData);
    setValidationStep('quote');
    toast({
      title: "PO data validated",
      description: "Now validating quote data...",
    });
  };

  const validateQuoteData = (validatedData: ExtractedData) => {
    setExtractedQuoteData(validatedData);
    setValidationStep('analysis');
    
    // Proceed with analysis
    performAnalysis(extractedPOData!, validatedData);
  };

  const performAnalysis = async (poData: ExtractedData, quoteData: ExtractedData) => {
    setAnalysisStatus('analyzing');
    setProgress(0);

    try {
      setProgress(30);
      
      // Compare the validated data
      const comparison = compareExtractedData(poData, quoteData);
      
      setProgress(60);

      // Create database objects
      const user = await supabase.auth.getUser();
      
      const purchaseOrder: PurchaseOrder = {
        id: crypto.randomUUID(),
        po_number: poData.poNumber || `PO-${Date.now()}`,
        po_received_date: poData.date || new Date().toISOString().split('T')[0],
        customer_name: poData.customerName || 'Unknown Customer',
        customer_code: poData.customerCode || null,
        customer_id: null,
        quote_number: quoteData.quoteNumber || null,
        quote_id: null,
        payment_terms: poData.paymentTerms || null,
        delivery_mode: poData.deliveryTerms || null,
        requested_delivery_date: null,
        incoterms: null,
        warranty_terms: poData.warrantyTerms || null,
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
        quote_number: quoteData.quoteNumber || `QT-${Date.now()}`,
        quote_date: quoteData.date || new Date().toISOString().split('T')[0],
        customer_name: quoteData.customerName || 'Unknown Customer',
        customer_code: quoteData.customerCode || null,
        customer_id: null,
        offer_validity_until: null,
        sale_term: null,
        price_basis: null,
        quote_created_by: null,
        delivery_condition: quoteData.deliveryTerms || null,
        payment_terms: quoteData.paymentTerms || null,
        freight_inclusion_clause: null,
        warranty_terms: quoteData.warrantyTerms || null,
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
      setValidationStep(null);
      
      const result: AnalysisResult = {
        purchaseOrder,
        quote,
        lineItemsComparison: comparison.lineItems,
        termsComparison: comparison.terms,
        summary: comparison.summary
      };

      setAnalysisResult(result);

      toast({
        title: "Analysis complete",
        description: "Review the comparison results below.",
      });

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

  const compareExtractedData = (poData: ExtractedData, quoteData: ExtractedData) => {
    const lineItemsComparison: any[] = [];
    let matchedItems = 0;
    let mismatchedItems = 0;

    // Compare line items
    poData.lineItems.forEach(poItem => {
      const quoteItem = quoteData.lineItems.find(qi => 
        qi.partNumber?.toLowerCase() === poItem.partNumber?.toLowerCase()
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
        if (poItem.unitPrice && quoteItem.unitPrice) {
          priceVariance = ((poItem.unitPrice - quoteItem.unitPrice) / quoteItem.unitPrice) * 100;
          
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
        }

        // Check quantity
        if (poItem.quantity !== quoteItem.quantity) {
          status = 'mismatched';
          issues.push('Quantity mismatch');
        }
      }

      lineItemsComparison.push({
        poItem: {
          line_item_number: lineItemsComparison.length + 1,
          customer_part_number: poItem.partNumber || '',
          item_description: poItem.description || '',
          unit_price: poItem.unitPrice || 0,
          po_quantity: poItem.quantity || 0,
          total_price: poItem.totalPrice || (poItem.unitPrice && poItem.quantity ? poItem.unitPrice * poItem.quantity : 0)
        },
        quoteItem: quoteItem ? {
          line_item_number: lineItemsComparison.length + 1,
          part_number: quoteItem.partNumber || '',
          part_name: quoteItem.description || '',
          quoted_unit_price: quoteItem.unitPrice || 0,
          quoted_quantity: quoteItem.quantity || 0
        } : null,
        status,
        issues,
        priceVariance: Math.abs(priceVariance)
      });
    });

    // Compare terms
    const termsComparison: any[] = [];
    
    if (poData.paymentTerms && quoteData.paymentTerms) {
      termsComparison.push({
        category: 'Payment Terms',
        poTerm: poData.paymentTerms,
        quoteTerm: quoteData.paymentTerms,
        status: poData.paymentTerms.toLowerCase() === quoteData.paymentTerms.toLowerCase() ? 'matched' : 'mismatched',
        risk: poData.paymentTerms.toLowerCase() === quoteData.paymentTerms.toLowerCase() ? 'low' : 'medium'
      });
    }

    if (poData.warrantyTerms && quoteData.warrantyTerms) {
      termsComparison.push({
        category: 'Warranty Terms',
        poTerm: poData.warrantyTerms,
        quoteTerm: quoteData.warrantyTerms,
        status: poData.warrantyTerms.toLowerCase() === quoteData.warrantyTerms.toLowerCase() ? 'matched' : 'mismatched',
        risk: poData.warrantyTerms.toLowerCase() === quoteData.warrantyTerms.toLowerCase() ? 'low' : 'medium'
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

    const hasAmendments = mismatchedItems > 0 || termsComparison.some(t => t.status === 'mismatched');

    return {
      lineItems: lineItemsComparison,
      terms: termsComparison,
      summary: {
        totalMatched: matchedItems,
        totalMismatched: mismatchedItems,
        recommendation: hasAmendments ? 'amend' as const : 'accept' as const,
        amendmentText: amendmentText.length > 0 ? amendmentText : undefined
      }
    };
  };

  const cancelValidation = () => {
    setAnalysisStatus('idle');
    setValidationStep(null);
    setExtractedPOData(null);
    setExtractedQuoteData(null);
    setProgress(0);
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
        const lineItems = analysisResult.lineItemsComparison.map((comparison) => ({
          po_id: data.id,
          line_item_number: comparison.poItem.line_item_number,
          customer_part_number: comparison.poItem.customer_part_number,
          item_description: comparison.poItem.item_description,
          unit_price: comparison.poItem.unit_price,
          po_quantity: comparison.poItem.po_quantity,
          total_price: comparison.poItem.total_price,
          match_status: comparison.status === 'matched' ? 'Matched' as const : 'Mismatch' as const,
          deviation_notes: comparison.issues.length > 0 ? comparison.issues.join(', ') : null
        }));

        const { error: lineItemsError } = await supabase
          .from('po_line_items')
          .insert(lineItems);

        if (lineItemsError) throw lineItemsError;
      }

      toast({
        title: "Success",
        description: "Purchase Order saved to database with validated data",
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
    extractedPOData,
    extractedQuoteData,
    validationStep,
    startExtraction,
    validatePOData,
    validateQuoteData,
    cancelValidation,
    savePOToDatabase
  };
};
