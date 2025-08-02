'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import { 
  Ticket, 
  Users, 
  Zap, 
  Shield, 
  Clock,
  ArrowRight,
  Star,
  CheckCircle,
  Sparkles,
  Award,
  Globe,
  TrendingUp,
  Layers,
  Cpu
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-purple-50/10 to-blue-50/20 pointer-events-none" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-indigo-200/50 rounded-full px-6 py-3 mb-8 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Premium Support Platform
              </span>
              <Award className="w-4 h-4 text-purple-600" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-6xl lg:text-8xl font-bold mb-8 leading-tight"
            >
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent block">
                Luxury
              </span>
              <span className="text-gray-900 block">Help Desk</span>
              <span className="bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent text-5xl lg:text-6xl">
                Experience
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
            >
              Elevate your customer support with our <span className="font-semibold text-indigo-600">premium platform</span>. 
              Designed for excellence, built for scale, crafted for teams who demand perfection.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <Link href="/sign-up">
                <Button size="xl" variant="premium" className="group px-12 py-4 text-lg font-semibold shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300">
                  <Sparkles className="mr-3 w-5 h-5" />
                  Start Free Trial
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
              <Button size="xl" variant="glass" className="px-8 py-4 text-lg font-medium bg-white/70 backdrop-blur-sm border-2 border-gray-200/50 hover:bg-white/90 transition-all duration-300">
                <Globe className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span>10,000+ Happy Teams</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>4.9/5 Rating</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Why Choose QuickDesk?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for modern teams who demand excellence in every interaction
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Resolve tickets 3x faster with our intelligent routing and automation"
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-level security with end-to-end encryption and compliance"
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Seamless collaboration between agents with internal notes and assignments"
              },
              {
                icon: Clock,
                title: "24/7 Availability",
                description: "Round-the-clock support with automated responses and escalations"
              },
              {
                icon: Star,
                title: "Premium Experience",
                description: "Luxury interface designed for productivity and user satisfaction"
              },
              {
                icon: CheckCircle,
                title: "Smart Analytics",
                description: "Deep insights and reporting to optimize your support operations"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 border-0 shadow-2xl">
            <CardContent className="p-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                  Ready to Transform Your Support?
                </h2>
                <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                  Join thousands of teams already using QuickDesk to deliver exceptional customer experiences.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/sign-up">
                    <Button size="xl" variant="glass" className="text-white border-white/30">
                      Start Free Trial
                    </Button>
                  </Link>
                  <Button size="xl" variant="outline" className="bg-white text-indigo-600 border-white hover:bg-indigo-50">
                    Contact Sales
                  </Button>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                QuickDesk
              </span>
            </div>
            <p className="text-gray-600">
              © 2025 QuickDesk. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
