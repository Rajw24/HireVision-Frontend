import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, BrainCog, Code, Users, Target } from 'lucide-react';

const teamMembers = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-founder",
    image: "https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=800",
    bio: "Former AI Research Lead at Google with 10+ years of experience in machine learning and recruitment technology.",
    links: { linkedin: "#", github: "#", email: "sarah@hirevision.ai" }
  },
  {
    name: "Michael Rodriguez",
    role: "CTO",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800",
    bio: "Ex-Microsoft Principal Engineer specializing in AI/ML and scalable cloud architecture.",
    links: { linkedin: "#", github: "#", email: "michael@hirevision.ai" }
  },
  {
    name: "Emily Watson",
    role: "Head of Product",
    image: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=800",
    bio: "Product veteran with experience at LinkedIn and Indeed, focused on HR tech innovation.",
    links: { linkedin: "#", github: "#", email: "emily@hirevision.ai" }
  },
  {
    name: "David Kim",
    role: "Lead AI Engineer",
    image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=800",
    bio: "PhD in Computer Science, specialized in NLP and conversation AI systems.",
    links: { linkedin: "#", github: "#", email: "david@hirevision.ai" }
  }
];

const AboutPage = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative gradient-bg py-24"
      >
        <div className="container-custom">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Revolutionizing Hiring Through
              <span className="text-primary-200"> AI Innovation</span>
            </h1>
            <p className="text-xl text-white/90">
              We're on a mission to transform the interview process, making it more efficient, 
              fair, and accessible for everyone.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            <div className="text-center">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 360 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center"
              >
                <BrainCog className="w-8 h-8 text-primary-600" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-4">Innovation First</h3>
              <p className="text-gray-600">Pushing the boundaries of AI technology to create better hiring solutions.</p>
            </div>
            <div className="text-center">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 360 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center"
              >
                <Users className="w-8 h-8 text-primary-600" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-4">People Focused</h3>
              <p className="text-gray-600">Creating technology that enhances human potential and connections.</p>
            </div>
            <div className="text-center">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 360 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center"
              >
                <Target className="w-8 h-8 text-primary-600" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-4">Impact Driven</h3>
              <p className="text-gray-600">Measuring success through the positive change we create in people's careers.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate experts committed to revolutionizing the hiring process through AI innovation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-w-1 aspect-h-1">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-primary-600 mb-4">{member.role}</p>
                  <p className="text-gray-600 mb-6">{member.bio}</p>
                  <div className="flex justify-center space-x-4">
                    <a href={member.links.linkedin} className="text-gray-600 hover:text-primary-600">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href={member.links.github} className="text-gray-600 hover:text-primary-600">
                      <Github className="w-5 h-5" />
                    </a>
                    <a href={`mailto:${member.links.email}`} className="text-gray-600 hover:text-primary-600">
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;