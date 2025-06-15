
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Eye, FileText, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ProcessedPODetails } from '@/components/ProcessedPODetails';

const ProcessedPOs = () => {
  const { user } = useAuth();
  const [selectedPO, setSelectedPO] = useState<string | null>(null);

  const { data: processedPOs, isLoading } = useQuery({
    queryKey: ['processed-pos', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          quotes (*),
          po_line_items (*)
        `)
        .eq('user_id', user?.id)
        .neq('status', 'Draft')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'Under Review': 'outline',
      'Amendment Needed': 'secondary',
      'Accepted': 'default',
      'Rejected': 'destructive',
    };
    
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getMatchStatusIcon = (matchStatus: string) => {
    switch (matchStatus) {
      case 'Matched':
        return <div className="flex items-center text-green-600"><Minus className="h-4 w-4" /></div>;
      case 'Price Deviation':
        return <div className="flex items-center text-yellow-600"><TrendingUp className="h-4 w-4" /></div>;
      case 'Mismatch':
        return <div className="flex items-center text-red-600"><TrendingDown className="h-4 w-4" /></div>;
      default:
        return <div className="flex items-center text-gray-500"><Minus className="h-4 w-4" /></div>;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Please sign in to view processed POs</p>
        </div>
      </div>
    );
  }

  if (selectedPO) {
    return <ProcessedPODetails poId={selectedPO} onBack={() => setSelectedPO(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Processed Purchase Orders</h1>
          <p className="text-gray-600">Review past PO analysis results and comparison outcomes</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : processedPOs && processedPOs.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Purchase Orders History
              </CardTitle>
              <CardDescription>
                Click on any PO to view detailed analysis and comparison results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Quote Reference</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Received Date</TableHead>
                    <TableHead>Line Items</TableHead>
                    <TableHead>Overall Match</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedPOs.map((po) => {
                    const matchedItems = po.po_line_items?.filter(item => item.match_status === 'Matched').length || 0;
                    const totalItems = po.po_line_items?.length || 0;
                    const overallMatch = totalItems > 0 ? ((matchedItems / totalItems) * 100).toFixed(0) : '0';
                    
                    return (
                      <TableRow key={po.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{po.po_number}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{po.customer_name}</div>
                            {po.customer_code && (
                              <div className="text-sm text-gray-500">{po.customer_code}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {po.quote_number ? (
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4 text-gray-400" />
                              {po.quote_number}
                            </div>
                          ) : (
                            <span className="text-gray-400">No quote linked</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(po.status || 'Draft')}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {new Date(po.po_received_date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{totalItems} items</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getMatchStatusIcon(overallMatch === '100' ? 'Matched' : overallMatch === '0' ? 'Mismatch' : 'Price Deviation')}
                            <span className="text-sm">{overallMatch}% matched</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPO(po.id)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Processed POs Found</h3>
              <p className="text-gray-500">
                Upload and analyze your first PO to see the results here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProcessedPOs;
