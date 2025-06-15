
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Calendar, User, MapPin, CreditCard, Truck, Shield, AlertTriangle, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

interface ProcessedPODetailsProps {
  poId: string;
  onBack: () => void;
}

export const ProcessedPODetails = ({ poId, onBack }: ProcessedPODetailsProps) => {
  const { data: poDetails, isLoading } = useQuery({
    queryKey: ['po-details', poId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          quotes (*),
          po_line_items (*),
          customers (*)
        `)
        .eq('id', poId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!poId,
  });

  const getMatchStatusBadge = (status: string) => {
    const config = {
      'Matched': { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      'Mismatch': { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
      'Price Deviation': { variant: 'secondary' as const, icon: TrendingUp, color: 'text-yellow-600' },
      'Unquoted': { variant: 'outline' as const, icon: AlertTriangle, color: 'text-gray-600' },
    };
    
    const { variant, icon: Icon, color } = config[status as keyof typeof config] || config.Unquoted;
    
    return (
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <Badge variant={variant}>{status}</Badge>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!poDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">PO Not Found</h1>
            <Button onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Processed POs
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">PO Details: {poDetails.po_number}</h1>
              <p className="text-gray-600">Complete analysis and comparison results</p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {poDetails.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* PO Summary */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Purchase Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-medium">{poDetails.customer_name}</p>
                    {poDetails.customer_code && (
                      <p className="text-sm text-gray-500">Code: {poDetails.customer_code}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Received Date</p>
                    <p className="font-medium">{new Date(poDetails.po_received_date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {poDetails.quote_number && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Quote Reference</p>
                      <p className="font-medium">{poDetails.quote_number}</p>
                    </div>
                  </div>
                )}
                
                {poDetails.requested_delivery_date && (
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Delivery Date</p>
                      <p className="font-medium">{new Date(poDetails.requested_delivery_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>

              {(poDetails.payment_terms || poDetails.incoterms || poDetails.warranty_terms) && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Commercial Terms</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {poDetails.payment_terms && (
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Payment:</span>
                        <span>{poDetails.payment_terms}</span>
                      </div>
                    )}
                    {poDetails.incoterms && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Incoterms:</span>
                        <span>{poDetails.incoterms}</span>
                      </div>
                    )}
                    {poDetails.warranty_terms && (
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Warranty:</span>
                        <span>{poDetails.warranty_terms}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total Line Items</p>
                  <p className="text-2xl font-bold">{poDetails.po_line_items?.length || 0}</p>
                </div>
                
                <div className="space-y-2">
                  {['Matched', 'Mismatch', 'Price Deviation', 'Unquoted'].map(status => {
                    const count = poDetails.po_line_items?.filter(item => item.match_status === status).length || 0;
                    const percentage = poDetails.po_line_items?.length ? ((count / poDetails.po_line_items.length) * 100).toFixed(0) : '0';
                    
                    return (
                      <div key={status} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{status}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{count}</span>
                          <span className="text-xs text-gray-500">({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Line Items Details */}
        <Card>
          <CardHeader>
            <CardTitle>Line Items Analysis</CardTitle>
            <CardDescription>
              Detailed comparison between PO line items and corresponding quote items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Line #</TableHead>
                  <TableHead>Part Number</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Match Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {poDetails.po_line_items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.line_item_number}</TableCell>
                    <TableCell>
                      <div>
                        {item.customer_part_number && (
                          <div className="font-medium">{item.customer_part_number}</div>
                        )}
                        {item.internal_part_number && (
                          <div className="text-sm text-gray-500">Internal: {item.internal_part_number}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.item_description}</TableCell>
                    <TableCell>
                      {item.po_quantity} {item.unit}
                    </TableCell>
                    <TableCell>
                      ₹{item.unit_price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      ₹{item.total_price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      {getMatchStatusBadge(item.match_status || 'Unquoted')}
                    </TableCell>
                    <TableCell>
                      {item.deviation_notes && (
                        <div className="text-sm text-gray-600 max-w-xs truncate" title={item.deviation_notes}>
                          {item.deviation_notes}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {poDetails.special_remarks && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Special Remarks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{poDetails.special_remarks}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
