
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, Download, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { AuthForm } from '@/components/auth/AuthForm';
import { Header } from '@/components/Header';
import { useDocumentAnalysis } from '@/hooks/useDocumentAnalysis';

const Index = () => {
  const [poFile, setPOFile] = useState<File | null>(null);
  const [quoteFile, setQuoteFile] = useState<File | null>(null);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const {
    analysisStatus,
    progress,
    analysisResult,
    analyzePOAndQuote,
    savePOToDatabase
  } = useDocumentAnalysis();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const handleFileUpload = (file: File, type: 'po' | 'quote') => {
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF files only.",
        variant: "destructive",
      });
      return;
    }

    if (type === 'po') {
      setPOFile(file);
    } else {
      setQuoteFile(file);
    }

    toast({
      title: "File uploaded",
      description: `${type === 'po' ? 'Purchase Order' : 'Quote'} uploaded successfully.`,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, type: 'po' | 'quote') => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0], type);
    }
  };

  const startAnalysis = async () => {
    if (!poFile || !quoteFile) {
      toast({
        title: "Missing files",
        description: "Please upload both Purchase Order and Quote files.",
        variant: "destructive",
      });
      return;
    }

    await analyzePOAndQuote(poFile, quoteFile);
  };

  const exportJSON = () => {
    if (!analysisResult) return;
    
    const dataStr = JSON.stringify(analysisResult, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `po_quote_analysis_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'matched':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'mismatched':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getRiskBadge = (risk: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[risk as keyof typeof colors]}>{risk.toUpperCase()}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <p className="text-gray-600">Upload your Purchase Order and Quote to validate terms, pricing, and identify discrepancies.</p>
        </div>

        {/* File Upload Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Purchase Order
              </CardTitle>
              <CardDescription>Upload the customer's PO document</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  poFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'po')}
              >
                {poFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <p className="font-medium text-green-800">{poFile.name}</p>
                    <p className="text-sm text-green-600">Ready for analysis</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-gray-600">Drag & drop PO file here</p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'po')}
                      className="hidden"
                      id="po-upload"
                    />
                    <label htmlFor="po-upload">
                      <Button variant="outline" className="cursor-pointer">Choose File</Button>
                    </label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Sales Quote
              </CardTitle>
              <CardDescription>Upload your original quote document</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  quoteFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'quote')}
              >
                {quoteFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <p className="font-medium text-green-800">{quoteFile.name}</p>
                    <p className="text-sm text-green-600">Ready for analysis</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-gray-600">Drag & drop Quote file here</p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'quote')}
                      className="hidden"
                      id="quote-upload"
                    />
                    <label htmlFor="quote-upload">
                      <Button variant="outline" className="cursor-pointer">Choose File</Button>
                    </label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={startAnalysis}
            disabled={!poFile || !quoteFile || analysisStatus === 'analyzing'}
            size="lg"
            className="px-8"
          >
            {analysisStatus === 'analyzing' ? 'Analyzing Documents...' : 'Start Analysis'}
          </Button>
        </div>

        {/* Progress Section */}
        {analysisStatus === 'analyzing' && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Analysis Progress</span>
                  <span className="text-sm text-gray-500">{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-600">
                  {progress < 30 ? 'Extracting data from documents...' :
                   progress < 60 ? 'Comparing line items...' :
                   progress < 90 ? 'Analyzing terms and conditions...' :
                   'Generating report...'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {analysisStatus === 'complete' && analysisResult && (
          <div className="space-y-6">
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Analysis Summary</CardTitle>
                  <div className="flex gap-2">
                    <Button onClick={savePOToDatabase} variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save to DB
                    </Button>
                    <Button onClick={exportJSON} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export JSON
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{analysisResult.summary.totalMatched}</div>
                    <div className="text-sm text-gray-600">Matched Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{analysisResult.summary.totalMismatched}</div>
                    <div className="text-sm text-gray-600">Mismatched Items</div>
                  </div>
                  <div className="text-center">
                    <Badge className={analysisResult.summary.recommendation === 'accept' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {analysisResult.summary.recommendation === 'accept' ? 'ACCEPTABLE' : 'AMENDMENT REQUIRED'}
                    </Badge>
                  </div>
                </div>

                {analysisResult.summary.amendmentText && (
                  <div>
                    <h4 className="font-semibold mb-3">Recommended Amendments:</h4>
                    <ul className="space-y-2">
                      {analysisResult.summary.amendmentText.map((text, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Line Items Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Line Items Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Part Code</th>
                        <th className="text-left p-3">Description</th>
                        <th className="text-left p-3">PO Price</th>
                        <th className="text-left p-3">Quote Price</th>
                        <th className="text-left p-3">Variance</th>
                        <th className="text-left p-3">Issues</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisResult.lineItemsComparison.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3">{getStatusIcon(item.status)}</td>
                          <td className="p-3 font-mono text-sm">{item.poItem.customer_part_number}</td>
                          <td className="p-3">{item.poItem.item_description}</td>
                          <td className="p-3">₹{item.poItem.unit_price?.toLocaleString()}</td>
                          <td className="p-3">₹{item.quoteItem?.quoted_unit_price?.toLocaleString() || 'N/A'}</td>
                          <td className="p-3">
                            {item.priceVariance && (
                              <span className={item.priceVariance > 0 ? 'text-red-600' : 'text-green-600'}>
                                {item.priceVariance > 0 ? '+' : ''}{item.priceVariance.toFixed(1)}%
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            {item.issues?.length > 0 && (
                              <div className="space-y-1">
                                {item.issues.map((issue: string, issueIndex: number) => (
                                  <Badge key={issueIndex} variant="outline" className="text-xs">
                                    {issue}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Terms & Conditions Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Terms & Conditions Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResult.termsComparison.map((term, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{term.category}</h4>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(term.status)}
                          {getRiskBadge(term.risk)}
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">PO Term:</span>
                          <p className="mt-1">{term.poTerm}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Quote Term:</span>
                          <p className="mt-1">{term.quoteTerm}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="lg">
                Send Amendment Request
              </Button>
              <Button size="lg">
                Accept PO As-Is
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
