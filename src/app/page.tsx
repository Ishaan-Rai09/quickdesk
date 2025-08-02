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
  Cpu,
  Brain,
  Heart,
  Activity,
  Stethoscope
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-6"
              >
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 font-semibold text-sm mb-8 shadow-lg">
                  ✨ Next-Generation Support Platform
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-6xl lg:text-8xl font-black mb-8 leading-tight"
              >
                <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">Premium</span>
                <br />
                <span className="bg-gradient-to-r from-slate-800 via-slate-900 to-black bg-clip-text text-transparent">AI Desk</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-xl text-slate-700 mb-10 max-w-xl leading-relaxed font-medium"
              >
                Transform your customer support with our <strong className="text-slate-900">luxury AI-powered platform</strong>. Experience unparalleled ticket analysis, intelligent routing, and premium user experience designed for elite teams.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-6 mb-12"
              >
                <Link href="/dashboard">
                  <Button className="group relative bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-600 hover:via-orange-600 hover:to-yellow-600 text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-0">
                    <span className="relative z-10 flex items-center gap-2">
                      <span>User Portal</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Button>
                </Link>
                <Link href="/agent/login">
                  <Button className="group relative bg-white hover:bg-gray-50 text-slate-800 border-2 border-slate-300 hover:border-slate-400 px-10 py-5 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <span className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      <span>Agent Portal</span>
                    </span>
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right Content - Feature Cards */}
            <div className="grid grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-navy-800 mb-2">Smart Analysis</h3>
                <p className="text-sm text-gray-600">AI-powered ticket routing and priority detection</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-navy-800 mb-2">Customer Care</h3>
                <p className="text-sm text-gray-600">Personalized support experiences</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-navy-800 mb-2">Live Monitoring</h3>
                <p className="text-sm text-gray-600">Real-time ticket status tracking</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                  <Stethoscope className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-navy-800 mb-2">Health Check</h3>
                <p className="text-sm text-gray-600">System performance diagnostics</p>
              </motion.div>
            </div>
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

      {/* Stats Section */}
      <section className="py-20 bg-navy-800 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-4xl lg:text-5xl font-bold text-yellow-500 mb-2">99.7%</h3>
              <p className="text-white/80">Accuracy Rate</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-4xl lg:text-5xl font-bold text-yellow-500 mb-2">10K+</h3>
              <p className="text-white/80">Tickets Analyzed</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-4xl lg:text-5xl font-bold text-yellow-500 mb-2">500+</h3>
              <p className="text-white/80">Support Teams</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-4xl lg:text-5xl font-bold text-yellow-500 mb-2">24/7</h3>
              <p className="text-white/80">AI Availability</p>
            </motion.div>
          </div>
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
