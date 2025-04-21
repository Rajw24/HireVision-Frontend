import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Users, Award, Zap, ChevronDown, Brain, Target, Sparkles } from "lucide-react";
import ReactPlayer from "react-player";
import Marquee from "react-fast-marquee";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import logo from "./assets/logo.png";

const companyLogos = [
  "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
  "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Facebook.svg/640px-Facebook.svg.png"
];

const faqQuestions = [
  {
    question: "What is an AI mock interview, and how does it help job seekers?",
    answer: "An AI mock interview is a simulation that uses advanced AI technology to help job seekers practice interviewing questions. We use real-time feedback, voice recognition, and facial expression analysis to help improve your interview performance."
  },
  {
    question: "How does HireVision AI's mock interview simulator work and job preparation?",
    answer: "Our AI-powered platform simulates real interview scenarios, providing instant feedback on your responses, body language, and communication skills. It adapts to your performance and helps you improve systematically."
  },
  {
    question: "What types of questions does the AI mock interview ask?",
    answer: "We cover a wide range of interview questions including behavioral, technical, and role-specific questions tailored to your industry and experience level."
  },
  {
    question: "Is HireVision AI's mock interview tailored to specific job types?",
    answer: "Yes, our platform customizes questions and feedback based on your target role, industry, and experience level."
  },
  {
    question: "Can I get instant feedback on my answers in real-time interviews?",
    answer: "Yes, our AI provides real-time feedback on your responses, helping you improve your interview skills instantly."
  },
  {
    question: "Does the mock interview provide scoring and improvement tips?",
    answer: "Yes, you receive detailed feedback and scoring on various aspects of your interview performance, along with specific tips for improvement."
  },
  {
    question: "How is HireVision AI's mock interview different from other online interviews?",
    answer: "Our platform uses advanced AI technology to provide personalized feedback and adapts to your skill level in real-time."
  },
  {
    question: "Is HireVision AI's mock interview free to use?",
    answer: "We offer both free and premium features. You can start practicing with basic features for free."
  },
  {
    question: "How can I start using the mock interview tool on HireVision AI?",
    answer: "Simply sign up for a free account and you can start practicing right away!"
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (isOpen) {
      controls.start({ height: "auto", opacity: 1 });
    } else {
      controls.start({ height: 0, opacity: 0 });
    }
  }, [isOpen, controls]);

  return (
    <motion.div 
      className="border-b border-gray-200 py-4 hover-glow rounded-lg p-4"
      whileHover={{ scale: 1.01 }}
    >
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-gray-900 gradient-text">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 text-gray-600"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FeatureCard({ Icon, title, description, delay }: { Icon: any; title: string; description: string; delay: number }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.5, delay }}
      className="feature-card glass-effect p-6 rounded-xl"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 360 }}
        className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-6"
      >
        <Icon className="w-8 h-8 text-white" />
      </motion.div>
      <h3 className="text-xl font-semibold mb-4 gradient-text">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (heroInView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, heroInView]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = carouselRef.current.scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex-1 overflow-hidden">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        className="relative gradient-bg py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="text-left"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl font-bold leading-tight mb-6 text-black text-glow">
                Unlock Your Interview
                <span className="gradient-text"> Superpowers </span>
                with AI
              </h1>
              <p className="text-xl mb-8 text-black/90">
                Your AI-Powered Interview Copilot that helps you prepare, practice, and perfect your interview skills.
              </p>
              <motion.div
                className="flex space-x-4"
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  to="/mock-interview"
                  className="glass-effect text-black px-8 py-4 rounded-lg font-semibold hover:bg-black/20 transition-all duration-300 flex items-center text-lg hover-glow"
                >
                  Try Mock Interview <ArrowRight className="ml-2" />
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-blue text-blue px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#024aad] transition-all duration-300 text-lg"
                >
                  Learn More
                </motion.button>
              </motion.div>
            </motion.div>
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-2xl animate-float"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <ReactPlayer
                url="./src/assests/new-hero-video.mp4"
                playing
                loop
                muted
                width="100%"
                height="100%"
                className="aspect-video"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Auto-scrolling Company Logos */}
      <section className="bg-[#f8fafc] relative overflow-hidden">
        <motion.div
          ref={carouselRef}
          className="py-8 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Marquee
            speed={50}
            gradient={false}
            pauseOnHover={false}
          >
            {companyLogos.map((logo, index) => (
              <motion.img
                key={index}
                src={logo}
                alt="Company Logo"
                className="h-16 mx-6 transition-all duration-300 grayscale hover:grayscale-0"
                draggable="false"
                whileHover={{ scale: 1.1 }}
              />
            ))}
          </Marquee>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Why Choose HireVision AI?
            </h2>
            <p className="text-xl text-gray-600">
              Revolutionize your interview preparation with our cutting-edge features
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              Icon={Brain}
              title="AI-Powered Analysis"
              description="Get instant, intelligent feedback on your responses and communication style"
              delay={0.2}
            />
            <FeatureCard
              Icon={Target}
              title="Personalized Practice"
              description="Tailored questions and scenarios based on your industry and experience"
              delay={0.4}
            />
            <FeatureCard
              Icon={Sparkles}
              title="Real-time Coaching"
              description="Receive immediate guidance and suggestions for improvement"
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about HireVision AI
            </p>
          </motion.div>
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {faqQuestions.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-20 gradient-bg"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-4xl font-bold text-white mb-8 text-glow"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
          >
            Ready to Ace Your Next Interview?
          </motion.h2>
          <motion.p
            className="text-xl text-white/90 mb-12 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            Join thousands of job seekers who have improved their interview skills with HireVision AI
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/mock-interview"
              className="glass-effect text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 inline-flex items-center text-lg hover-glow"
            >
              Start Practicing Now <ArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

export default Home;