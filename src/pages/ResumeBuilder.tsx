import React, { useState } from 'react';
import { Download, Save, Plus, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';

const initialState = {
  jobOffer: {
    title: '',
    location: ''
  },
  contact: {
    name: '',
    email: '',
    phone: '',
    website: ''
  },
  objective: '',
  workExperience: [
    {
      id: 1,
      company: '',
      jobTitle: '',
      date: '',
      description: ''
    }
  ],
  education: [
    {
      id: 1,
      school: '',
      degree: '',
      date: '',
      gpa: '',
      additionalInfo: ''
    }
  ],
  projects: [
    {
      id: 1,
      title: '',
      date: '',
      description: '',
      bulletHidden: false
    }
  ],
  skills: {
    bulletHidden: false,
    featuredSkills: ['', '', '', '', '', '']
  },
  resumeSettings: {
    themeColor: '#024aad',
    fontFamily: 'Arial'
  }
};

function App() {
  const [resumeData, setResumeData] = useState(initialState);

  /* -------------------------------
     Utility / State Update Methods
  ---------------------------------*/

  // For updating simple nested objects (e.g., jobOffer.title)
  const handleInputChange = (section, field, value) => {
    // If 'field' is empty (like in objective), treat 'section' as the key
    if (!field) {
      setResumeData(prev => ({
        ...prev,
        [section]: value
      }));
      return;
    }
    // Otherwise, update a specific field in a sub-object
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // For adding new array items (e.g., workExperience, education, projects)
  const addNewItem = (section) => {
    // Create a blank entry based on the section
    let newItem;
    if (section === 'workExperience') {
      newItem = {
        id: resumeData[section].length + 1,
        company: '',
        jobTitle: '',
        date: '',
        description: ''
      };
    } else if (section === 'education') {
      newItem = {
        id: resumeData[section].length + 1,
        school: '',
        degree: '',
        date: '',
        gpa: '',
        additionalInfo: ''
      };
    } else if (section === 'projects') {
      newItem = {
        id: resumeData[section].length + 1,
        title: '',
        date: '',
        description: '',
        bulletHidden: false
      };
    }
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  // For updating an item in an array (workExperience, education, projects)
  const updateArrayItem = (section, index, field, value) => {
    const newArray = [...resumeData[section]];
    newArray[index] = {
      ...newArray[index],
      [field]: value
    };
    setResumeData(prev => ({
      ...prev,
      [section]: newArray
    }));
  };

  // For toggling a boolean inside a sub-object or array item
  const toggleArrayItemField = (section, index, field) => {
    const newArray = [...resumeData[section]];
    newArray[index] = {
      ...newArray[index],
      [field]: !newArray[index][field]
    };
    setResumeData(prev => ({
      ...prev,
      [section]: newArray
    }));
  };

  // For updating skills bulletHidden or featured skills
  const handleSkillsChange = (field, value, index = null) => {
    if (field === 'bulletHidden') {
      setResumeData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          bulletHidden: value
        }
      }));
    } else if (field === 'featuredSkills' && index !== null) {
      const updatedSkills = [...resumeData.skills.featuredSkills];
      updatedSkills[index] = value;
      setResumeData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          featuredSkills: updatedSkills
        }
      }));
    }
  };

  // For updating resume settings (themeColor, fontFamily, etc.)
  const handleResumeSettingChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      resumeSettings: {
        ...prev.resumeSettings,
        [field]: value
      }
    }));
  };

  /* -------------------------------
     Render
  ---------------------------------*/
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              AI Resume Builder
            </h1>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900">
                <Download size={20} />
                Download Resume
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#024aad] text-white rounded-md hover:bg-[#41b0f8]"
              >
                <Save size={20} />
                Save
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Form Panel (Left) */}
          <div className="w-1/2">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">

              {/* Job Offer Section */}
              <section>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#024aad] focus:ring focus:ring-[#024aad] focus:ring-opacity-50"
                      value={resumeData.jobOffer.title}
                      onChange={(e) => handleInputChange('jobOffer', 'title', e.target.value)}
                      placeholder="Job Offer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#024aad] focus:ring focus:ring-[#024aad] focus:ring-opacity-50"
                      value={resumeData.jobOffer.location}
                      onChange={(e) => handleInputChange('jobOffer', 'location', e.target.value)}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#024aad] focus:ring focus:ring-[#024aad] focus:ring-opacity-50"
                        value={resumeData.contact.phone}
                        onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                        placeholder="(666) 666-6666"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#024aad] focus:ring focus:ring-[#024aad] focus:ring-opacity-50"
                        value={resumeData.contact.email}
                        onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                        placeholder="hi@finalroundai.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <input
                      type="url"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#024aad] focus:ring focus:ring-[#024aad] focus:ring-opacity-50"
                      value={resumeData.contact.website}
                      onChange={(e) => handleInputChange('contact', 'website', e.target.value)}
                      placeholder="https://www.linkedin.com/company/finalroundai"
                    />
                  </div>
                </div>
              </section>

              {/* Objective Section */}
              <section>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">Objective</label>
                    <button className="text-[#024aad] text-sm flex items-center gap-1">
                      <Sparkles size={16} />
                      AI Generate
                    </button>
                  </div>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#024aad] focus:ring focus:ring-[#024aad] focus:ring-opacity-50"
                    rows="4"
                    value={resumeData.objective}
                    onChange={(e) => handleInputChange('objective', '', e.target.value)}
                    placeholder="AI superpower to assist candidates in navigating the challenges of this recruitment season."
                  />
                </div>
              </section>

              {/* Work Experience Section */}
              <section>
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-[#024aad]">WORK EXPERIENCE</span>
                </h2>
                {resumeData.workExperience.map((exp, index) => (
                  <div key={exp.id} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Company</label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#024aad] focus:ring focus:ring-[#024aad] focus:ring-opacity-50"
                        value={exp.company}
                        onChange={(e) => updateArrayItem('workExperience', index, 'company', e.target.value)}
                        placeholder="Final Round AI"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Job Title</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#024aad] focus:ring focus:ring-[#024aad] focus:ring-opacity-50"
                          value={exp.jobTitle}
                          onChange={(e) => updateArrayItem('workExperience', index, 'jobTitle', e.target.value)}
                          placeholder="Chief Resume Editor"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#024aad] focus:ring focus:ring-[#024aad] focus:ring-opacity-50"
                          value={exp.date}
                          onChange={(e) => updateArrayItem('workExperience', index, 'date', e.target.value)}
                          placeholder="APR 2024 - Present"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <button className="text-[#024aad] text-sm flex items-center gap-1">
                          <Sparkles size={16} />
                          AI Generate
                        </button>
                      </div>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#024aad] focus:ring focus:ring-[#024aad] focus:ring-opacity-50"
                        rows="3"
                        value={exp.description}
                        onChange={(e) => updateArrayItem('workExperience', index, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addNewItem('workExperience')}
                  className="flex items-center gap-2 text-[#024aad] hover:text-[#41b0f8]"
                >
                  <Plus size={20} />
                  Add an experience
                </button>
              </section>

              {/* Education Section */}
              <section>
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-[#024aad]">EDUCATION</span>
                </h2>
                {resumeData.education.map((edu, index) => (
                  <div key={edu.id} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">School</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#024aad] focus:ring focus:ring-[#024aad] focus:ring-opacity-50"
                          value={edu.school}
                          onChange={(e) => updateArrayItem('education', index, 'school', e.target.value)}
                          placeholder="Final Round AI University"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#024aad] focus:ring focus:ring-[#024aad] focus:ring-opacity-50"
                          value={edu.date}
                          onChange={(e) => updateArrayItem('education', index, 'date', e.target.value)}
                          placeholder="APR 2024"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Degree & Major</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#024aad] focus:ring focus:ring-[#024aad] focus:ring-opacity-50"
                          value={edu.degree}
                          onChange={(e) => updateArrayItem('education', index, 'degree', e.target.value)}
                          placeholder="Bachelor of Science in Computer Engineering"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">GPA</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#024aad] focus:ring focus:ring-[#024aad] focus:ring-opacity-50"
                          value={edu.gpa}
                          onChange={(e) => updateArrayItem('education', index, 'gpa', e.target.value)}
                          placeholder="4.00"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700">Additional Information (Optional)</label>
                        <button className="text-[#024aad] text-sm flex items-center gap-1">
                          <Sparkles size={16} />
                          AI Generate
                        </button>
                      </div>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#024aad] focus:ring focus:ring-[#024aad] focus:ring-opacity-50"
                        rows="3"
                        value={edu.additionalInfo}
                        onChange={(e) => updateArrayItem('education', index, 'additionalInfo', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addNewItem('education')}
                  className="flex items-center gap-2 text-[#024aad] hover:text-[#41b0f8]"
                >
                  <Plus size={20} />
                  Add an education
                </button>
              </section>

              {/* ---------------------------
                  NEW: PROJECTS SECTION
              ----------------------------*/}
              <section>
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-[#024aad]">PROJECT</span>
                  <ChevronUp size={16} className="text-gray-400 cursor-pointer" />
                  <ChevronDown size={16} className="text-gray-400 cursor-pointer" />
                </h2>
                {resumeData.projects.map((proj, index) => (
                  <div key={proj.id} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700">
                      {`${index + 1}st Experience`}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Project Name</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#024aad] focus:ring focus:ring-[#024aad] focus:ring-opacity-50"
                          value={proj.title}
                          onChange={(e) => updateArrayItem('projects', index, 'title', e.target.value)}
                          placeholder="Final Round AI Resume Builder"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#024aad] focus:ring focus:ring-[#024aad] focus:ring-opacity-50"
                          value={proj.date}
                          onChange={(e) => updateArrayItem('projects', index, 'date', e.target.value)}
                          placeholder="Summer 2024"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <button className="text-[#024aad] text-sm flex items-center gap-1">
                          <Sparkles size={16} />
                          AI Generate
                        </button>
                      </div>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#024aad] focus:ring focus:ring-[#024aad] focus:ring-opacity-50"
                        rows="3"
                        value={proj.description}
                        onChange={(e) => updateArrayItem('projects', index, 'description', e.target.value)}
                        placeholder="Brief details about this project..."
                      />
                    </div>
                    {/* Toggle for bulletHidden */}
                    <div className="flex items-center gap-2">
                      <label className="block text-sm font-medium text-gray-700">Bullets Hidden</label>
                      <input
                        type="checkbox"
                        checked={proj.bulletHidden}
                        onChange={() => toggleArrayItemField('projects', index, 'bulletHidden')}
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addNewItem('projects')}
                  className="flex items-center gap-2 text-[#024aad] hover:text-[#41b0f8]"
                >
                  <Plus size={20} />
                  Add Project
                </button>
              </section>

              {/* ---------------------------
                  NEW: SKILLS SECTION
              ----------------------------*/}
              <section>
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-[#024aad]">SKILLS</span>
                </h2>
                <div className="flex items-center gap-2 mb-4">
                  <label className="block text-sm font-medium text-gray-700">Skills List</label>
                  <button
                    className="text-sm text-[#024aad] hover:text-[#41b0f8]"
                    onClick={() => handleSkillsChange('bulletHidden', !resumeData.skills.bulletHidden)}
                  >
                    {resumeData.skills.bulletHidden ? '[ Bullets Hidden ]' : '[ Bullets Shown ]'}
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Featured Skills (Optional)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Highlight top skills; more circles mean higher proficiency.
                  </p>
                  {resumeData.skills.featuredSkills.map((skill, idx) => (
                    <input
                      key={idx}
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#024aad] focus:ring focus:ring-[#024aad] focus:ring-opacity-50 mb-2"
                      placeholder={`Featured Skill ${idx + 1}`}
                      value={skill}
                      onChange={(e) => handleSkillsChange('featuredSkills', e.target.value, idx)}
                    />
                  ))}
                </div>
              </section>

              {/* ---------------------------
                  NEW: RESUME SETTINGS
              ----------------------------*/}
              <section>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  <span className="text-[#024aad]">Resume Settings</span>
                </h2>
                {/* Theme Color */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme Color</label>
                  <div className="flex items-center gap-2">
                    {[
                      '#024aad',
                      '#41b0f8',
                      '#f0f4ff',
                      '#ff6b4a',
                      '#0f172a',
                      '#ffd4e7',
                      '#ff4800'
                    ].map((color) => (
                      <div
                        key={color}
                        onClick={() => handleResumeSettingChange('themeColor', color)}
                        className="w-6 h-6 rounded-full cursor-pointer border border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                {/* Font Family */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                  <select
                    className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-[#024aad] focus:ring focus:ring-[#024aad] focus:ring-opacity-50"
                    value={resumeData.resumeSettings.fontFamily}
                    onChange={(e) => handleResumeSettingChange('fontFamily', e.target.value)}
                  >
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Helvetica">Helvetica</option>
                  </select>
                </div>
              </section>
            </div>
          </div>

          {/* Resume Preview (Right) */}
          <div className="w-1/2">
            <div
              className="bg-white rounded-lg shadow-sm p-8 min-h-[calc(100vh-120px)]"
              style={{ fontFamily: resumeData.resumeSettings.fontFamily }}
            >
              {/* Objective Section */}
              <section className="mb-8">
                <h2
                  className="font-bold text-lg mb-2"
                  style={{ color: resumeData.resumeSettings.themeColor }}
                >
                  OBJECTIVE
                </h2>
                <div
                  className="h-px mb-4"
                  style={{ backgroundColor: resumeData.resumeSettings.themeColor }}
                />
                <p className="text-gray-700">{resumeData.objective}</p>
              </section>

              {/* Work Experience Section */}
              <section className="mb-8">
                <h2
                  className="font-bold text-lg mb-2"
                  style={{ color: resumeData.resumeSettings.themeColor }}
                >
                  WORK EXPERIENCE
                </h2>
                <div
                  className="h-px mb-4"
                  style={{ backgroundColor: resumeData.resumeSettings.themeColor }}
                />
                {resumeData.workExperience.map((exp) => (
                  <div key={exp.id} className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold">{exp.company}</h3>
                      <span className="text-gray-600">{exp.date}</span>
                    </div>
                    <p className="text-gray-700 italic mb-2">{exp.jobTitle}</p>
                    <p className="text-gray-600">{exp.description}</p>
                  </div>
                ))}
              </section>

              {/* Education Section */}
              <section className="mb-8">
                <h2
                  className="font-bold text-lg mb-2"
                  style={{ color: resumeData.resumeSettings.themeColor }}
                >
                  EDUCATION
                </h2>
                <div
                  className="h-px mb-4"
                  style={{ backgroundColor: resumeData.resumeSettings.themeColor }}
                />
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold">{edu.school}</h3>
                      <span className="text-gray-600">{edu.date}</span>
                    </div>
                    <p className="text-gray-700 italic mb-2">{edu.degree}</p>
                    {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                    {edu.additionalInfo && <p className="text-gray-600">{edu.additionalInfo}</p>}
                  </div>
                ))}
              </section>

              {/* Projects Section */}
              <section className="mb-8">
                <h2
                  className="font-bold text-lg mb-2"
                  style={{ color: resumeData.resumeSettings.themeColor }}
                >
                  PROJECT
                </h2>
                <div
                  className="h-px mb-4"
                  style={{ backgroundColor: resumeData.resumeSettings.themeColor }}
                />
                {resumeData.projects.map((proj) => (
                  <div key={proj.id} className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold">{proj.title}</h3>
                      <span className="text-gray-600">{proj.date}</span>
                    </div>
                    <p className="text-gray-600">
                      {proj.description}
                    </p>
                    {!proj.bulletHidden && (
                      <ul className="list-disc list-inside text-gray-600 mt-2">
                        <li>Bullet point example</li>
                        <li>Bullet point example</li>
                      </ul>
                    )}
                  </div>
                ))}
              </section>

              {/* Skills Section */}
              <section className="mb-8">
                <h2
                  className="font-bold text-lg mb-2"
                  style={{ color: resumeData.resumeSettings.themeColor }}
                >
                  SKILLS
                </h2>
                <div
                  className="h-px mb-4"
                  style={{ backgroundColor: resumeData.resumeSettings.themeColor }}
                />
                {/* If bullets are not hidden, display as a list */}
                {!resumeData.skills.bulletHidden ? (
                  <ul className="list-disc list-inside text-gray-600">
                    {resumeData.skills.featuredSkills
                      .filter((skill) => skill.trim() !== '')
                      .map((skill, idx) => (
                        <li key={idx}>{skill}</li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">
                    {resumeData.skills.featuredSkills
                      .filter((skill) => skill.trim() !== '')
                      .join(', ')}
                  </p>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
