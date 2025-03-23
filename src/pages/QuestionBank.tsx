import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';

// ---------- Mock Data (Expanded) ----------
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
    logo: 'https://www.nasa.gov/sites/all/themes/custom/nasatwo/images/favicons/favicon.ico',
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
    logo: 'https://www.boeing.com/favicon.ico',
    questions: [
      'Design an in-flight entertainment streaming platform',
      'Implement a flight route optimization system',
      'Discuss fail-safe mechanisms in aviation software'
    ]
  }
];

const categories = [
  'System Design',
  'Data Structures',
  'Algorithms',
  'Database',
  'Object-Oriented Design',
  'Behavioral'
];

// ---------- Main Component ----------
function QuestionBank() {
  // State to track which "page" we're on:
  // null -> show landing page
  // non-null -> show that company's questions
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  // For the search bar (used on the company-specific page)
  const [searchQuery, setSearchQuery] = useState('');

  // ---------- LANDING PAGE ----------
  if (!selectedCompany) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Title & Subtitle */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Master Your Interviews with Our Comprehensive Question Bank
            </h1>
            <p className="mt-3 text-gray-600">
              Practice with Company-Specific Questions
            </p>
          </div>

          {/* Grid of Companies */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
            {companies.map((company) => (
              <div
                key={company.name}
                onClick={() => setSelectedCompany(company.name)}
                className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center
                           cursor-pointer hover:shadow-lg transition"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-10 h-10 mb-2"
                />
                <span className="font-semibold text-gray-700">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---------- COMPANY-SPECIFIC PAGE ----------
  const company = companies.find((c) => c.name === selectedCompany);

  // Fallback if we can't find the company
  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-red-500">Company not found.</p>
      </div>
    );
  }

  // Filter the questions by search query (if needed)
  const filteredQuestions = company.questions.filter((q) =>
    q.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header: Company Name & Back Button */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={company.logo} alt={company.name} className="w-8 h-8" />
            <h2 className="text-2xl font-bold text-gray-900">
              {company.name} Interview Questions
            </h2>
          </div>
          <button
            onClick={() => setSelectedCompany(null)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
          >
            Back
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search questions, companies, or topics..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Layout: Categories + Questions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50
                               text-gray-700 hover:text-[#FF5722] transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* "Accordion-like" Header (just for style) */}
                <div className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <img src={company.logo} alt={company.name} className="w-8 h-8" />
                    <span className="font-semibold text-lg">
                      {company.name} Questions
                    </span>
                  </div>
                  <ChevronRight className="text-gray-400" />
                </div>

                {/* Questions List */}
                <div className="px-6 pb-6 space-y-4">
                  {filteredQuestions.map((question, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-gray-200
                                 hover:border-[#FF5722] transition-colors cursor-pointer"
                    >
                      <p className="text-gray-800">{question}</p>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Difficulty:</span>
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          Medium
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* If no results match the search */}
                  {filteredQuestions.length === 0 && (
                    <p className="text-gray-500">
                      No questions found for <strong>{searchQuery}</strong>.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}

export default QuestionBank;
