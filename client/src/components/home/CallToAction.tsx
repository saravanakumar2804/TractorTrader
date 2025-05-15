import { Link } from 'wouter';
import { motion } from 'framer-motion';

export default function CallToAction() {
  return (
    <section className="py-16 bg-primary clip-path-slant">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
            Ready to Buy or Sell Your Tractor?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Join thousands of farmers and dealers who trust TractorTrade for their agricultural machinery needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/tractors">
                <a className="block bg-white text-primary hover:bg-neutral-100 font-bold px-8 py-4 rounded-lg transition-custom">
                  Browse Tractors
                </a>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/sell">
                <a className="block bg-accent hover:bg-accent-dark text-white font-bold px-8 py-4 rounded-lg transition-custom">
                  Sell Your Tractor
                </a>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
