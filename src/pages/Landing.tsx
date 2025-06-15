
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Upload, 
  Eye,
  Shield,
  Clock,
  BarChart3,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const features = [
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Easy Document Upload",
      description: "Simply drag and drop your Purchase Orders and Sales Quotes for instant analysis"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Automated Comparison",
      description: "AI-powered line-by-line comparison between POs and quotes to identify discrepancies"
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Risk Assessment",
      description: "Intelligent risk scoring for terms, pricing, and commercial conditions"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Detailed Analytics",
      description: "Comprehensive reports with pricing variance analysis and match statistics"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Processing",
      description: "Enterprise-grade security for your sensitive business documents"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Time Saving",
      description: "Reduce manual review time from hours to minutes with automated analysis"
    }
  ];

  const benefits = [
    "Eliminate manual document comparison errors",
    "Accelerate PO processing and approval workflows",
    "Identify pricing discrepancies before acceptance",
    "Ensure commercial terms alignment",
    "Generate detailed amendment recommendations",
    "Maintain comprehensive audit trails"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PO-Quote Validator</h1>
            <p className="text-sm text-gray-600">Document Analysis Tool</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/app">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/app">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800">AI-Powered Analysis</Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Validate Purchase Orders Against Sales Quotes
            <span className="text-blue-600"> Instantly</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload your Purchase Orders and Sales Quotes to automatically compare terms, 
            pricing, and conditions. Identify discrepancies and generate amendment recommendations 
            in minutes, not hours.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/app">
              <Button size="lg" className="px-8">
                Start Free Analysis
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features for Document Analysis
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to streamline your PO validation process and ensure accuracy
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Analysis Results */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              See What You'll Get
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Detailed analysis results with actionable insights
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Analysis Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <div className="text-sm text-gray-600">Matched Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">2</div>
                    <div className="text-sm text-gray-600">Mismatched Items</div>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-yellow-100 text-yellow-800">
                      REVIEW NEEDED
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <span className="text-sm">Price variance of +15% on Item ABC-123</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <span className="text-sm">Delivery terms mismatch: FOB vs CIF</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Line Items Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Line Items Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">PART-001</span>
                    </div>
                    <div className="text-sm text-green-600">Perfect Match</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">PART-002</span>
                    </div>
                    <div className="text-sm text-yellow-600">+15% Price Variance</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">PART-003</span>
                    </div>
                    <div className="text-sm text-red-600">Quantity Mismatch</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6 bg-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose PO-Quote Validator?
            </h2>
            <p className="text-lg text-gray-600">
              Streamline your procurement process and eliminate manual errors
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your PO Process?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join companies that have reduced their document review time by 90%
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/app">
              <Button size="lg" className="px-8">
                <Upload className="h-4 w-4 mr-2" />
                Start Analyzing Documents
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              <Users className="h-4 w-4 mr-2" />
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">PO-Quote Validator</h3>
              <p className="text-gray-400">
                AI-powered document analysis for streamlined procurement
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>API</li>
                <li>Integrations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>Status</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PO-Quote Validator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
