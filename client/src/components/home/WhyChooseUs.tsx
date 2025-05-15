import { motion } from 'framer-motion';

export default function WhyChooseUs() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section className="bg-neutral-100 py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="font-heading font-bold text-3xl mb-4">Why Sell Your Tractor With Us</h2>
          <p className="text-neutral-600">
            The most trusted marketplace for agricultural machinery with tools designed to help you sell faster and more securely.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            className="bg-white rounded-xl p-8 shadow-md text-center hover:shadow-lg transition-custom"
            variants={fadeInUp}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
          >
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-users text-primary text-2xl"></i>
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">Reach More Buyers</h3>
            <p className="text-neutral-600">
              Connect with thousands of verified buyers specifically looking for tractors in your area.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl p-8 shadow-md text-center hover:shadow-lg transition-custom"
            variants={fadeInUp}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
          >
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-shield-alt text-primary text-2xl"></i>
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">Secure Payments</h3>
            <p className="text-neutral-600">
              Integrated Razorpay system allows you to securely collect advance payments from buyers.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl p-8 shadow-md text-center hover:shadow-lg transition-custom"
            variants={fadeInUp}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
          >
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-chart-line text-primary text-2xl"></i>
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">Sales Analytics</h3>
            <p className="text-neutral-600">
              Get detailed insights on listing performance and buyer interest to optimize your sales.
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/sell">
            <a className="inline-block bg-primary hover:bg-primary-dark text-white font-medium px-8 py-3 rounded-lg transition-custom">
              Start Selling Today
            </a>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

import { Link } from 'wouter';
