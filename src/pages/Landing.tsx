
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 font-system">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">PO-Quote Validator</h1>
            <p className="text-sm text-gray-600 font-medium">Document Analysis Tool</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/app">
              <Button variant="ghost" className="font-medium">Sign In</Button>
            </Link>
            <Link to="/app">
              <Button className="font-medium apple-shadow">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-50 text-blue-700 border-blue-200 font-medium">AI-Powered Analysis</Badge>
          <h1 className="text-6xl font-semibold text-gray-900 mb-8 tracking-tight leading-tight">
            Validate Purchase Orders Against Sales Quotes
            <span className="text-primary"> Instantly</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
            Upload your Purchase Orders and Sales Quotes to automatically compare terms, 
            pricing, and conditions. Identify discrepancies and generate amendment recommendations 
            in minutes, not hours.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/app">
              <Button size="lg" className="px-8 font-medium apple-shadow-lg">
                Start Free Analysis
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="font-medium">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
              Powerful Features for Document Analysis
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              Everything you need to streamline your PO validation process and ensure accuracy
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="apple-shadow hover:shadow-lg transition-all duration-300 border-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold tracking-tight">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Analysis Results */}
      <section className="py-20 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
              See What You'll Get
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              Detailed analysis results with actionable insights
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Analysis Summary Card */}
            <Card className="apple-shadow border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-semibold text-green-600 mb-2">8</div>
                    <div className="text-sm text-gray-600 font-medium">Matched Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-semibold text-red-600 mb-2">2</div>
                    <div className="text-sm text-gray-600 font-medium">Mismatched Items</div>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      REVIEW NEEDED
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <span className="text-sm font-medium text-gray-700">Price variance of +15% on Item ABC-123</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <span className="text-sm font-medium text-gray-700">Delivery terms mismatch: FOB vs CIF</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Line Items Preview */}
            <Card className="apple-shadow border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <FileText className="h-6 w-6 text-primary" />
                  Line Items Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-semibold">PART-001</span>
                    </div>
                    <div className="text-sm text-green-700 font-medium">Perfect Match</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-yellow-600" />
                      <span className="text-sm font-semibold">PART-002</span>
                    </div>
                    <div className="text-sm text-yellow-700 font-medium">+15% Price Variance</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="text-sm font-semibold">PART-003</span>
                    </div>
                    <div className="text-sm text-red-700 font-medium">Quantity Mismatch</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
              Why Choose PO-Quote Validator?
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              Streamline your procurement process and eliminate manual errors
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 font-medium leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
            Ready to Transform Your PO Process?
          </h2>
          <p className="text-xl text-gray-600 mb-10 font-medium">
            Join companies that have reduced their document review time by 90%
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/app">
              <Button size="lg" className="px-8 font-medium apple-shadow-lg">
                <Upload className="h-5 w-5 mr-2" />
                Start Analyzing Documents
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="font-medium">
              <Users className="h-5 w-5 mr-2" />
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 tracking-tight">PO-Quote Validator</h3>
              <p className="text-gray-400 leading-relaxed">
                AI-powered document analysis for streamlined procurement
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Features</li>
                <li className="hover:text-white transition-colors cursor-pointer">Pricing</li>
                <li className="hover:text-white transition-colors cursor-pointer">API</li>
                <li className="hover:text-white transition-colors cursor-pointer">Integrations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">About</li>
                <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
                <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Help Center</li>
                <li className="hover:text-white transition-colors cursor-pointer">Documentation</li>
                <li className="hover:text-white transition-colors cursor-pointer">Status</li>
                <li className="hover:text-white transition-colors cursor-pointer">Security</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PO-Quote Validator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
