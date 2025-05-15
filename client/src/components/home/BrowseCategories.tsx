import { Link } from 'wouter';
import { motion } from 'framer-motion';

export default function BrowseCategories() {
  const categories = [
    {
      name: "Compact",
      image: "https://pixabay.com/get/g212cf094fc0bc71bdf7a5f516f8032bf542c3f1fdb8e9accfe53d229eeff30e412079732f5c2a711e7ce22dd94202e481f4a5c97b6b8b384396fb014e4d3cd43_1280.jpg",
      href: "/tractors?category=compact"
    },
    {
      name: "Utility",
      image: "https://pixabay.com/get/g0cb9ffdd660e2da3f385b2bcc61151061019fd8b0dd6235539cd27176f4d2f891ba1213e95cd92a43edf23423c45140629fb03775c5e0b0783aaf801de724514_1280.jpg",
      href: "/tractors?category=utility"
    },
    {
      name: "Row Crop",
      image: "https://pixabay.com/get/g63816842e0dd75b89ec9330350592cd083a111c6ef1a1a43a5720245d5dacf51ac20e65e37929799e5dbe9c021039d30deac8b6efd249f9b007a6afddea674ed_1280.jpg",
      href: "/tractors?category=row-crop"
    },
    {
      name: "4WD/Track",
      image: "https://pixabay.com/get/gfa9b1d8df7d470044b36862f44bd58201a0334a09f1305783bb6ab49bb5d7ab7706589db95a152ab1a8b862a51afd190cd27991c4a8b1d4d59ef6bf724f1dfd9_1280.jpg",
      href: "/tractors?category=4wd-track"
    },
    {
      name: "Specialty",
      image: "https://pixabay.com/get/g606980e7eca1f740400d4c2734c330e5b4d19a0d7b508253a31642a232f3b570c3ec79afddd49cfbda51691637e58dbfbb1b12fe662a9197a26bfda0ac612e64_1280.jpg",
      href: "/tractors?category=specialty"
    },
    {
      name: "Attachments",
      image: "https://pixabay.com/get/ga924a3164f734d596cea39189efedb404cd2065de28a11458df35abb7b610cbd6f4717f2c28700f52e76808bf1ddaa9abc528411aaf26274bee76a3a7946890f_1280.jpg",
      href: "/tractors?category=attachments"
    }
  ];

  return (
    <section className="bg-neutral-100 py-16">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-heading font-bold text-3xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Browse By Category
        </motion.h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={category.href}>
                <a className="group block">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-custom h-40">
                    <div className="h-28 overflow-hidden">
                      <img 
                        src={category.image} 
                        alt={`${category.name} Tractors`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="font-heading font-medium">{category.name}</h3>
                    </div>
                  </div>
                </a>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
