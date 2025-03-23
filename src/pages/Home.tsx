import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Users, Award, Zap, ChevronDown } from "lucide-react";
import ReactPlayer from "react-player";
import Marquee from "react-fast-marquee";
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
    question: "How does Final Round AI's mock interview simulator work and job preparation?",
    answer: "Our AI-powered platform simulates real interview scenarios, providing instant feedback on your responses, body language, and communication skills. It adapts to your performance and helps you improve systematically."
  },
  {
    question: "What types of questions does the AI mock interview ask?",
    answer: "We cover a wide range of interview questions including behavioral, technical, and role-specific questions tailored to your industry and experience level."
  },
  {
    question: "Is Final Round AI's mock interview tailored to specific job types?",
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
    question: "How is Final Round AI's mock interview different from other online interviews?",
    answer: "Our platform uses advanced AI technology to provide personalized feedback and adapts to your skill level in real-time."
  },
  {
    question: "Is Final Round AI's mock interview free to use?",
    answer: "We offer both free and premium features. You can start practicing with basic features for free."
  },
  {
    question: "How can I start using the mock interview tool on Final Round AI?",
    answer: "Simply sign up for a free account and you can start practicing right away!"
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        <ChevronDown
          className={`w-5 h-5 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="mt-2 text-gray-600">
          {answer}
        </div>
      )}
    </div>
  );
}

function Home() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-6xl font-bold leading-tight mb-6 text-[#024aad]">
                Unlock Your Interview Superpowers with AI
              </h1>
              <p className="text-xl mb-8 text-gray-600">
                Your AI-Powered Interview Copilot that helps you prepare, practice, and perfect your interview skills.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/mock-interview"
                  className="bg-[#024aad] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#41b0f8] transition-colors flex items-center text-lg"
                >
                  Try Mock Interview <ArrowRight className="ml-2" />
                </Link>
                <button className="border-2 border-[#024aad] text-[#024aad] px-8 py-4 rounded-lg font-semibold hover:bg-[#024aad] hover:text-white transition-colors text-lg">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <ReactPlayer
                url="./src/assests/new-hero-video.mp4"
                playing
                loop
                muted
                width="100%"
                height="100%"
                className="aspect-video"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Auto-scrolling Company Logos */}
      <section className="py-10 bg-[#f8fafc]">
        <Marquee speed={50} gradient={false}>
          {companyLogos.map((logo, index) => (
            <img 
              key={index} 
              src={logo} 
              alt="Company Logo" 
              className="h-16 mx-6 transition-all duration-300 grayscale hover:grayscale-0"
            />
          ))}
        </Marquee>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#024aad]">Why Choose HireVision.AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { Icon: Zap, title: "Real-time Feedback", desc: "Get instant feedback on your responses, body language, and speech patterns." },
              { Icon: Users, title: "Industry Experts", desc: "AI trained on insights from top industry professionals and hiring managers." },
              { Icon: Award, title: "Proven Results", desc: "Join thousands of successful candidates who landed their dream jobs." }
            ].map(({ Icon, title, desc }, index) => (
              <div key={index} className="bg-[#f8fafc] p-8 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-transform">
                <Icon className="w-16 h-16 text-[#41b0f8] mb-6" />
                <h3 className="text-2xl font-semibold mb-4 text-[#024aad]">{title}</h3>
                <p className="text-gray-600 text-lg">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Master Mock Interviews Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Master Mock Interviews Anytime, Anywhere</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Master your confidence with finesse. Practice from your personal space, upskill, and excel.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Practice Anytime, Anywhere</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2" />
                  <p>24/7 Access - No scheduling, no time limits, interview anytime</p>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2" />
                  <p>Instant Feedback - Get detailed analytics, insights, and recommendations</p>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2" />
                  <p>Personalized Experience - Practice with questions that match your skill level</p>
                </li>
              </ul>
              <button className="mt-8 bg-[#024aad] text-white px-6 py-3 rounded-lg hover:bg-[#41b0f8]">
                Start practicing for free
              </button>
            </div>
            <div className="bg-[#f0f4ff] p-6 rounded-xl">
              <img src="https://www.finalroundai.com/_next/image?url=/assets/images/new-ai-mock/practice-pc-1.png&w=750&q=75" alt="Mock Interview Demo" className="rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Turn Weaknesses Section */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="bg-[#f0f4ff] p-6 rounded-xl">
              <img src="https://www.finalroundai.com/_next/image?url=/assets/images/new-ai-mock/practice-pc-2.png&w=750&q=75" alt="Analytics Dashboard" className="rounded-lg" />
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl font-bold mb-6">Turn Weaknesses Into Strengths</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2" />
                  <p>AI-Powered Analysis - Discover how you're perceived professionally</p>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2" />
                  <p>Detailed Scorecards - Track your progress and areas of improvement</p>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2" />
                  <p>Expert Guidance - Receive mock interview-specific advice</p>
                </li>
              </ul>
              <button className="mt-8 bg-[#024aad] text-white px-6 py-3 rounded-lg hover:bg-[#41b0f8]">
                Start practicing for free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tailor Mock Interviews Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Tailor Mock Interviews to Your Role</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2" />
                  <p>Industry-Specific Prep - Practice for technical, business, consulting roles</p>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2" />
                  <p>Customized Questions - Industry-specific and tailored to your experience level</p>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-2" />
                  <p>Targeted feedback - Focus on techniques that matter for your role</p>
                </li>
              </ul>
              <button className="mt-8 bg-[#024aad] text-white px-6 py-3 rounded-lg hover:bg-[#41b0f8]">
                Start practicing for free
              </button>
            </div>
            <div className="bg-[#f0f4ff] p-6 rounded-xl">
              <img src="https://www.finalroundai.com/_next/image?url=/assets/images/new-ai-mock/practice-pc-3.png&w=750&q=75" alt="Role-specific Interview" className="rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Job Interviews Feel Overwhelming Section */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Why Job Interviews Feel Overwhelming and How AI Mock Interviews Can Help You Succeed
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Stop feeling unprepared and anxious. Discover how AI-powered mock interviews help you ace your dream interview with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Overcome Interview Anxiety</h3>
              <p className="text-gray-600">
                Practice in a safe, judgment-free environment where you can make mistakes and learn from them. Build confidence through repeated practice.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Master Unpredictable Questions</h3>
              <p className="text-gray-600">
                Get exposed to a wide range of potential questions and learn how to structure your responses effectively.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Get the Feedback You Deserve</h3>
              <p className="text-gray-600">
                Receive detailed, objective feedback on your responses, body language, and communication style to help you improve.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Unlock Unlimited Practice Opportunities</h3>
              <p className="text-gray-600">
                Practice as many times as you need, whenever you want. Perfect your responses until you feel confident and ready.
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
              Don't let interview anxiety hold you back. Join Final Round AI's mock interview platform and turn your next interview into a success story.
            </p>
            <button className="bg-[#024aad] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#41b0f8] transition-colors">
              Start building interview confidence now
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqQuestions.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-8">
              Have another question? Feel free to reach out to us at support@finalround.com
            </p>
          </div>
        </div>
      </section>

      {/* No More Interview Nerves Section */}
      <section className="py-20 bg-[#024aad]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">No More Interview Nerves</h2>
          <p className="text-xl mb-8">
            Our platform is a proven game changer. Start today with 5 practice interviews, and you'll notice your confidence soar. With Final Round AI, you'll get better with every practice session.
          </p>
          <button className="bg-white text-[#024aad] px-8 py-4 rounded-lg font-semibold hover:bg-[#41b0f8] hover:text-white transition-colors">
            Start building interview confidence now
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;