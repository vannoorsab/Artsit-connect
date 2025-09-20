import { Link } from "wouter";
import { Compass, Plus, Bot, Handshake, Shield } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Floating bubbles background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-200 rounded-full opacity-25 animate-bounce delay-1000"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="bubble-card p-12 mb-8 max-w-4xl mx-auto">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
              Where <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Craft</span> Meets <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Technology</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              A revolutionary marketplace connecting talented artisans with customers who appreciate authentic handmade crafts. Our AI-powered platform helps creators showcase their work, optimize pricing, and tell compelling stories that resonate with buyers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketplace">
              <button className="bubble-button text-white text-lg font-medium flex items-center px-8 py-3" data-testid="button-explore">
                <Compass className="mr-2 h-5 w-5" />
                Explore Marketplace
              </button>
            </Link>
            <Link href="/upload">
              <button className="bubble-card border-2 border-purple-200 text-purple-700 text-lg font-medium flex items-center px-8 py-3 hover:bg-purple-50" data-testid="button-start-selling">
                <Plus className="mr-2 h-5 w-5" />
                Start Selling
              </button>
            </Link>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="glass-effect px-4 py-2 flex items-center text-sm">
              <Bot className="text-blue-600 mr-2 h-4 w-4" />
              <span className="text-gray-700">AI-Powered Assistance</span>
            </div>
            <div className="glass-effect px-4 py-2 flex items-center text-sm">
              <Handshake className="text-purple-600 mr-2 h-4 w-4" />
              <span className="text-gray-700">Direct Artist Connection</span>
            </div>
            <div className="glass-effect px-4 py-2 flex items-center text-sm">
              <Shield className="text-pink-600 mr-2 h-4 w-4" />
              <span className="text-gray-700">Trusted Marketplace</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
