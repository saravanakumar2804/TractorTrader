import { motion } from 'framer-motion';

export default function AppPromotion() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-primary rounded-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <motion.div 
              className="lg:w-1/2 p-8 md:p-12 flex items-center"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
                  Download Our Mobile App
                </h2>
                <p className="text-white/80 mb-6 md:text-lg">
                  Take TractorTrade with you anywhere. Browse, buy, and sell tractors right from your smartphone.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.a 
                    href="#" 
                    className="bg-black/20 hover:bg-black/30 text-white rounded-xl px-6 py-3 flex items-center justify-center transition-custom"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="fab fa-apple text-2xl mr-3"></i>
                    <div>
                      <div className="text-xs">Download on the</div>
                      <div className="font-bold">App Store</div>
                    </div>
                  </motion.a>
                  
                  <motion.a 
                    href="#" 
                    className="bg-black/20 hover:bg-black/30 text-white rounded-xl px-6 py-3 flex items-center justify-center transition-custom"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="fab fa-google-play text-2xl mr-3"></i>
                    <div>
                      <div className="text-xs">Get it on</div>
                      <div className="font-bold">Google Play</div>
                    </div>
                  </motion.a>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2 relative min-h-[300px]"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img 
                src="https://pixabay.com/get/g63816842e0dd75b89ec9330350592cd083a111c6ef1a1a43a5720245d5dacf51ac20e65e37929799e5dbe9c021039d30deac8b6efd249f9b007a6afddea674ed_1280.jpg" 
                alt="TractorTrade Mobile App" 
                className="absolute bottom-0 right-8 max-h-[400px] object-contain rounded-t-xl"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
