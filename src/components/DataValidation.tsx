
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Edit3 } from 'lucide-react';
import { ExtractedData, ExtractedLineItem } from '@/utils/simplePdfParser';

interface DataValidationProps {
  extractedData: ExtractedData;
  type: 'po' | 'quote';
  onValidate: (validatedData: ExtractedData) => void;
  onCancel: () => void;
}

export const DataValidation: React.FC<DataValidationProps> = ({
  extractedData,
  type,
  onValidate,
  onCancel
}) => {
  const [data, setData] = useState<ExtractedData>(extractedData);
  const [editingItem, setEditingItem] = useState<number | null>(null);

  const getConfidenceBadge = (confidence: 'high' | 'medium' | 'low') => {
    const colors = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[confidence]}>{confidence.toUpperCase()}</Badge>;
  };

  const getConfidenceIcon = (confidence: 'high' | 'medium' | 'low') => {
    if (confidence === 'high') {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
  };

  const updateField = (field: keyof ExtractedData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const updateLineItem = (index: number, field: keyof ExtractedLineItem, value: string | number) => {
    setData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addLineItem = () => {
    setData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, {
        partNumber: '',
        description: '',
        quantity: 0,
        unitPrice: 0,
        confidence: 'medium'
      }]
    }));
  };

  const removeLineItem = (index: number) => {
    setData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index)
    }));
  };

  const handleValidate = () => {
    onValidate(data);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {getConfidenceIcon(data.confidence)}
              Extracted Data Validation
            </CardTitle>
            {getConfidenceBadge(data.confidence)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={type === 'po' ? 'po-number' : 'quote-number'}>
                {type === 'po' ? 'PO Number' : 'Quote Number'}
              </Label>
              <Input
                id={type === 'po' ? 'po-number' : 'quote-number'}
                value={type === 'po' ? data.poNumber || '' : data.quoteNumber || ''}
                onChange={(e) => updateField(type === 'po' ? 'poNumber' : 'quoteNumber', e.target.value)}
                placeholder={`Enter ${type === 'po' ? 'PO' : 'Quote'} number`}
              />
            </div>
            
            <div>
              <Label htmlFor="customer-name">Customer Name</Label>
              <Input
                id="customer-name"
                value={data.customerName || ''}
                onChange={(e) => updateField('customerName', e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            
            <div>
              <Label htmlFor="customer-code">Customer Code</Label>
              <Input
                id="customer-code"
                value={data.customerCode || ''}
                onChange={(e) => updateField('customerCode', e.target.value)}
                placeholder="Enter customer code"
              />
            </div>
            
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={data.date || ''}
                onChange={(e) => updateField('date', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="payment-terms">Payment Terms</Label>
              <Input
                id="payment-terms"
                value={data.paymentTerms || ''}
                onChange={(e) => updateField('paymentTerms', e.target.value)}
                placeholder="Enter payment terms"
              />
            </div>
            
            <div>
              <Label htmlFor="delivery-terms">Delivery Terms</Label>
              <Input
                id="delivery-terms"
                value={data.deliveryTerms || ''}
                onChange={(e) => updateField('deliveryTerms', e.target.value)}
                placeholder="Enter delivery terms"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="warranty-terms">Warranty Terms</Label>
            <Textarea
              id="warranty-terms"
              value={data.warrantyTerms || ''}
              onChange={(e) => updateField('warrantyTerms', e.target.value)}
              placeholder="Enter warranty terms"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Line Items</CardTitle>
            <Button onClick={addLineItem} variant="outline" size="sm">
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.lineItems.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Item {index + 1}</span>
                    {getConfidenceBadge(item.confidence)}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingItem(editingItem === index ? null : index)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLineItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-5 gap-3">
                  <div>
                    <Label>Part Number</Label>
                    <Input
                      value={item.partNumber || ''}
                      onChange={(e) => updateLineItem(index, 'partNumber', e.target.value)}
                      placeholder="Part number"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label>Description</Label>
                    <Input
                      value={item.description || ''}
                      onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                      placeholder="Item description"
                    />
                  </div>
                  
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={item.quantity || ''}
                      onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      placeholder="Qty"
                    />
                  </div>
                  
                  <div>
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.unitPrice || ''}
                      onChange={(e) => updateLineItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      placeholder="Price"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {data.lineItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No line items extracted. Click "Add Item" to add manually.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleValidate}>
          Validate & Continue
        </Button>
      </div>
    </div>
  );
};
