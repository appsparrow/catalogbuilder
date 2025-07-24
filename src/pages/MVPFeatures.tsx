import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Share2, 
  Heart, 
  Users, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Package,
  MessageSquare,
  TrendingUp,
  Clock,
  Globe,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

const MVPFeatures = () => {
  const painPoints = [
    {
      icon: <FileText className="h-6 w-6 text-red-500" />,
      title: "Multiple Supplier Catalogs",
      description: "Managing catalogs from different suppliers in various formats"
    },
    {
      icon: <Package className="h-6 w-6 text-orange-500" />,
      title: "Manual Customization",
      description: "Creating custom catalogs in PowerPoint, Excel, or Word documents"
    },
    {
      icon: <Share2 className="h-6 w-6 text-blue-500" />,
      title: "Sharing Difficulties",
      description: "Trouble sharing catalogs with customers due to file size and version control"
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-purple-500" />,
      title: "Customer Feedback Gap",
      description: "No easy way to get customer preferences and start sales conversations"
    }
  ];

  const solutions = [
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Unified Product Library",
      description: "Upload and organize all your supplier products in one place",
      benefits: ["Single source of truth", "Easy product management", "Consistent formatting"]
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Custom Catalog Creation",
      description: "Create personalized catalogs for each customer in minutes",
      benefits: ["Drag-and-drop selection", "Professional layouts", "Brand customization"]
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "Instant Sharing",
      description: "Share catalogs via simple links - no file attachments needed",
      benefits: ["One-click sharing", "Mobile-friendly viewing", "Real-time updates"]
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Customer Feedback System",
      description: "Get instant feedback on customer preferences and likes",
      benefits: ["Preference tracking", "Sales conversation starters", "Data-driven insights"]
    }
  ];

  const features = [
    {
      category: "Product Management",
      items: [
        "Bulk image upload with drag-and-drop interface",
        "Product categorization and tagging",
        "Supplier information tracking",
        "Product code and SKU management",
        "Brand logo overlay on catalogs"
      ]
    },
    {
      category: "Catalog Creation",
      items: [
        "Drag-and-drop product selection",
        "Custom catalog naming and branding",
        "Professional catalog layouts",
        "Export to PDF or shareable links",
        "Mobile-responsive design"
      ]
    },
    {
      category: "Customer Experience",
      items: [
        "Mobile-responsive catalog viewing",
        "Product liking and preference tracking",
        "Customer feedback collection",
        "Seamless sharing experience",
        "Real-time catalog updates"
      ]
    },
    {
      category: "AI Features (Coming Soon)",
      items: [
        "Auto-extract product details from images",
        "AI-powered image cleanup and enhancement",
        "Automatic product categorization",
        "Smart product recommendations",
        "Background removal and optimization"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <img 
                src="/lovable-uploads/ad9485b6-d796-4b14-a5b2-0701ba070683.png" 
                alt="CUZATA Logo" 
                className="h-6 w-6 sm:h-8 sm:w-8"
              />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CUZATA
              </h1>
            </Link>
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowRight className="h-4 w-4 mr-2" />
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20">
          <Badge variant="secondary" className="mb-4 text-sm">
            MVP Features
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
            Transform Your Catalog Management
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Streamline your interior design and supply chain catalog processes with our simple, 
            powerful solution designed for modern businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Demo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Watch Demo Video
            </Button>
          </div>
        </div>

        {/* Problem Statement */}
        <section className="mb-16 sm:mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Are You Struggling With These Challenges?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Interior designers and supply chain professionals face common pain points 
              that slow down their workflow and impact customer satisfaction.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {painPoints.map((point, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {point.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{point.title}</h3>
                  <p className="text-sm text-gray-600">{point.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Solution Overview */}
        <section className="mb-16 sm:mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Introducing the Simplest Workflow
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our solution addresses every pain point with an intuitive, 
              streamlined approach that saves time and improves results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {solution.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {solution.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{solution.description}</p>
                      <ul className="space-y-2">
                        {solution.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features List */}
        <section className="mb-16 sm:mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Complete Feature Set
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage catalogs efficiently and delight your customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {category.category.includes("AI") ? (
                      <Sparkles className="h-5 w-5 text-purple-500" />
                    ) : (
                      <TrendingUp className="h-5 w-5 text-primary" />
                    )}
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Ready to Transform Your Catalog Process?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Join leading interior designers and supply chain professionals 
                who have already streamlined their catalog management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Start Your Free Demo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-red-600 hover:bg-white hover:text-blue-600">
                  Schedule a Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm mb-2">
              <a 
                href="https://lovable.dev/invite/7ea3252a-98b9-4671-ba20-2292bced6e46" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-white transition-colors"
              >
                <img 
                  src="/lovable-uploads/ad9485b6-d796-4b14-a5b2-0701ba070683.png" 
                  alt="Lovable" 
                  className="h-4 w-4 rounded"
                />
                Lovable app
              </a>{" "}
              built by human at{" "}
              <span className="text-white font-medium">Cuzata</span> for{" "}
              <a 
                href="https://illus.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white font-medium hover:underline"
              >
                Illus Decor
              </a>
            </p>
            <p className="text-xs opacity-75">
              © 2024 Cuzata. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MVPFeatures; 