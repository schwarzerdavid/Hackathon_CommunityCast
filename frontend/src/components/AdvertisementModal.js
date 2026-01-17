import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdvertisementModal.css';

const AdvertisementModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    business_id: '',
    title: '',
    short_text: '',
    promo_text: '',
    start_time: '',
    end_time: '',
    status: 'active'
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);

  // Fetch businesses when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchBusinesses();
    }
  }, [isOpen]);

  const fetchBusinesses = async () => {
    try {
      setLoadingBusinesses(true);
      const response = await axios.get('http://localhost:3001/api/businesses');
      setBusinesses(response.data.businesses || []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      alert('שגיאה בטעינת רשימת העסקים');
    } finally {
      setLoadingBusinesses(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.business_id.trim()) {
      newErrors.business_id = 'מזהה עסק הוא שדה חובה';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'כותרת היא שדה חובה';
    }
    
    if (!formData.short_text.trim()) {
      newErrors.short_text = 'טקסט תמציתי הוא שדה חובה';
    }
    
    if (!formData.promo_text.trim()) {
      newErrors.promo_text = 'פירוט המבצע הוא שדה חובה';
    }
    
    if (!formData.start_time) {
      newErrors.start_time = 'תאריך התחלה הוא שדה חובה';
    }
    
    if (!formData.end_time) {
      newErrors.end_time = 'תאריך סיום הוא שדה חובה';
    }
    
    if (formData.start_time && formData.end_time && 
        new Date(formData.start_time) >= new Date(formData.end_time)) {
      newErrors.end_time = 'תאריך הסיום חייב להיות אחרי תאריך ההתחלה';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert datetime-local to ISO format
      const startTimeISO = new Date(formData.start_time).toISOString();
      const endTimeISO = new Date(formData.end_time).toISOString();

      // If there's a file, use FormData
      if (selectedFile) {
        const data = new FormData();
        data.append('business_id', formData.business_id);
        data.append('title', formData.title);
        data.append('short_text', formData.short_text);
        data.append('promo_text', formData.promo_text);
        data.append('start_time', startTimeISO);
        data.append('end_time', endTimeISO);
        data.append('status', formData.status);
        data.append('image', selectedFile);

        const response = await axios.post('http://localhost:3001/api/advertisements', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Advertisement created:', response.data);
      } else {
        // No file, send JSON
        const response = await axios.post('http://localhost:3001/api/advertisements', {
          business_id: formData.business_id,
          title: formData.title,
          short_text: formData.short_text,
          promo_text: formData.promo_text,
          start_time: startTimeISO,
          end_time: endTimeISO,
          status: formData.status
        });
        console.log('Advertisement created:', response.data);
      }

      // Reset form and close modal
      setFormData({
        business_id: '',
        title: '',
        short_text: '',
        promo_text: '',
        start_time: '',
        end_time: '',
        status: 'active'
      });
      setSelectedFile(null);
      setErrors({});
      alert('הפרסומת נוספה בהצלחה!');

      // Notify parent to refresh list
      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error('Error creating advertisement:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'שגיאה בהוספת הפרסומת. אנא נסה שוב.';
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content ad-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>הוספת פרסומת חדשה</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="business_id">בחר עסק *</label>
            {loadingBusinesses ? (
              <div style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
                טוען עסקים...
              </div>
            ) : businesses.length === 0 ? (
              <div style={{ padding: '10px', color: '#e74c3c', background: '#fee', borderRadius: '4px' }}>
                אין עסקים במערכת. אנא הוסף עסק תחילה.
              </div>
            ) : (
              <select
                id="business_id"
                name="business_id"
                value={formData.business_id}
                onChange={handleChange}
                className={errors.business_id ? 'error' : ''}
              >
                <option value="">בחר עסק...</option>
                {businesses.map(business => (
                  <option key={business.business_id} value={business.business_id}>
                    {business.name} ({business.business_code})
                  </option>
                ))}
              </select>
            )}
            {errors.business_id && <span className="error-message">{errors.business_id}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="title">כותרת הפרסומת *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
              placeholder="למשל: מבצע סוף עונה"
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="short_text">טקסט תמציתי (ללוח המרוכז) *</label>
            <textarea
              id="short_text"
              name="short_text"
              value={formData.short_text}
              onChange={handleChange}
              className={errors.short_text ? 'error' : ''}
              placeholder="טקסט קצר לתצוגה בלוח"
              rows="2"
            />
            {errors.short_text && <span className="error-message">{errors.short_text}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="promo_text">פירוט המבצע (לרוטציה) *</label>
            <textarea
              id="promo_text"
              name="promo_text"
              value={formData.promo_text}
              onChange={handleChange}
              className={errors.promo_text ? 'error' : ''}
              placeholder="פירוט מלא של המבצע"
              rows="4"
            />
            {errors.promo_text && <span className="error-message">{errors.promo_text}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="image">תמונה (אופציונלי)</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="file-input"
            />
            {selectedFile && (
              <span className="file-name">קובץ נבחר: {selectedFile.name}</span>
            )}
            <small style={{display: 'block', marginTop: '5px', color: '#666'}}>
              קבצים נתמכים: JPG, PNG, GIF, WebP (מקסימום 5MB)
            </small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_time">תאריך ושעת התחלה *</label>
              <input
                type="datetime-local"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className={errors.start_time ? 'error' : ''}
              />
              {errors.start_time && <span className="error-message">{errors.start_time}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="end_time">תאריך ושעת סיום *</label>
              <input
                type="datetime-local"
                id="end_time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className={errors.end_time ? 'error' : ''}
              />
              {errors.end_time && <span className="error-message">{errors.end_time}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">סטטוס *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">פעיל</option>
              <option value="draft">טיוטה</option>
              <option value="disabled">מושבת</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              ביטול
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'שומר...' : 'שמור'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvertisementModal;
