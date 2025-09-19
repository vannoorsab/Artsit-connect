import { Link } from "wouter";
import { Compass, Plus, Bot, Handshake, Shield } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden craft-pattern">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
            Where <span className="text-primary">Craft</span> Meets <span className="text-secondary">Technology</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover unique handmade treasures from local artisans, powered by AI assistance to help creators tell their stories and price their masterpieces.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketplace">
              <button className="btn-primary text-lg font-medium flex items-center px-8 py-3" data-testid="button-explore">
                <Compass className="mr-2 h-5 w-5" />
                Explore Marketplace
              </button>
            </Link>
            <Link href="/upload">
              <button className="btn-secondary text-lg font-medium flex items-center px-8 py-3" data-testid="button-start-selling">
                <Plus className="mr-2 h-5 w-5" />
                Start Selling
              </button>
            </Link>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Bot className="text-primary mr-2 h-4 w-4" />
              AI-Powered Assistance
            </div>
            <div className="flex items-center">
              <Handshake className="text-accent-foreground mr-2 h-4 w-4" />
              Direct Artist Connection
            </div>
            <div className="flex items-center">
              <Shield className="text-secondary mr-2 h-4 w-4" />
              Trusted Marketplace
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
