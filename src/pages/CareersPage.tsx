import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Clock, MapPin } from 'lucide-react';

const jobOpenings = [
  {
    title: "Senior AI Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "Join our core AI team to develop cutting-edge interview analysis algorithms and natural language processing systems.",
    requirements: [
      "5+ years of experience in AI/ML development",
      "Strong background in NLP and deep learning",
      "Experience with Python, PyTorch or TensorFlow",
      "PhD in Computer Science or related field preferred"
    ]
  },
  {
    title: "Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Build and maintain our web application, focusing on scalable and maintainable code.",
    requirements: [
      "3+ years of full stack development experience",
      "Proficiency in React, Node.js, and TypeScript",
      "Experience with cloud services (AWS/GCP)",
      "Strong understanding of web security"
    ]
  },
  {
    title: "Product Manager",
    department: "Product",
    location: "New York, NY",
    type: "Full-time",
    description: "Lead the development of our AI interview products from conception to launch.",
    requirements: [
      "4+ years of product management experience",
      "Experience with AI/ML products",
      "Strong analytical and communication skills",
      "MBA or equivalent experience"
    ]
  },
  {
    title: "UX/UI Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Create intuitive and engaging user experiences for our AI-powered interview platform.",
    requirements: [
      "3+ years of UX/UI design experience",
      "Strong portfolio showing web application design",
      "Experience with Figma and design systems",
      "Understanding of accessibility standards"
    ]
  }
];

const CareersPage = () => {
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
              Join Our Mission to Transform
              <span className="text-primary-200"> Hiring</span>
            </h1>
            <p className="text-xl text-white/90 mb-8">
              We're looking for passionate individuals who want to make a difference in how people find their dream jobs.
            </p>
            <motion.a
              href="#openings"
              className="inline-flex items-center px-8 py-4 rounded-lg bg-white text-primary-600 font-semibold hover:bg-primary-50 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Open Positions <ArrowRight className="ml-2" />
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Why Join HireVision.AI?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We offer competitive benefits and a culture that promotes innovation, growth, and work-life balance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Competitive Package",
                description: "Competitive salary, equity options, and comprehensive health benefits"
              },
              {
                title: "Remote-First Culture",
                description: "Work from anywhere with flexible hours and unlimited PTO"
              },
              {
                title: "Growth Opportunities",
                description: "Professional development budget and mentorship programs"
              },
              {
                title: "Latest Technology",
                description: "Access to cutting-edge AI tools and technologies"
              },
              {
                title: "Health & Wellness",
                description: "Mental health support and wellness programs"
              },
              {
                title: "Team Events",
                description: "Regular virtual and in-person team building activities"
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-primary-50 p-6 rounded-xl"
              >
                <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section id="openings" className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-12 text-center"
          >
            Open Positions
          </motion.h2>

          <div className="space-y-6">
            {jobOpenings.map((job, index) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-gray-600">
                      <span className="flex items-center">
                        <Building2 className="w-4 h-4 mr-2" />
                        {job.department}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 md:mt-0 btn-primary"
                  >
                    Apply Now
                  </motion.button>
                </div>
                <p className="text-gray-600 mb-4">{job.description}</p>
                <div>
                  <h4 className="font-semibold mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {job.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;