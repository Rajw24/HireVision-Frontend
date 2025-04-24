import React, { useState, useRef } from 'react';
import { Tab } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Download, Plus, Sparkles, Github, Linkedin, Mail, Phone, Palette, Type, Trash } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Types
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

interface Template {
  id: string;
  name: string;
  preview: string;
  atsScore: number;
}

interface Font {
  name: string;
  value: string;
}

interface Color {
  name: string;
  value: string;
  bg: string;
}

// Constants
const templates: Template[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    preview: 'https://theartofresume.com/cdn/shop/files/1_resume_template_design_19_6dafb43b-4a09-407a-b9aa-d762dfeb7017.jpg?auto=compress&cs=tinysrgb&w=400',
    atsScore: 98
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    preview: 'https://i.pinimg.com/736x/2a/af/a6/2aafa6d27c0ef9446a0367a53bc0ef5e.jpg?auto=compress&cs=tinysrgb&w=400',
    atsScore: 96
  },
  {
    id: 'creative',
    name: 'Creative Design',
    preview: 'https://media1.thehungryjpeg.com/thumbs/800_3556341_b4sqm3kp1unlpdcvrkdhxgplicqol3ezr1a7esdc.png?auto=compress&cs=tinysrgb&w=400',
    atsScore: 92
  }
];

const fonts: Font[] = [
  { name: 'Inter', value: 'font-inter' },
  { name: 'Poppins', value: 'font-poppins' },
  { name: 'Roboto', value: 'font-roboto' },
  { name: 'Montserrat', value: 'font-montserrat' },
  { name: 'Open Sans', value: 'font-opensans' },
  { name: 'Lato', value: 'font-lato' },
  { name: 'Playfair Display', value: 'font-playfair' },
  { name: 'Source Sans Pro', value: 'font-sourcesans' }
];

const colors: Color[] = [
  { name: 'Blue', value: 'text-blue-600', bg: 'bg-blue-600' },
  { name: 'Emerald', value: 'text-emerald-600', bg: 'bg-emerald-600' },
  { name: 'Purple', value: 'text-purple-600', bg: 'bg-purple-600' },
  { name: 'Rose', value: 'text-rose-600', bg: 'bg-rose-600' },
  { name: 'Amber', value: 'text-amber-600', bg: 'bg-amber-600' },
  { name: 'Teal', value: 'text-teal-600', bg: 'bg-teal-600' },
  { name: 'Indigo', value: 'text-indigo-600', bg: 'bg-indigo-600' }
];

const defaultResumeData: ResumeData = {
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
};

// Helper Functions
const generateAIContent = async (prompt: string, section: string): Promise<string> => {
  const loadingToast = toast.loading('Generating content...');
  
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const mockResponses: Record<string, string> = {
      objective:
        "Dedicated and detail-oriented software developer with 5+ years of experience in building scalable web applications. Proficient in JavaScript, TypeScript, React, and Node.js, with a strong focus on writing clean, maintainable code and delivering exceptional user experiences. Passionate about staying current with emerging technologies and best practices.",
      experience:
        "Led the development of a React-based dashboard that improved data visualization and user productivity by 30%. Collaborated with cross-functional teams to identify and implement new features. Optimized application performance, reducing load times by 45%.",
      education:
        "Completed coursework in advanced algorithms, data structures, and software engineering principles. Participated in coding competitions and hackathons.",
      project:
        "Developed a full-stack e-commerce platform using React, Node.js, and MongoDB. Implemented user authentication, product catalog, shopping cart, and payment processing features. Optimized site performance achieving a Lighthouse score of 95+.",
    };
    
    toast.dismiss(loadingToast);
    toast.success('Content generated successfully!');
    return mockResponses[section] || "AI-generated content will appear here.";
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error('Failed to generate content');
    console.error('AI generation error:', error);
    return "An error occurred during content generation.";
  }
};

const generatePDF = async (elementId: string, fileName: string): Promise<void> => {
  const loadingToast = toast.loading('Generating PDF...');
  
  try {
    const html2pdf = (await import('html2pdf.js')).default;
    
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }
    
    const opt = {
      margin: 0.5,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    await html2pdf().set(opt).from(element).save();
    
    toast.dismiss(loadingToast);
    toast.success('Resume downloaded successfully!');
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error('Failed to download resume');
    console.error('PDF generation error:', error);
  }
};

// Template Selection Component
const TemplateSelection: React.FC<{
  selectedTemplate: string;
  setSelectedTemplate: (id: string) => void;
}> = ({ selectedTemplate, setSelectedTemplate }) => (
  <div className="space-y-6 mb-8">
    <h2 className="text-2xl font-bold text-[#024aad]">Choose a Template</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {templates.map((template) => (
        <motion.div
          key={template.id}
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
          onClick={() => setSelectedTemplate(template.id)}
          className={`bg-white rounded-xl overflow-hidden shadow-md cursor-pointer transition-all ${
            selectedTemplate === template.id ? 'ring-2 ring-[#024aad]' : ''
          }`}
        >
          <div className="h-40 overflow-hidden">
            <img
              src={template.preview}
              alt={template.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{template.name}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ATS: {template.atsScore}%
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// Customization Section Component
const CustomizationSection: React.FC<{
  selectedFont: string;
  selectedColor: string;
  setSelectedFont: (font: string) => void;
  setSelectedColor: (color: string) => void;
}> = ({ selectedFont, selectedColor, setSelectedFont, setSelectedColor }) => (
  <div className="space-y-6 border-t border-gray-200 pt-6 mt-8">
    <div className="flex items-center gap-2 mb-4">
      <h2 className="text-2xl font-bold text-[#024aad]">Customize Your Resume</h2>
      <div className="flex gap-2">
        <Type size={24} className="text-gray-400" />
        <Palette size={24} className="text-gray-400" />
      </div>
    </div>
    
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Choose Font</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {fonts.map((font) => (
          <button
            key={font.value}
            onClick={() => setSelectedFont(font.value)}
            className={`p-3 rounded-lg border transition-all ${
              selectedFont === font.value
                ? 'border-[#024aad] bg-blue-50'
                : 'border-gray-200 hover:border-[#41b0f8]'
            }`}
          >
            <span className={`${font.value} text-sm`}>{font.name}</span>
          </button>
        ))}
      </div>
    </div>

    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Choose Color Theme</label>
      <div className="flex flex-wrap gap-4">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => setSelectedColor(color.value)}
            className={`w-8 h-8 rounded-full border-2 transition-transform ${
              selectedColor === color.value
                ? 'border-gray-900 scale-110'
                : 'border-transparent hover:scale-105'
            }`}
          >
            <span className={`block w-full h-full rounded-full ${color.bg}`}></span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// Personal Information Form Component
const PersonalInfoForm: React.FC<{
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}> = ({ resumeData, setResumeData }) => {
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
            placeholder="Name"
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
              placeholder="email-id"
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
              placeholder="Phone number"
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
              placeholder="linkedin profile link"
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
              placeholder="github link"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Objective Form Component
const ObjectiveForm: React.FC<{
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}> = ({ resumeData, setResumeData }) => {
  const handleAIGenerate = async () => {
    const content = await generateAIContent('Generate a professional summary for a software developer', 'objective');
    setResumeData(prev => ({ ...prev, objective: content }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#024aad]">Professional Summary</h2>
        <button
          onClick={handleAIGenerate}
          className="flex items-center gap-2 text-[#024aad] hover:text-[#41b0f8] transition-colors"
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
  );
};

// Experience Form Component
const ExperienceForm: React.FC<{
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}> = ({ resumeData, setResumeData }) => {
  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now(), company: '', position: '', duration: '', description: '' }]
    }));
  };

  const removeExperience = (index: number) => {
    const newExp = [...resumeData.experience];
    newExp.splice(index, 1);
    setResumeData(prev => ({ ...prev, experience: newExp }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newExp = [...resumeData.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    setResumeData(prev => ({ ...prev, experience: newExp }));
  };

  const handleExperienceAIGenerate = async (index: number) => {
    const exp = resumeData.experience[index];
    if (!exp.company || !exp.position) {
      return;
    }

    const content = await generateAIContent(
      `Generate a description for ${exp.position} at ${exp.company}`,
      'experience'
    );
    
    const newExperience = [...resumeData.experience];
    newExperience[index] = { ...newExperience[index], description: content };
    setResumeData(prev => ({ ...prev, experience: newExperience }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#024aad]">Experience</h2>
        <button
          onClick={addExperience}
          className="flex items-center gap-2 text-[#024aad] hover:text-[#41b0f8] transition-colors"
        >
          <Plus size={20} />
          Add Experience
        </button>
      </div>
      
      {resumeData.experience.map((exp, index) => (
        <div key={exp.id} className="bg-gray-50 p-4 rounded-lg mb-4 relative">
          {resumeData.experience.length > 1 && (
            <button 
              onClick={() => removeExperience(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <Trash size={18} />
            </button>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={exp.company}
              onChange={(e) => updateExperience(index, 'company', e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
              placeholder="Company Name"
            />
            <input
              type="text"
              value={exp.position}
              onChange={(e) => updateExperience(index, 'position', e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
              placeholder="Position"
            />
            <input
              type="text"
              value={exp.duration}
              onChange={(e) => updateExperience(index, 'duration', e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
              placeholder="Duration (e.g., Jan 2020 - Present)"
            />
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <button
              onClick={() => handleExperienceAIGenerate(index)}
              className="text-sm text-[#024aad] hover:text-[#41b0f8] flex items-center gap-1 transition-colors"
            >
              <Sparkles size={16} />
              AI Generate
            </button>
          </div>
          
          <textarea
            value={exp.description}
            onChange={(e) => updateExperience(index, 'description', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
            rows={3}
            placeholder="Describe your responsibilities and achievements..."
          />
        </div>
      ))}
    </div>
  );
};

// Education Form Component
const EducationForm: React.FC<{
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}> = ({ resumeData, setResumeData }) => {
  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { id: Date.now(), school: '', degree: '', duration: '', gpa: '' }]
    }));
  };

  const removeEducation = (index: number) => {
    const newEdu = [...resumeData.education];
    newEdu.splice(index, 1);
    setResumeData(prev => ({ ...prev, education: newEdu }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const newEdu = [...resumeData.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    setResumeData(prev => ({ ...prev, education: newEdu }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#024aad]">Education</h2>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 text-[#024aad] hover:text-[#41b0f8] transition-colors"
        >
          <Plus size={20} />
          Add Education
        </button>
      </div>
      
      {resumeData.education.map((edu, index) => (
        <div key={edu.id} className="bg-gray-50 p-4 rounded-lg mb-4 relative">
          {resumeData.education.length > 1 && (
            <button 
              onClick={() => removeEducation(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <Trash size={18} />
            </button>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={edu.school}
              onChange={(e) => updateEducation(index, 'school', e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
              placeholder="School/University"
            />
            <input
              type="text"
              value={edu.degree}
              onChange={(e) => updateEducation(index, 'degree', e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
              placeholder="Degree"
            />
            <input
              type="text"
              value={edu.duration}
              onChange={(e) => updateEducation(index, 'duration', e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
              placeholder="Duration (e.g., 2018 - 2022)"
            />
            <input
              type="text"
              value={edu.gpa}
              onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
              placeholder="GPA (optional)"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Projects Form Component
const ProjectsForm: React.FC<{
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}> = ({ resumeData, setResumeData }) => {
  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, { id: Date.now(), name: '', description: '', technologies: '' }]
    }));
  };

  const removeProject = (index: number) => {
    const newProj = [...resumeData.projects];
    newProj.splice(index, 1);
    setResumeData(prev => ({ ...prev, projects: newProj }));
  };

  const updateProject = (index: number, field: string, value: string) => {
    const newProj = [...resumeData.projects];
    newProj[index] = { ...newProj[index], [field]: value };
    setResumeData(prev => ({ ...prev, projects: newProj }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#024aad]">Projects</h2>
        <button
          onClick={addProject}
          className="flex items-center gap-2 text-[#024aad] hover:text-[#41b0f8] transition-colors"
        >
          <Plus size={20} />
          Add Project
        </button>
      </div>
      
      {resumeData.projects.map((proj, index) => (
        <div key={proj.id} className="bg-gray-50 p-4 rounded-lg mb-4 relative">
          {resumeData.projects.length > 1 && (
            <button 
              onClick={() => removeProject(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <Trash size={18} />
            </button>
          )}
          
          <input
            type="text"
            value={proj.name}
            onChange={(e) => updateProject(index, 'name', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad] mb-2"
            placeholder="Project Name"
          />
          <textarea
            value={proj.description}
            onChange={(e) => updateProject(index, 'description', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad] mb-2"
            rows={3}
            placeholder="Project Description"
          />
          <input
            type="text"
            value={proj.technologies}
            onChange={(e) => updateProject(index, 'technologies', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
            placeholder="Technologies used (comma separated)"
          />
        </div>
      ))}
    </div>
  );
};

// Skills Form Component
const SkillsForm: React.FC<{
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}> = ({ resumeData, setResumeData }) => {
  const handleSkillsChange = (value: string) => {
    const skillsArray = value.split(',').map(skill => skill.trim()).filter(Boolean);
    setResumeData(prev => ({ ...prev, skills: skillsArray }));
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#024aad]">Skills</h2>
      </div>
      <input
        type="text"
        value={resumeData.skills.join(', ')}
        onChange={(e) => handleSkillsChange(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
        placeholder="Enter skills separated by commas (e.g., JavaScript, React, AWS)"
      />
      {resumeData.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {resumeData.skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

/// Certifications Form Component

const CertificationsForm: React.FC<{
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}> = ({ resumeData, setResumeData }) => {
  const addCertification = () => {
    setResumeData(prev => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { id: Date.now(), name: '', issuingOrganization: '', date: '' }
      ]
    }));
  };

  const removeCertification = (index: number) => {
    const newCerts = [...resumeData.certifications];
    newCerts.splice(index, 1);
    setResumeData(prev => ({ ...prev, certifications: newCerts }));
  };

  const updateCertification = (index: number, field: string, value: string) => {
    const newCerts = [...resumeData.certifications];
    newCerts[index] = { ...newCerts[index], [field]: value };
    setResumeData(prev => ({ ...prev, certifications: newCerts }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#024aad]">Certifications & Training</h2>
        <button
          onClick={addCertification}
          className="flex items-center gap-2 text-[#024aad] hover:text-[#41b0f8] transition-colors"
        >
          <Plus size={20} />
          Add Certification
        </button>
      </div>

      {resumeData.certifications.map((cert, index) => (
        <div key={cert.id} className="bg-gray-50 p-4 rounded-lg mb-4 relative">
          {resumeData.certifications.length > 1 && (
            <button
              onClick={() => removeCertification(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <Trash size={18} />
            </button>
          )}

          <input
            type="text"
            value={cert.name}
            onChange={(e) => updateCertification(index, 'name', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad] mb-2"
            placeholder="Certification Name"
          />
          <input
            type="text"
            value={cert.issuingOrganization}
            onChange={(e) => updateCertification(index, 'issuingOrganization', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad] mb-2"
            placeholder="Issuing Organization"
          />
          <input
            type="text"
            value={cert.date}
            onChange={(e) => updateCertification(index, 'date', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-[#024aad] focus:border-[#024aad]"
            placeholder="Date (e.g., Apr 2023)"
          />
        </div>
      ))}
    </div>
  );
};


// Resume Preview Component
const ResumePreview: React.FC<{
  resumeData: ResumeData;
  selectedTemplate: string;
  selectedFont: string;
  selectedColor: string;
}> = ({ resumeData, selectedTemplate, selectedFont, selectedColor }) => {
  const colorBase = selectedColor.split('-')[1];
  const bgColorClass = `bg-${colorBase}-600`;
  
  return (
    <div id="resume-preview" className={`bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto ${selectedTemplate} ${selectedFont}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className={`text-4xl font-bold ${selectedColor} mb-4`}>{resumeData.personalInfo.name || 'Your Name'}</h1>
        <div className="flex flex-wrap justify-center items-center gap-4 text-gray-600">
          {(resumeData.personalInfo.email || !resumeData.personalInfo.name) && (
            <a href={`mailto:${resumeData.personalInfo.email}`} className="flex items-center gap-1">
              <Mail size={16} />
              {resumeData.personalInfo.email || 'email@example.com'}
            </a>
          )}
          {(resumeData.personalInfo.phone || !resumeData.personalInfo.name) && (
            <a href={`tel:${resumeData.personalInfo.phone}`} className="flex items-center gap-1">
              <Phone size={16} />
              {resumeData.personalInfo.phone || '123-456-7890'}
            </a>
          )}
          {(resumeData.personalInfo.linkedin || !resumeData.personalInfo.name) && (
            <a href={resumeData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <Linkedin size={16} />
              LinkedIn
            </a>
          )}
          {(resumeData.personalInfo.github || !resumeData.personalInfo.name) && (
            <a href={resumeData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <Github size={16} />
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {(resumeData.objective || !resumeData.personalInfo.name) && (
        <div className="mb-8">
          <h2 className={`text-xl font-bold ${selectedColor} mb-2`}>Professional Summary</h2>
          <div className="h-px bg-gray-200 mb-4" />
          <p className="text-gray-700">{resumeData.objective || 'A brief summary of your professional background and goals...'}</p>
        </div>
      )}

      {/* Experience */}
      {(resumeData.experience.length > 0) && (
        <div className="mb-8">
          <h2 className={`text-xl font-bold ${selectedColor} mb-2`}>Experience</h2>
          <div className="h-px bg-gray-200 mb-4" />
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{exp.company || 'Company Name'}</h3>
                  <p className="text-gray-600">{exp.position || 'Position'}</p>
                </div>
                <span className="text-gray-500 mt-1 sm:mt-0">{exp.duration || 'Duration'}</span>
              </div>
              <p className="text-gray-700">{exp.description || 'Description of responsibilities and achievements...'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {(resumeData.education.length > 0) && (
        <div className="mb-8">
          <h2 className={`text-xl font-bold ${selectedColor} mb-2`}>Education</h2>
          <div className="h-px bg-gray-200 mb-4" />
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{edu.school || 'School/University'}</h3>
                  <p className="text-gray-600">{edu.degree || 'Degree'}</p>
                </div>
                <span className="text-gray-500 mt-1 sm:mt-0">{edu.duration || 'Duration'}</span>
              </div>
              {edu.gpa && <p className="text-gray-700">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {(resumeData.projects.length > 0) && (
        <div className="mb-8">
          <h2 className={`text-xl font-bold ${selectedColor} mb-2`}>Projects</h2>
          <div className="h-px bg-gray-200 mb-4" />
          {resumeData.projects.map((proj) => (
            <div key={proj.id} className="mb-6">
              <h3 className="font-semibold text-lg">{proj.name || 'Project Name'}</h3>
              <p className="text-gray-700 mb-1">{proj.description || 'Project description...'}</p>
              <p className="text-gray-600">{proj.technologies || 'Technologies used'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {(resumeData.skills.length > 0) && (
        <div className="mb-8">
          <h2 className={`text-xl font-bold ${selectedColor} mb-2`}>Skills</h2>
          <div className="h-px bg-gray-200 mb-4" />
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span 
                key={index} 
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-opacity-20 ${bgColorClass} ${selectedColor}`}
              >
                {skill}
              </span>
            ))}
            {resumeData.skills.length === 0 && (
              <p className="text-gray-700">List of your technical and soft skills...</p>
            )}
          </div>
        </div>
      )}

      {/* Certifications & Training */}
      {(resumeData.certifications.length > 0) && (
        <div className="mb-8">
          <h2 className={`text-xl font-bold ${selectedColor} mb-2`}>Certifications & Training</h2>
          <div className="h-px bg-gray-200 mb-4" />
          {resumeData.certifications.map((cert) => (
            <div key={cert.id} className="mb-4">
              <h3 className="font-semibold text-lg">{cert.name || 'Certification Name'}</h3>
              <p className="text-gray-600">
                {cert.issuingOrganization || 'Issuing Organization'} 
                {cert.date && ` • ${cert.date}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const [selectedFont, setSelectedFont] = useState(fonts[0].value);
  const [selectedColor, setSelectedColor] = useState(colors[0].value);
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);

  const handleDownload = async () => {
    try {
      if (resumeRef.current) {
        const fileName = `${resumeData.personalInfo.name.replace(/\s+/g, '_') || 'resume'}.pdf`;
        await generatePDF('resume-preview', fileName);
      }
    } catch (error) {
      console.error('PDF generation error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-[#024aad]">Resume Builder</h1>
          <p className="text-gray-600">Create a professional resume in minutes</p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Toaster position="top-center" />
        
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-6 space-y-8"
              >
                <TemplateSelection 
                  selectedTemplate={selectedTemplate}
                  setSelectedTemplate={setSelectedTemplate}
                />
                
                <CustomizationSection 
                  selectedFont={selectedFont}
                  selectedColor={selectedColor}
                  setSelectedFont={setSelectedFont}
                  setSelectedColor={setSelectedColor}
                />
                
                <PersonalInfoForm 
                  resumeData={resumeData} 
                  setResumeData={setResumeData} 
                />
                
                <ObjectiveForm 
                  resumeData={resumeData} 
                  setResumeData={setResumeData} 
                />
                
                <ExperienceForm 
                  resumeData={resumeData} 
                  setResumeData={setResumeData} 
                />
                
                <EducationForm 
                  resumeData={resumeData} 
                  setResumeData={setResumeData} 
                />
                
                <ProjectsForm 
                  resumeData={resumeData} 
                  setResumeData={setResumeData} 
                />
                
                <SkillsForm 
                  resumeData={resumeData} 
                  setResumeData={setResumeData} 
                />
                
                <CertificationsForm 
                  resumeData={resumeData} 
                  setResumeData={setResumeData} 
                />

                <div className="flex justify-end">
                  <button
                    onClick={() => setCurrentTab(1)}
                    className="bg-[#024aad] text-white px-6 py-2 rounded-lg hover:bg-[#41b0f8] transition-colors"
                  >
                    Next: Preview
                  </button>
                </div>
              </motion.div>
            </Tab.Panel>

            {/* Preview Panel */}
            <Tab.Panel>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-end gap-4 mb-6">
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-[#024aad] text-white px-6 py-2 rounded-lg hover:bg-[#41b0f8] transition-colors"
                  >
                    <Download size={20} />
                    Download PDF
                  </button>
                </div>

                <div ref={resumeRef}>
                  <ResumePreview 
                    resumeData={resumeData}
                    selectedTemplate={selectedTemplate}
                    selectedFont={selectedFont}
                    selectedColor={selectedColor}
                  />
                </div>
                
                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setCurrentTab(0)}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Back to Edit
                  </button>
                </div>
              </motion.div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </main>
    </div>
  );
}

export default App;