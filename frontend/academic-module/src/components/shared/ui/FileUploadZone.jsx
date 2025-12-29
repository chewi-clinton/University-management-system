import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, FileText, FileSpreadsheet, FileImage, FileArchive } from 'lucide-react';
import Button from '../shared/ui/Button';
import ProgressBar from '../shared/ui/ProgressBar';
import '../../../styles/components/FileUploadZone.css';

const FileUploadZone = ({ onUpload, accept = '*', maxSize = 10 * 1024 * 1024, multiple = true }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const inputRef = useRef(null);

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return FileText;
    if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('csv')) return FileSpreadsheet;
    if (fileType.includes('image')) return FileImage;
    if (fileType.includes('zip') || fileType.includes('rar')) return FileArchive;
    return File;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    if (maxSize && file.size > maxSize) {
      return { valid: false, error: `File size exceeds ${formatFileSize(maxSize)} limit` };
    }
    
    if (accept !== '*' && accept !== '') {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileTypeValid = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type || file.name.endsWith(type.slice(1));
      });
      
      if (!fileTypeValid) {
        return { valid: false, error: 'File type not accepted' };
      }
    }
    
    return { valid: true };
  };

  const handleFiles = (newFiles) => {
    const validFiles = [];
    const errors = [];
    
    Array.from(newFiles).forEach(file => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push({
          id: Date.now() + Math.random(),
          file,
          status: 'pending'
        });
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });
    
    if (errors.length > 0) {
      console.warn('File validation errors:', errors);
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const uploadFile = async (fileObj) => {
    setFiles(prev => prev.map(f => 
      f.id === fileObj.id ? { ...f, status: 'uploading' } : f
    ));

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          [fileObj.id]: Math.min((prev[fileObj.id] || 0) + 10, 90)
        }));
      }, 200);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, [fileObj.id]: 100 }));

      setFiles(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, status: 'completed' } : f
      ));

      // Call the upload callback
      if (onUpload) {
        await onUpload(fileObj.file);
      }

      // Remove from list after 2 seconds
      setTimeout(() => {
        removeFile(fileObj.id);
      }, 2000);

    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, status: 'error' } : f
      ));
      console.error('Upload failed:', error);
    }
  };

  const uploadAll = () => {
    files.forEach(fileObj => {
      if (fileObj.status === 'pending') {
        uploadFile(fileObj);
      }
    });
  };

  return (
    <div className="file-upload">
      <div
        className={`file-upload__zone ${isDragActive ? 'file-upload__zone--active' : ''}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={48} className="file-upload__icon" />
        <div className="file-upload__text">
          <h3>Drag & drop files here</h3>
          <p>or click to browse</p>
        </div>
        <div className="file-upload__hint">
          Max size: {formatFileSize(maxSize)}
          {accept !== '*' && ` • Accepted: ${accept}`}
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInput}
          className="file-upload__input"
        />
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            className="file-upload__preview"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h4>Files to upload:</h4>
            {files.map((fileObj) => {
              const FileIcon = getFileIcon(fileObj.file.type);
              const progress = uploadProgress[fileObj.id] || 0;
              
              return (
                <motion.div
                  key={fileObj.id}
                  className="file-upload__file"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="file-upload__file-icon">
                    <FileIcon size={20} />
                  </div>
                  <div className="file-upload__file-info">
                    <span className="file-upload__file-name">{fileObj.file.name}</span>
                    <span className="file-upload__file-size">
                      {formatFileSize(fileObj.file.size)}
                    </span>
                  </div>
                  
                  {fileObj.status === 'uploading' && (
                    <div className="file-upload__progress">
                      <ProgressBar value={progress} size="sm" />
                    </div>
                  )}
                  
                  {fileObj.status === 'completed' && (
                    <div className="file-upload__file-status file-upload__file-status--success">
                      ✓
                    </div>
                  )}
                  
                  {fileObj.status === 'error' && (
                    <div className="file-upload__file-status file-upload__file-status--error">
                      ✗
                    </div>
                  )}
                  
                  {fileObj.status === 'pending' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(fileObj.id);
                      }}
                      className="file-upload__file-remove"
                    >
                      <X size={16} />
                    </button>
                  )}
                </motion.div>
              );
            })}
            
            {files.some(f => f.status === 'pending') && (
              <Button
                onClick={uploadAll}
                variant="primary"
                size="sm"
                className="file-upload__upload-all"
              >
                Upload All ({files.filter(f => f.status === 'pending').length} files)
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploadZone;