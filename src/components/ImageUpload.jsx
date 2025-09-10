import React, { useState, useRef } from 'react';
import { Upload, X, Eye, Download } from 'lucide-react';

const ImageUpload = ({ 
  images = [], 
  onImagesChange, 
  maxImages = 5, 
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSizeInMB = 5,
  label = 'Anexar Imagens'
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const validFiles = [];
    const errors = [];

    fileArray.forEach(file => {
      // Verificar tipo de arquivo
      if (!acceptedTypes.includes(file.type)) {
        errors.push(`${file.name}: Tipo de arquivo não suportado`);
        return;
      }

      // Verificar tamanho do arquivo
      if (file.size > maxSizeInMB * 1024 * 1024) {
        errors.push(`${file.name}: Arquivo muito grande (máx. ${maxSizeInMB}MB)`);
        return;
      }

      // Verificar limite de imagens
      if (images.length + validFiles.length >= maxImages) {
        errors.push(`Máximo de ${maxImages} imagens permitidas`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      const newImages = validFiles.map(file => ({
        id: Date.now() + Math.random(),
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size
      }));

      onImagesChange([...images, ...newImages]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (imageId) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    onImagesChange(updatedImages);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '6px'
    },
    uploadArea: {
      border: `2px dashed ${dragActive ? '#3b82f6' : '#d1d5db'}`,
      borderRadius: '8px',
      padding: '24px',
      textAlign: 'center',
      backgroundColor: dragActive ? '#eff6ff' : '#f9fafb',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    uploadContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px'
    },
    uploadIcon: {
      width: '48px',
      height: '48px',
      color: '#9ca3af'
    },
    uploadText: {
      fontSize: '14px',
      color: '#6b7280'
    },
    uploadSubtext: {
      fontSize: '12px',
      color: '#9ca3af'
    },
    hiddenInput: {
      display: 'none'
    },
    imageGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '12px'
    },
    imageItem: {
      position: 'relative',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid #e5e7eb',
      backgroundColor: '#fff'
    },
    imagePreview: {
      width: '100%',
      height: '120px',
      objectFit: 'cover'
    },
    imageInfo: {
      padding: '8px',
      fontSize: '11px',
      color: '#6b7280'
    },
    imageActions: {
      position: 'absolute',
      top: '4px',
      right: '4px',
      display: 'flex',
      gap: '4px'
    },
    actionButton: {
      width: '24px',
      height: '24px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px'
    },
    removeButton: {
      backgroundColor: 'rgba(239, 68, 68, 0.9)',
      color: 'white'
    },
    viewButton: {
      backgroundColor: 'rgba(59, 130, 246, 0.9)',
      color: 'white'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      position: 'relative',
      maxWidth: '90vw',
      maxHeight: '90vh'
    },
    modalImage: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain'
    },
    closeModal: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  };

  return (
    <div style={styles.container}>
      <label style={styles.label}>{label}</label>
      
      {/* Upload Area */}
      <div
        style={styles.uploadArea}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div style={styles.uploadContent}>
          <Upload style={styles.uploadIcon} />
          <div style={styles.uploadText}>
            Clique para selecionar ou arraste imagens aqui
          </div>
          <div style={styles.uploadSubtext}>
            Máx. {maxImages} imagens • {acceptedTypes.join(', ')} • Até {maxSizeInMB}MB cada
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleInputChange}
          style={styles.hiddenInput}
        />
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div style={styles.imageGrid}>
          {images.map((image) => (
            <div key={image.id} style={styles.imageItem}>
              <img
                src={image.url}
                alt={image.name}
                style={styles.imagePreview}
              />
              
              <div style={styles.imageActions}>
                <button
                  style={{...styles.actionButton, ...styles.viewButton}}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewImage(image);
                  }}
                  title="Visualizar"
                >
                  <Eye size={12} />
                </button>
                <button
                  style={{...styles.actionButton, ...styles.removeButton}}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(image.id);
                  }}
                  title="Remover"
                >
                  <X size={12} />
                </button>
              </div>
              
              <div style={styles.imageInfo}>
                <div>{image.name}</div>
                <div>{formatFileSize(image.size)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div style={styles.modal} onClick={() => setPreviewImage(null)}>
          <div style={styles.modalContent}>
            <img
              src={previewImage.url}
              alt={previewImage.name}
              style={styles.modalImage}
            />
            <button
              style={styles.closeModal}
              onClick={() => setPreviewImage(null)}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;