import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, ArrowLeft, Star, Clock, BookOpen, Bookmark } from 'lucide-react';

const companies = [
  {
    name: 'Google',
    logo: 'https://www.google.com/favicon.ico',
    questions: [
    'Implement a function to reverse a linked list',
    'Design a system like Google Drive',
    'Write an algorithm to find the longest palindromic substring'
    ]
    },
    {
    name: 'Microsoft',
    logo: 'https://www.microsoft.com/favicon.ico',
    questions: [
    'Implement an LRU Cache',
    'Design Azure notification system',
    'Serialize and deserialize a binary tree'
    ]
    },
    {
    name: 'Amazon',
    logo: 'https://www.amazon.com/favicon.ico',
    questions: [
    'Design Amazon’s shopping cart system',
    'Implement a rate limiter',
    'Find the maximum path sum in a binary tree'
    ]
    },
    {
    name: 'Meta',
    logo: 'https://www.facebook.com/favicon.ico',
    questions: [
    'Design Facebook’s news feed',
    'Implement a regular expression matcher',
    'Write an algorithm for friend recommendations'
    ]
    },
    {
    name: 'Apple',
    logo: 'https://www.apple.com/favicon.ico',
    questions: [
    'Design the iCloud storage system',
    'Implement an autocomplete feature for iOS',
    'Find the nth Fibonacci number using recursion'
    ]
    },
    {
    name: 'Netflix',
    logo: 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico',
    questions: [
    'Design Netflix’s recommendation engine',
    'Implement a video streaming buffer system',
    'Optimize a large-scale content delivery network'
    ]
    },
    {
    name: 'Tesla',
    logo: 'https://www.tesla.com/sites/tesla/files/favicon.ico',
    questions: [
    'Design an autonomous driving system module',
    'Implement a battery management algorithm',
    'Optimize route planning for electric vehicles'
    ]
    },
    {
    name: 'Adobe',
    logo: 'https://www.adobe.com/favicon.ico',
    questions: [
    'Design a real-time collaborative document editor',
    'Implement a color palette extraction tool',
    'Discuss an efficient way to store and version digital assets'
    ]
    },
    {
    name: 'BCG',
    logo: 'https://www.bcg.com/favicon.ico',
    questions: [
    'Walk through a strategy to enter a new market',
    'Implement a growth-share matrix algorithm for product lines',
    'Case: Evaluate the profitability of a client’s new product'
    ]
    },
    {
    name: 'Bain & Company',
    logo: 'https://www.bain.com/favicon.ico',
    questions: [
    'Discuss how to optimize a client’s supply chain',
    'Case: Reduce customer churn for a subscription service',
    'Develop a framework for corporate restructuring'
    ]
    },
    {
    name: 'Goldman Sachs',
    logo: 'https://www.goldmansachs.com/favicon.ico',
    questions: [
    'Implement a stock trading simulator',
    'Design a risk assessment system for trading derivatives',
    'Optimize data pipelines for real-time financial data'
    ]
    },
    {
    name: 'McKinsey & Company',
    logo: 'https://www.mckinsey.com/favicon.ico',
    questions: [
    'Case: Improve operational efficiency for a manufacturing firm',
    'Design a data-driven approach to organizational transformation',
    'Propose a strategy to expand into emerging markets'
    ]
    },
    {
    name: 'NASA',
    logo: 'https://www.nasa.gov/wp-content/uploads/2023/04/nasa-logo-web-rgb.png',
    questions: [
    'Plan a deep space communication architecture',
    'Implement a simulation for orbital mechanics',
    'Optimize rocket trajectory with minimal fuel usage'
    ]
    },
    {
    name: 'JPL',
    logo: 'https://www.jpl.nasa.gov/favicon.ico',
    questions: [
    'Design a Mars rover pathfinding algorithm',
    'Implement real-time sensor data aggregation',
    'Discuss anomaly detection in spacecraft telemetry'
    ]
    },
    {
    name: 'SpaceX',
    logo: 'https://www.spacex.com/favicon.ico',
    questions: [
    'Design a reusable rocket launch scheduling system',
    'Implement a telemetry data compression algorithm',
    'Optimize docking procedures for spacecraft'
    ]
    },
    {
    name: 'Boeing',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkRUu1dvJSCy6m_0Avdrz_X9AbYTnmYOhLC83XIZYTGzBQia6Y9ndFL6H-sx4Afqn7k54&usqp=CAU',
    questions: [
    'Design an in-flight entertainment streaming platform',
    'Implement a flight route optimization system',
    'Discuss fail-safe mechanisms in aviation software'
    ]
    }
    ];

const categories = [
  "System Design",
  "Data Structures",
  "Algorithms",
  "Object-Oriented Design",
  "Database Design",
  "Network Architecture"
];

function QuestionBank() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(new Set());
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const toggleBookmark = (question: string) => {
    setBookmarkedQuestions(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(question)) {
        newBookmarks.delete(question);
      } else {
        newBookmarks.add(question);
      }
      return newBookmarks;
    });
  };

  if (!selectedCompany) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Master Your Tech Interviews
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Practice with our comprehensive collection of company-specific interview questions
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {companies.map((company) => (
              <div
                key={company.name}
                onMouseEnter={() => setHoveredCard(company.name)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setSelectedCompany(company.name)}
                className={`bg-white rounded-xl p-6 transform transition-all duration-300
                           ${hoveredCard === company.name ? 'scale-105 shadow-lg ring-2 ring-blue-500 ring-opacity-50' : 'shadow-sm'}
                           hover:shadow-xl cursor-pointer group`}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 
                                flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-100 
                                transition-all duration-300">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-12 h-12 object-contain transform group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {company.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {company.questions.length} questions
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const company = companies.find((c) => c.name === selectedCompany);
  if (!company) return null;

  const filteredQuestions = company.questions.filter(q => 
    q.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!selectedCategory || q.toLowerCase().includes(selectedCategory.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => setSelectedCompany(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors
                     px-4 py-2 rounded-lg hover:bg-white hover:shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Companies</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-white shadow-sm p-2">
              <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
          </div>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions by keyword..."
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-transparent 
                     bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                     transition-all duration-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-all duration-200
                              ${category === selectedCategory 
                                ? 'bg-blue-50 text-blue-700 font-medium shadow-sm' 
                                : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredQuestions.map((question, index) => (
                <div
                  key={index}
                  onClick={() => setExpandedQuestion(expandedQuestion === question ? null : question)}
                  className={`bg-white rounded-xl shadow-sm transition-all duration-300
                           ${expandedQuestion === question ? 'ring-2 ring-blue-500 shadow-md' : ''}
                           hover:shadow-md cursor-pointer group`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {question}
                      </h4>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(question);
                        }}
                        className={`text-gray-400 hover:text-yellow-500 transition-colors
                                  ${bookmarkedQuestions.has(question) ? 'text-yellow-500' : ''}`}
                      >
                        <Star className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>45 mins</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        <span>System Design</span>
                      </div>
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                        Medium
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {filteredQuestions.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                  <p className="text-gray-500 text-lg">
                    No questions found matching your criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionBank;