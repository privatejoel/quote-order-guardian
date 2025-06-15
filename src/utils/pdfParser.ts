import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export interface ParsedPOData {
  poNumber: string;
  customerName: string;
  customerCode?: string;
  poReceivedDate: string;
  paymentTerms?: string;
  deliveryMode?: string;
  requestedDeliveryDate?: string;
  incoterms?: string;
  warrantyTerms?: string;
  lineItems: POLineItem[];
}

export interface POLineItem {
  lineNumber: number;
  partNumber: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit?: string;
}

export interface ParsedQuoteData {
  quoteNumber: string;
  customerName: string;
  customerCode?: string;
  quoteDate: string;
  paymentTerms?: string;
  deliveryTerms?: string;
  warrantyTerms?: string;
  lineItems: QuoteLineItem[];
}

export interface QuoteLineItem {
  lineNumber: number;
  partNumber: string;
  partName: string;
  quotedQuantity: number;
  quotedUnitPrice: number;
  unit?: string;
}

export const parsePOPdf = async (file: File): Promise<ParsedPOData> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    console.log('PO PDF Text:', fullText);

    // Extract PO data using regex patterns
    const poNumber = extractPoNumber(fullText);
    const customerName = extractCustomerName(fullText);
    const customerCode = extractCustomerCode(fullText);
    const poReceivedDate = extractPoDate(fullText);
    const paymentTerms = extractPaymentTerms(fullText);
    const deliveryMode = extractDeliveryMode(fullText);
    const requestedDeliveryDate = extractDeliveryDate(fullText);
    const incoterms = extractIncoterms(fullText);
    const warrantyTerms = extractWarrantyTerms(fullText);
    const lineItems = extractPOLineItems(fullText);

    return {
      poNumber: poNumber || `PO-${Date.now()}`,
      customerName: customerName || 'Unknown Customer',
      customerCode,
      poReceivedDate: poReceivedDate || new Date().toISOString().split('T')[0],
      paymentTerms,
      deliveryMode,
      requestedDeliveryDate,
      incoterms,
      warrantyTerms,
      lineItems
    };
  } catch (error) {
    console.error('Error parsing PO PDF:', error);
    throw new Error('Failed to parse PO PDF');
  }
};

export const parseQuotePdf = async (file: File): Promise<ParsedQuoteData> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    console.log('Quote PDF Text:', fullText);

    // Extract Quote data using regex patterns
    const quoteNumber = extractQuoteNumber(fullText);
    const customerName = extractCustomerName(fullText);
    const customerCode = extractCustomerCode(fullText);
    const quoteDate = extractQuoteDate(fullText);
    const paymentTerms = extractPaymentTerms(fullText);
    const deliveryTerms = extractDeliveryTerms(fullText);
    const warrantyTerms = extractWarrantyTerms(fullText);
    const lineItems = extractQuoteLineItems(fullText);

    return {
      quoteNumber: quoteNumber || `QT-${Date.now()}`,
      customerName: customerName || 'Unknown Customer',
      customerCode,
      quoteDate: quoteDate || new Date().toISOString().split('T')[0],
      paymentTerms,
      deliveryTerms,
      warrantyTerms,
      lineItems
    };
  } catch (error) {
    console.error('Error parsing Quote PDF:', error);
    throw new Error('Failed to parse Quote PDF');
  }
};

// Helper functions for text extraction
const extractPoNumber = (text: string): string | null => {
  const patterns = [
    /PO\s*[#:]\s*([A-Z0-9\-]+)/i,
    /Purchase\s*Order\s*[#:]\s*([A-Z0-9\-]+)/i,
    /P\.?O\.?\s*[#:]\s*([A-Z0-9\-]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const extractQuoteNumber = (text: string): string | null => {
  const patterns = [
    /Quote\s*[#:]\s*([A-Z0-9\-]+)/i,
    /Quotation\s*[#:]\s*([A-Z0-9\-]+)/i,
    /QT\s*[#:]\s*([A-Z0-9\-]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const extractCustomerName = (text: string): string | null => {
  const patterns = [
    /Customer[:\s]+([A-Za-z\s&.,]+?)(?:\n|$)/i,
    /Bill\s*to[:\s]+([A-Za-z\s&.,]+?)(?:\n|$)/i,
    /Vendor[:\s]+([A-Za-z\s&.,]+?)(?:\n|$)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return null;
};

const extractCustomerCode = (text: string): string | null => {
  const patterns = [
    /Customer\s*Code[:\s]+([A-Z0-9]+)/i,
    /Vendor\s*Code[:\s]+([A-Z0-9]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const extractPoDate = (text: string): string | null => {
  const patterns = [
    /PO\s*Date[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /Date[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const date = new Date(match[1]);
      return date.toISOString().split('T')[0];
    }
  }
  return null;
};

const extractQuoteDate = (text: string): string | null => {
  const patterns = [
    /Quote\s*Date[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /Date[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const date = new Date(match[1]);
      return date.toISOString().split('T')[0];
    }
  }
  return null;
};

const extractPaymentTerms = (text: string): string | null => {
  const patterns = [
    /Payment\s*Terms?[:\s]+([^.\n]+)/i,
    /Payment[:\s]+([^.\n]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return null;
};

const extractDeliveryMode = (text: string): string | null => {
  const patterns = [
    /Delivery\s*Mode[:\s]+([^.\n]+)/i,
    /Shipping[:\s]+([^.\n]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return null;
};

const extractDeliveryTerms = (text: string): string | null => {
  const patterns = [
    /Delivery\s*Terms?[:\s]+([^.\n]+)/i,
    /Delivery[:\s]+([^.\n]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return null;
};

const extractDeliveryDate = (text: string): string | null => {
  const patterns = [
    /Delivery\s*Date[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /Required\s*Date[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const date = new Date(match[1]);
      return date.toISOString().split('T')[0];
    }
  }
  return null;
};

const extractIncoterms = (text: string): string | null => {
  const patterns = [
    /Incoterms?[:\s]+([A-Z]{3})/i,
    /(FOB|CIF|DDP|EXW|FCA)[:\s]/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const extractWarrantyTerms = (text: string): string | null => {
  const patterns = [
    /Warranty[:\s]+([^.\n]+)/i,
    /Guarantee[:\s]+([^.\n]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return null;
};

const extractPOLineItems = (text: string): POLineItem[] => {
  const items: POLineItem[] = [];
  
  // Look for table-like structures with line items
  const lines = text.split('\n');
  let itemCounter = 1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Pattern to match line items (adjust based on your PDF format)
    const itemMatch = line.match(/(\w+[\w\-]*)\s+(.+?)\s+(\d+)\s+([\d,]+\.?\d*)\s+([\d,]+\.?\d*)/);
    
    if (itemMatch) {
      const [, partNumber, description, quantity, unitPrice, totalPrice] = itemMatch;
      
      items.push({
        lineNumber: itemCounter++,
        partNumber: partNumber,
        description: description.trim(),
        quantity: parseInt(quantity),
        unitPrice: parseFloat(unitPrice.replace(/,/g, '')),
        totalPrice: parseFloat(totalPrice.replace(/,/g, '')),
        unit: 'Nos'
      });
    }
  }
  
  return items;
};

const extractQuoteLineItems = (text: string): QuoteLineItem[] => {
  const items: QuoteLineItem[] = [];
  
  // Look for table-like structures with line items
  const lines = text.split('\n');
  let itemCounter = 1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Pattern to match line items (adjust based on your PDF format)
    const itemMatch = line.match(/(\w+[\w\-]*)\s+(.+?)\s+(\d+)\s+([\d,]+\.?\d*)/);
    
    if (itemMatch) {
      const [, partNumber, partName, quantity, unitPrice] = itemMatch;
      
      items.push({
        lineNumber: itemCounter++,
        partNumber: partNumber,
        partName: partName.trim(),
        quotedQuantity: parseInt(quantity),
        quotedUnitPrice: parseFloat(unitPrice.replace(/,/g, '')),
        unit: 'Nos'
      });
    }
  }
  
  return items;
};
