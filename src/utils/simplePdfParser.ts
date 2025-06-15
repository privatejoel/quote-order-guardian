
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export interface ExtractedData {
  poNumber?: string;
  quoteNumber?: string;
  customerName?: string;
  customerCode?: string;
  date?: string;
  paymentTerms?: string;
  deliveryTerms?: string;
  warrantyTerms?: string;
  lineItems: ExtractedLineItem[];
  confidence: 'high' | 'medium' | 'low';
}

export interface ExtractedLineItem {
  partNumber?: string;
  description?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  confidence: 'high' | 'medium' | 'low';
}

const KEYWORDS = {
  poNumber: ['po number', 'purchase order', 'p.o.', 'po#', 'po:', 'order number'],
  quoteNumber: ['quote number', 'quotation', 'quote#', 'quote:', 'qt#'],
  customerName: ['customer', 'bill to', 'vendor', 'company'],
  customerCode: ['customer code', 'vendor code', 'code'],
  date: ['date', 'po date', 'quote date'],
  paymentTerms: ['payment terms', 'payment', 'terms'],
  deliveryTerms: ['delivery terms', 'delivery', 'shipping'],
  warrantyTerms: ['warranty', 'guarantee'],
  amount: ['total', 'amount', 'price', 'cost'],
  quantity: ['qty', 'quantity', 'qnty']
};

export const extractDataFromPdf = async (file: File, type: 'po' | 'quote'): Promise<ExtractedData> => {
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

    console.log(`${type.toUpperCase()} PDF Text:`, fullText);

    // Extract data using keyword-based approach
    const extractedData: ExtractedData = {
      lineItems: [],
      confidence: 'medium'
    };

    // Extract basic fields
    if (type === 'po') {
      extractedData.poNumber = extractFieldByKeywords(fullText, KEYWORDS.poNumber);
    } else {
      extractedData.quoteNumber = extractFieldByKeywords(fullText, KEYWORDS.quoteNumber);
    }

    extractedData.customerName = extractFieldByKeywords(fullText, KEYWORDS.customerName);
    extractedData.customerCode = extractFieldByKeywords(fullText, KEYWORDS.customerCode);
    extractedData.date = extractDateField(fullText);
    extractedData.paymentTerms = extractFieldByKeywords(fullText, KEYWORDS.paymentTerms);
    extractedData.deliveryTerms = extractFieldByKeywords(fullText, KEYWORDS.deliveryTerms);
    extractedData.warrantyTerms = extractFieldByKeywords(fullText, KEYWORDS.warrantyTerms);

    // Extract line items using simple pattern matching
    extractedData.lineItems = extractLineItems(fullText);

    // Calculate overall confidence
    extractedData.confidence = calculateConfidence(extractedData);

    return extractedData;
  } catch (error) {
    console.error('Error extracting data from PDF:', error);
    throw new Error('Failed to extract data from PDF');
  }
};

const extractFieldByKeywords = (text: string, keywords: string[]): string | undefined => {
  const lines = text.toLowerCase().split('\n');
  
  for (const line of lines) {
    for (const keyword of keywords) {
      const keywordIndex = line.indexOf(keyword.toLowerCase());
      if (keywordIndex !== -1) {
        // Extract text after the keyword
        const afterKeyword = line.substring(keywordIndex + keyword.length);
        const match = afterKeyword.match(/[:\s]*([^\n\r\t]+)/);
        if (match && match[1].trim()) {
          return match[1].trim();
        }
      }
    }
  }
  
  return undefined;
};

const extractDateField = (text: string): string | undefined => {
  const datePatterns = [
    /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/,
    /\b(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})\b/,
    /\b(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{2,4})\b/
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        const date = new Date(match[1]);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      } catch (e) {
        continue;
      }
    }
  }

  return undefined;
};

const extractLineItems = (text: string): ExtractedLineItem[] => {
  const items: ExtractedLineItem[] = [];
  const lines = text.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for lines that might contain item data
    // Pattern: part number, description, numbers (qty, price)
    const itemPattern = /([A-Z0-9\-]+)\s+(.{10,}?)\s+(\d+)\s+([\d,]+\.?\d*)\s*([\d,]+\.?\d*)?/;
    const match = line.match(itemPattern);
    
    if (match) {
      const [, partNumber, description, quantity, unitPrice, totalPrice] = match;
      
      items.push({
        partNumber: partNumber.trim(),
        description: description.trim(),
        quantity: parseInt(quantity),
        unitPrice: parseFloat(unitPrice.replace(/,/g, '')),
        totalPrice: totalPrice ? parseFloat(totalPrice.replace(/,/g, '')) : undefined,
        confidence: 'medium'
      });
    }
  }
  
  return items;
};

const calculateConfidence = (data: ExtractedData): 'high' | 'medium' | 'low' => {
  let score = 0;
  let total = 0;

  // Check main fields
  const mainFields = [
    data.poNumber || data.quoteNumber,
    data.customerName,
    data.date
  ];

  mainFields.forEach(field => {
    total++;
    if (field) score++;
  });

  // Check line items
  if (data.lineItems.length > 0) {
    total++;
    score++;
  }

  const percentage = score / total;
  
  if (percentage >= 0.8) return 'high';
  if (percentage >= 0.5) return 'medium';
  return 'low';
};
