import { motion } from 'framer-motion';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "I sold my John Deere within 3 days of listing it. The secure payment system gave me peace of mind, and the whole process was incredibly smooth.",
      author: "Michael Johnson",
      role: "Farmer, Iowa",
      avatar: "https://pixabay.com/get/g605d8c5a2b25d518a80e30b5df6b0879f633f93ad2e3e359c43b52e5a2cf9fd2ade37fa2b61df3b76a0a0d642ac8b1f89a92cfe5e9b45e962ac3e1c8fc94a1c7_1280.jpg"
    },
    {
      quote: "As a dealer, I've tried many platforms, but TractorTrade has the most engaged audience. The analytics dashboard helps me understand what buyers want.",
      author: "Sarah Williams",
      role: "Tractor Dealer, Nebraska",
      avatar: "https://pixabay.com/get/gbd659e3e8be60fb3c8b0cf5dbdbb8ed9a7c78f06ca45ad1b49c57ac7b1b76ec994cb14b2e4c17e48a3f6dbff5a5f3f5b8e46f5af04d621d6f19e0f5adc5dd30b_1280.jpg"
    },
    {
      quote: "I was looking for a specialty tractor for my vineyard. Found exactly what I needed on TractorTrade at a fair price, and the seller was verified.",
      author: "David Thompson",
      role: "Vineyard Owner, California",
      avatar: "https://pixabay.com/get/ga9a6bba5c33ba7b91e8aae2d59adeee7ca2be12efa08dc54599c1c6a6f81e3feb9f2b7e3b2a8cf03b1e17e731ac3d347_1280.jpg"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="bg-neutral-100 py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading font-bold text-3xl mb-4">What Our Users Say</h2>
          <p className="text-neutral-600">
            Hear from farmers and tractor dealers who have successfully used our platform.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-xl p-8 shadow-md relative"
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="absolute -top-5 left-8 text-5xl text-primary opacity-20">
                <i className="fas fa-quote-left"></i>
              </div>
              <div className="mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <i key={star} className="fas fa-star text-accent"></i>
                ))}
              </div>
              <p className="mb-6 text-neutral-600">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-heading font-bold">{testimonial.author}</h4>
                  <p className="text-sm text-neutral-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
