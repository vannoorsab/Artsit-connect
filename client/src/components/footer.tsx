import { Sparkles, Heart, Mail, User, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const { toast } = useToast();

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate sending the message
    toast({
      title: "Message sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });

    // Reset form and close modal
    setContactForm({ name: "", email: "", message: "" });
    setContactModalOpen(false);
  };
  return (
    <footer className="bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 text-slate-700 py-16 relative overflow-hidden">
      {/* Floating bubbles background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-12 h-12 bg-purple-200 rounded-full opacity-25 animate-bounce delay-1000"></div>
        <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-pink-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="bubble-card p-6 bg-white/60 backdrop-blur-md border border-white/40">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="font-serif font-bold text-xl text-slate-800">ArtisanConnect</span>
                <span className="ai-badge text-white text-xs px-2 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">AI</span>
              </div>
              <p className="text-slate-600 mb-4">
                Connecting passionate artisans with appreciative customers through AI-powered tools that help tell every craft's unique story.
              </p>
              <div className="flex items-center text-sm text-slate-500">
                <Heart className="h-4 w-4 mr-2 text-pink-500" />
                Made with love for artisans worldwide
              </div>
            </div>
          </div>

          <div className="bubble-card p-6 bg-white/60 backdrop-blur-md border border-white/40">
            <h3 className="font-semibold mb-4 text-slate-800">For Artisans</h3>
            <ul className="space-y-3 text-slate-600">
              <li><a href="/upload" className="hover:text-slate-800 transition-colors flex items-center group" data-testid="link-start-selling">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:bg-blue-500 transition-colors"></span>
                Start Selling
              </a></li>
              <li><a href="/marketplace" className="hover:text-slate-800 transition-colors flex items-center group" data-testid="link-marketplace">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:bg-purple-500 transition-colors"></span>
                Browse Marketplace
              </a></li>
              <li><a href="#" className="hover:text-slate-800 transition-colors flex items-center group" data-testid="link-ai-tools">
                <span className="w-2 h-2 bg-pink-400 rounded-full mr-3 group-hover:bg-pink-500 transition-colors"></span>
                AI Tools
              </a></li>
            </ul>
          </div>

          <div className="bubble-card p-6 bg-white/60 backdrop-blur-md border border-white/40">
            <h3 className="font-semibold mb-4 text-slate-800">Platform</h3>
            <ul className="space-y-3 text-slate-600">
              <li><a href="#" className="hover:text-slate-800 transition-colors flex items-center group" data-testid="link-about">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:bg-green-500 transition-colors"></span>
                About ArtisanConnect
              </a></li>
              <li><button
                onClick={() => setContactModalOpen(true)}
                className="hover:text-slate-800 transition-colors flex items-center group text-left"
                data-testid="button-contact"
              >
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:bg-yellow-500 transition-colors"></span>
                Contact Us
              </button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-300/30 mt-12 pt-8">
          <div className="bubble-card p-6 bg-white/60 backdrop-blur-md border border-white/40">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-500 text-sm mb-4 md:mb-0">
                Developed by 404 Google Team
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-slate-600">
                  <div className="ai-badge text-white px-3 py-1 rounded-full mr-3 bg-gradient-to-r from-blue-500 to-purple-500">AI</div>
                  Powered by Google Gemini
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Us Modal */}
      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Contact Us
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Your full name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Message</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  placeholder="How can we help you?"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="pl-10 min-h-[100px] resize-none"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setContactModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
