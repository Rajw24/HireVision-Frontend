import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle } from 'lucide-react';

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  onStartWithoutResume: () => void;
  isLoading?: boolean;
  error?: string;
}

function ResumeUploadModal({ 
  isOpen, 
  onClose, 
  onUpload, 
  onStartWithoutResume,
  isLoading = false,
  error 
}: ResumeUploadModalProps) {
  const [dragError, setDragError] = useState<string>('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        if (error.code === 'file-too-large') {
          setDragError('File is too large. Maximum size is 5MB');
        } else if (error.code === 'file-invalid-type') {
          setDragError('Only PDF files are accepted');
        } else {
          setDragError('Invalid file');
        }
        return;
      }
      setDragError('');
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    }
  });

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={isLoading ? () => {} : onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Upload Your Resume
                </Dialog.Title>
                
                <div className="mt-2">
                  {(error || dragError) && (
                    <div className="flex items-center gap-2 p-4 bg-red-500/10 rounded-lg mb-4">
                      <AlertCircle className="text-red-500" size={20} />
                      <p className="text-sm text-red-500">
                        {error || dragError}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 p-4 bg-[#024aad]/10 rounded-lg">
                    <AlertCircle className="text-[#024aad]" size={20} />
                    <p className="text-sm text-[#024aad]">
                      Upload your resume to get personalized interview questions
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <div
                    {...getRootProps()}
                    className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
                      ${isDragActive ? 'border-[#024aad] bg-[#024aad]/10' : 'border-gray-300 hover:border-[#024aad]'}
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input {...getInputProps()} disabled={isLoading} />
                    {isLoading ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#024aad] border-t-transparent" />
                        <p className="mt-2 text-sm text-gray-600">Uploading...</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Drag & drop your resume here, or click to select file
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Maximum file size: 5MB. PDF format only.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ResumeUploadModal;