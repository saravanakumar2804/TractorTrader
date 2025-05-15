import { motion } from 'framer-motion';

export default function HowItWorks() {
  const steps = [
    {
      icon: "fas fa-camera",
      title: "List Your Tractor",
      description: "Upload photos, videos, and detailed specifications of your tractor."
    },
    {
      icon: "fas fa-search",
      title: "Connect With Buyers",
      description: "Interested buyers will contact you through our secure messaging system."
    },
    {
      icon: "fas fa-credit-card",
      title: "Secure Payment",
      description: "Collect advance payments securely through Razorpay integration."
    },
    {
      icon: "fas fa-handshake",
      title: "Complete Sale",
      description: "Finalize the deal and arrange for tractor delivery or pickup."
    }
  ];

  return (
    <section className="py-16" id="how-it-works">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading font-bold text-3xl mb-4">How It Works</h2>
          <p className="text-neutral-600">
            Our platform makes buying and selling tractors simple and secure with just a few easy steps.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                  <i className={`${step.icon} text-primary text-2xl`}></i>
                </div>
                
                {/* Connecting line between steps */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 w-full h-2 bg-primary/10 -z-0"></div>
                )}
                
                {/* Number indicator */}
                <div className="absolute top-4 right-0 left-0 text-center">
                  <motion.span 
                    className="bg-primary text-white text-lg font-bold w-12 h-12 rounded-full inline-flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {index + 1}
                  </motion.span>
                </div>
              </div>
              
              <h3 className="font-heading font-bold text-xl mb-3">{step.title}</h3>
              <p className="text-neutral-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
