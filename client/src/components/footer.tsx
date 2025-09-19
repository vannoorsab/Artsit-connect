import { Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <i className="fas fa-hammer text-primary text-2xl"></i>
              <span className="font-serif font-bold text-xl">CraftHub</span>
              <span className="ai-badge text-white text-xs px-2 py-1 rounded-full">AI</span>
            </div>
            <p className="text-secondary-foreground/80 mb-6 max-w-md">
              Connecting passionate artisans with appreciative customers through AI-powered tools that help tell every craft's unique story.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-secondary-foreground/60 hover:text-secondary-foreground transition-colors" data-testid="link-instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-foreground/60 hover:text-secondary-foreground transition-colors" data-testid="link-facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-foreground/60 hover:text-secondary-foreground transition-colors" data-testid="link-twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">For Artisans</h3>
            <ul className="space-y-2 text-secondary-foreground/80">
              <li><a href="/upload" className="hover:text-secondary-foreground transition-colors" data-testid="link-start-selling">Start Selling</a></li>
              <li><a href="#" className="hover:text-secondary-foreground transition-colors" data-testid="link-ai-tools">AI Tools</a></li>
              <li><a href="#" className="hover:text-secondary-foreground transition-colors" data-testid="link-pricing-guide">Pricing Guide</a></li>
              <li><a href="#" className="hover:text-secondary-foreground transition-colors" data-testid="link-success-stories">Success Stories</a></li>
              <li><a href="#" className="hover:text-secondary-foreground transition-colors" data-testid="link-resources">Resources</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-secondary-foreground/80">
              <li><a href="#" className="hover:text-secondary-foreground transition-colors" data-testid="link-help-center">Help Center</a></li>
              <li><a href="#" className="hover:text-secondary-foreground transition-colors" data-testid="link-contact">Contact Us</a></li>
              <li><a href="#" className="hover:text-secondary-foreground transition-colors" data-testid="link-privacy">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-secondary-foreground transition-colors" data-testid="link-terms">Terms of Service</a></li>
              <li><a href="#" className="hover:text-secondary-foreground transition-colors" data-testid="link-trust">Trust & Safety</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-secondary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-secondary-foreground/60 text-sm">
            © 2024 CraftHub. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center text-sm text-secondary-foreground/80">
              <div className="ai-badge text-white px-2 py-1 rounded mr-2">AI</div>
              Powered by OpenAI technology
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
