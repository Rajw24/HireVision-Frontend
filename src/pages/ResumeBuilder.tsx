import React, { useState, useRef } from 'react';
import { Tab } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Download, Plus, Sparkles, Github, Linkedin, Mail, Phone } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';
import { generateAIContent } from '../lib/openai';
import toast from 'react-hot-toast';

const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    preview: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=400&q=80',
    atsScore: 98
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    preview: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80',
    atsScore: 96
  },
  {
    id: 'creative',
    name: 'Creative Design',
    preview: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80',
    atsScore: 92
  }
];

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
  };
  objective: string;
  experience: Array<{
    id: number;
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    id: number;
    school: string;
    degree: string;
    duration: string;
    gpa: string;
  }>;
  skills: Array<string>;
  projects: Array<{
    id: number;
    name: string;
    description: string;
    technologies: string;
  }>;
  certifications: Array<{
    id: number;
    name: string;
    issuingOrganization: string;
    date: string;
  }>;
}

export default function ResumeBuilder() {
  const [currentTab, setCurrentTab] = useState(0);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      linkedin: '',
      github: ''
    },
    objective: '',
    experience: [{ id: 1, company: '', position: '', duration: '', description: '' }],
    education: [{ id: 1, school: '', degree: '', duration: '', gpa: '' }],
    skills: [],
    projects: [{ id: 1, name: '', description: '', technologies: '' }],
    certifications: [{ id: 1, name: '', issuingOrganization: '', date: '' }]
  });

  // Set default template
  const selectedTemplate = templates[0].id;

  const handleAIGenerate = async (section: string, prompt: string) => {
    try {
      toast.loading('Generating content...');
      const content = await generateAIContent(prompt, section);
      
      switch (section) {
        case 'objective':
          setResumeData(prev => ({ ...prev, objective: content }));
          break;
        case 'experience':
          // Update specific experience entry if needed
          break;
        // Add other cases as needed
      }
      
      toast.success('Content generated successfully!');
    } catch (error) {
      toast.error('Failed to generate content');
      console.error('AI generation error:', error);
    }
  };

  const handleDownload = async () => {
    try {
      toast.loading('Generating PDF...');
      if (resumeRef.current) {
        await generatePDF(resumeRef.current.id, `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_resume.pdf`);
        toast.success('Resume downloaded successfully!');
      }
    } catch (error) {
      toast.error('Failed to download resume');
      console.error('PDF generation error:', error);
    }
  };

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tab.Group selectedIndex={currentTab} onChange={setCurrentTab}>
          <Tab.List className="flex space-x-4 bg-white p-2 rounded-xl shadow mb-8">
            {['Fill Details', 'Preview & Download'].map((tab, idx) => (
              <Tab
                key={idx}
                className={({ selected }) =>
                  `w-full py-3 text-sm font-medium rounded-lg transition-colors ${
                    selected
                      ? 'bg-[#024aad] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels>
            {/* Details Form Panel */}
            <Tab.Panel>
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-[#024aad]">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.name}
                        onChange={(e) => updatePersonalInfo('name', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="email"
                          value={resumeData.personalInfo.email}
                          onChange={(e) => updatePersonalInfo('email', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="tel"
                          value={resumeData.personalInfo.phone}
                          onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        LinkedIn
                      </label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="url"
                          value={resumeData.personalInfo.linkedin}
                          onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
                          placeholder="linkedin.com/in/johndoe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub
                      </label>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="url"
                          value={resumeData.personalInfo.github}
                          onChange={(e) => updatePersonalInfo('github', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
                          placeholder="github.com/johndoe"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Summary / Objective */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#024aad]">Professional Summary</h2>
                    <button
                      onClick={() => handleAIGenerate('objective', 'Generate a professional summary for a software developer')}
                      className="flex items-center gap-2 text-[#024aad] hover:text-[#41b0f8]"
                    >
                      <Sparkles size={20} />
                      AI Generate
                    </button>
                  </div>
                  <textarea
                    value={resumeData.objective}
                    onChange={(e) => setResumeData(prev => ({ ...prev, objective: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
                    rows={4}
                    placeholder="Write or generate your professional summary..."
                  />
                </div>

                {/* Experience Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#024aad]">Experience</h2>
                    <button
                      onClick={() => setResumeData(prev => ({
                        ...prev,
                        experience: [...prev.experience, { id: Date.now(), company: '', position: '', duration: '', description: '' }]
                      }))}
                      className="flex items-center gap-2 text-[#024aad] hover:text-[#41b0f8]"
                    >
                      <Plus size={20} />
                      Add Experience
                    </button>
                  </div>
                  {resumeData.experience.map((exp, index) => (
                    <div key={exp.id} className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const newExp = [...resumeData.experience];
                            newExp[index].company = e.target.value;
                            setResumeData(prev => ({ ...prev, experience: newExp }));
                          }}
                          className="px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
                          placeholder="Company Name"
                        />
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => {
                            const newExp = [...resumeData.experience];
                            newExp[index].position = e.target.value;
                            setResumeData(prev => ({ ...prev, experience: newExp }));
                          }}
                          className="px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
                          placeholder="Position"
                        />
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => {
                            const newExp = [...resumeData.experience];
                            newExp[index].duration = e.target.value;
                            setResumeData(prev => ({ ...prev, experience: newExp }));
                          }}
                          className="px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
                          placeholder="Duration (e.g., Jan 2020 - Present)"
                        />
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <button
                          onClick={() => handleAIGenerate('experience', `Generate a description for ${exp.position} at ${exp.company}`)}
                          className="text-sm text-[#024aad] hover:text-[#41b0f8] flex items-center gap-1"
                        >
                          <Sparkles size={16} />
                          AI Generate
                        </button>
                      </div>
                      <textarea
                        value={exp.description}
                        onChange={(e) => {
                          const newExp = [...resumeData.experience];
                          newExp[index].description = e.target.value;
                          setResumeData(prev => ({ ...prev, experience: newExp }));
                        }}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
                        rows={3}
                        placeholder="Describe your responsibilities and achievements..."
                      />
                    </div>
                  ))}
                </div>

                {/* Education Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#024aad]">Education</h2>
                    <button
                      onClick={() => setResumeData(prev => ({
                        ...prev,
                        education: [...prev.education, { id: Date.now(), school: '', degree: '', duration: '', gpa: '' }]
                      }))}
                      className="flex items-center gap-2 text-[#024aad] hover:text-[#41b0f8]"
                    >
                      <Plus size={20} />
                      Add Education
                    </button>
                  </div>
                  {resumeData.education.map((edu, index) => (
                    <div key={edu.id} className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => {
                            const newEdu = [...resumeData.education];
                            newEdu[index].school = e.target.value;
                            setResumeData(prev => ({ ...prev, education: newEdu }));
                          }}
                          className="px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
                          placeholder="School/University"
                        />
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const newEdu = [...resumeData.education];
                            newEdu[index].degree = e.target.value;
                            setResumeData(prev => ({ ...prev, education: newEdu }));
                          }}
                          className="px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
                          placeholder="Degree"
                        />
                        <input
                          type="text"
                          value={edu.duration}
                          onChange={(e) => {
                            const newEdu = [...resumeData.education];
                            newEdu[index].duration = e.target.value;
                            setResumeData(prev => ({ ...prev, education: newEdu }));
                          }}
                          className="px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
                          placeholder="Duration (e.g., 2018 - 2022)"
                        />
                        <input
                          type="text"
                          value={edu.gpa}
                          onChange={(e) => {
                            const newEdu = [...resumeData.education];
                            newEdu[index].gpa = e.target.value;
                            setResumeData(prev => ({ ...prev, education: newEdu }));
                          }}
                          className="px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
                          placeholder="GPA (optional)"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Projects Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#024aad]">Projects</h2>
                    <button
                      onClick={() => setResumeData(prev => ({
                        ...prev,
                        projects: [...prev.projects, { id: Date.now(), name: '', description: '', technologies: '' }]
                      }))}
                      className="flex items-center gap-2 text-[#024aad] hover:text-[#41b0f8]"
                    >
                      <Plus size={20} />
                      Add Project
                    </button>
                  </div>
                  {resumeData.projects.map((proj, index) => (
                    <div key={proj.id} className="bg-gray-50 p-4 rounded-lg mb-4">
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => {
                          const newProj = [...resumeData.projects];
                          newProj[index].name = e.target.value;
                          setResumeData(prev => ({ ...prev, projects: newProj }));
                        }}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad] mb-2"
                        placeholder="Project Name"
                      />
                      <textarea
                        value={proj.description}
                        onChange={(e) => {
                          const newProj = [...resumeData.projects];
                          newProj[index].description = e.target.value;
                          setResumeData(prev => ({ ...prev, projects: newProj }));
                        }}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad] mb-2"
                        rows={3}
                        placeholder="Project Description"
                      />
                      <input
                        type="text"
                        value={proj.technologies}
                        onChange={(e) => {
                          const newProj = [...resumeData.projects];
                          newProj[index].technologies = e.target.value;
                          setResumeData(prev => ({ ...prev, projects: newProj }));
                        }}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
                        placeholder="Technologies used (comma separated)"
                      />
                    </div>
                  ))}
                </div>

                {/* Skills Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#024aad]">Skills</h2>
                  </div>
                  <input
                    type="text"
                    value={resumeData.skills.join(', ')}
                    onChange={(e) => {
                      const skillsArray = e.target.value.split(',').map(skill => skill.trim());
                      setResumeData(prev => ({ ...prev, skills: skillsArray }));
                    }}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
                    placeholder="Enter skills separated by commas (e.g., JavaScript, React, AWS)"
                  />
                </div>

                {/* Certifications & Training Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#024aad]">Certifications & Training</h2>
                    <button
                      onClick={() => setResumeData(prev => ({
                        ...prev,
                        certifications: [...prev.certifications, { id: Date.now(), name: '', issuingOrganization: '', date: '' }]
                      }))}
                      className="flex items-center gap-2 text-[#024aad] hover:text-[#41b0f8]"
                    >
                      <Plus size={20} />
                      Add Certification
                    </button>
                  </div>
                  {resumeData.certifications.map((cert, index) => (
                    <div key={cert.id} className="bg-gray-50 p-4 rounded-lg mb-4">
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => {
                          const newCerts = [...resumeData.certifications];
                          newCerts[index].name = e.target.value;
                          setResumeData(prev => ({ ...prev, certifications: newCerts }));
                        }}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad] mb-2"
                        placeholder="Certification Name"
                      />
                      <input
                        type="text"
                        value={cert.issuingOrganization}
                        onChange={(e) => {
                          const newCerts = [...resumeData.certifications];
                          newCerts[index].issuingOrganization = e.target.value;
                          setResumeData(prev => ({ ...prev, certifications: newCerts }));
                        }}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad] mb-2"
                        placeholder="Issuing Organization"
                      />
                      <input
                        type="text"
                        value={cert.date}
                        onChange={(e) => {
                          const newCerts = [...resumeData.certifications];
                          newCerts[index].date = e.target.value;
                          setResumeData(prev => ({ ...prev, certifications: newCerts }));
                        }}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
                        placeholder="Date (e.g., Apr 2023)"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentTab(0)}
                    className="px-6 py-2 text-gray-600 hover:text-gray-900"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentTab(1)}
                    className="bg-[#024aad] text-white px-6 py-2 rounded-lg hover:bg-[#41b0f8] transition-colors"
                  >
                    Next: Preview
                  </button>
                </div>
              </div>
            </Tab.Panel>

            {/* Preview Panel */}
            <Tab.Panel>
              <div className="flex justify-end gap-4 mb-6">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-[#024aad] text-white px-6 py-2 rounded-lg hover:bg-[#41b0f8] transition-colors"
                >
                  <Download size={20} />
                  Download PDF
                </button>
              </div>

              {/* Resume Preview */}
              <div
                id="resume-preview"
                ref={resumeRef}
                className={`bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto ${selectedTemplate}`}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-[#024aad] mb-4">{resumeData.personalInfo.name}</h1>
                  <div className="flex justify-center items-center gap-4 text-gray-600">
                    {resumeData.personalInfo.email && (
                      <a href={`mailto:${resumeData.personalInfo.email}`} className="flex items-center gap-1">
                        <Mail size={16} />
                        {resumeData.personalInfo.email}
                      </a>
                    )}
                    {resumeData.personalInfo.phone && (
                      <a href={`tel:${resumeData.personalInfo.phone}`} className="flex items-center gap-1">
                        <Phone size={16} />
                        {resumeData.personalInfo.phone}
                      </a>
                    )}
                    {resumeData.personalInfo.linkedin && (
                      <a href={resumeData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        <Linkedin size={16} />
                        LinkedIn
                      </a>
                    )}
                    {resumeData.personalInfo.github && (
                      <a href={resumeData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        <Github size={16} />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>

                {/* Professional Summary */}
                {resumeData.objective && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-[#024aad] mb-2">Professional Summary</h2>
                    <div className="h-px bg-gray-200 mb-4" />
                    <p className="text-gray-700">{resumeData.objective}</p>
                  </div>
                )}

                {/* Experience */}
                {resumeData.experience.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-[#024aad] mb-2">Experience</h2>
                    <div className="h-px bg-gray-200 mb-4" />
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="mb-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{exp.company}</h3>
                            <p className="text-gray-600">{exp.position}</p>
                          </div>
                          <span className="text-gray-500">{exp.duration}</span>
                        </div>
                        <p className="text-gray-700">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Education */}
                {resumeData.education.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-[#024aad] mb-2">Education</h2>
                    <div className="h-px bg-gray-200 mb-4" />
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="mb-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{edu.school}</h3>
                            <p className="text-gray-600">{edu.degree}</p>
                          </div>
                          <span className="text-gray-500">{edu.duration}</span>
                        </div>
                        {edu.gpa && <p className="text-gray-700">GPA: {edu.gpa}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects */}
                {resumeData.projects.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-[#024aad] mb-2">Projects</h2>
                    <div className="h-px bg-gray-200 mb-4" />
                    {resumeData.projects.map((proj) => (
                      <div key={proj.id} className="mb-6">
                        <h3 className="font-semibold text-lg">{proj.name}</h3>
                        <p className="text-gray-700 mb-1">{proj.description}</p>
                        <p className="text-gray-600">{proj.technologies}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills */}
                {resumeData.skills.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-[#024aad] mb-2">Skills</h2>
                    <div className="h-px bg-gray-200 mb-4" />
                    <p className="text-gray-700">{resumeData.skills.join(', ')}</p>
                  </div>
                )}

                {/* Certifications & Training */}
                {resumeData.certifications.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-[#024aad] mb-2">Certifications & Training</h2>
                    <div className="h-px bg-gray-200 mb-4" />
                    {resumeData.certifications.map((cert) => (
                      <div key={cert.id} className="mb-4">
                        <h3 className="font-semibold text-lg">{cert.name}</h3>
                        <p className="text-gray-600">{cert.issuingOrganization}{cert.date}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}