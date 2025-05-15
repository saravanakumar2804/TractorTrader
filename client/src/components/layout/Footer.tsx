import { Link } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Footer() {
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }
    
    // In a real app, this would send the email to the server
    toast({
      title: 'Success!',
      description: 'Thank you for subscribing to our newsletter',
    });
    form.reset();
  };

  return (
    <footer className="bg-neutral-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <i className="fas fa-tractor text-2xl text-white"></i>
              <span className="font-heading font-bold text-xl">TractorTrade</span>
            </div>
            <p className="text-neutral-300 mb-6">
              The premier marketplace for buying and selling tractors and agricultural machinery.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-white hover:text-accent transition-custom" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" className="text-white hover:text-accent transition-custom" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" className="text-white hover:text-accent transition-custom" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://youtube.com" className="text-white hover:text-accent transition-custom" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/">
                  <a className="text-neutral-300 hover:text-white transition-custom">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/tractors">
                  <a className="text-neutral-300 hover:text-white transition-custom">Browse Tractors</a>
                </Link>
              </li>
              <li>
                <Link href="/sell">
                  <a className="text-neutral-300 hover:text-white transition-custom">Sell Your Tractor</a>
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="text-neutral-300 hover:text-white transition-custom">How It Works</a>
              </li>
              <li>
                <a href="#about-us" className="text-neutral-300 hover:text-white transition-custom">About Us</a>
              </li>
              <li>
                <a href="#contact" className="text-neutral-300 hover:text-white transition-custom">Contact</a>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/tractors?category=compact">
                  <a className="text-neutral-300 hover:text-white transition-custom">Compact Tractors</a>
                </Link>
              </li>
              <li>
                <Link href="/tractors?category=utility">
                  <a className="text-neutral-300 hover:text-white transition-custom">Utility Tractors</a>
                </Link>
              </li>
              <li>
                <Link href="/tractors?category=row-crop">
                  <a className="text-neutral-300 hover:text-white transition-custom">Row Crop Tractors</a>
                </Link>
              </li>
              <li>
                <Link href="/tractors?category=4wd-track">
                  <a className="text-neutral-300 hover:text-white transition-custom">4WD & Track Tractors</a>
                </Link>
              </li>
              <li>
                <Link href="/tractors?category=specialty">
                  <a className="text-neutral-300 hover:text-white transition-custom">Specialty Tractors</a>
                </Link>
              </li>
              <li>
                <Link href="/tractors?category=attachments">
                  <a className="text-neutral-300 hover:text-white transition-custom">Attachments & Implements</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <i className="fas fa-map-marker-alt mt-1 text-accent"></i>
                <span className="text-neutral-300">123 Farming Way, Agricultural District, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fas fa-phone-alt text-accent"></i>
                <span className="text-neutral-300">(123) 456-7890</span>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fas fa-envelope text-accent"></i>
                <span className="text-neutral-300">info@tractortrade.com</span>
              </li>
            </ul>
            
            <div className="mt-8">
              <h4 className="font-heading font-bold mb-4">Subscribe to our newsletter</h4>
              <form onSubmit={handleSubscribe} className="flex">
                <Input 
                  type="email" 
                  name="email"
                  placeholder="Your email" 
                  className="px-4 py-2 bg-neutral-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-accent w-full" 
                />
                <Button 
                  type="submit"
                  className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-r-lg transition-custom"
                >
                  <i className="fas fa-paper-plane"></i>
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-neutral-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm mb-4 md:mb-0">
              &copy; 2023 TractorTrade. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#privacy" className="text-neutral-400 hover:text-white text-sm transition-custom">
                Privacy Policy
              </a>
              <a href="#terms" className="text-neutral-400 hover:text-white text-sm transition-custom">
                Terms of Service
              </a>
              <a href="#cookies" className="text-neutral-400 hover:text-white text-sm transition-custom">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
