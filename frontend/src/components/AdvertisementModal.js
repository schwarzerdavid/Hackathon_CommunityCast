import React, { useState } from 'react';
import axios from 'axios';
import './AdvertisementModal.css';

const AdvertisementModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    business_id: '',
    title: '',
    short_text: '',
    promo_text: '',
    image_path: '',
    start_time: '',
    end_time: '',
    status: 'draft'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // In a real app, you would upload the file to the server here
      // For now, we'll just store the file name
      setFormData(prev => ({
        ...prev,
        image_path: file.name
      }));
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
      // TODO: Replace with actual backend endpoint
      const response = await axios.post('/api/advertisements', formData);
      console.log('Advertisement created:', response.data);
      
      // Reset form and close modal
      setFormData({
        business_id: '',
        title: '',
        short_text: '',
        promo_text: '',
        image_path: '',
        start_time: '',
        end_time: '',
        status: 'draft'
      });
      setErrors({});
      onClose();
      alert('הפרסומת נוספה בהצלחה!');
    } catch (error) {
      console.error('Error creating advertisement:', error);
      alert('שגיאה בהוספת הפרסומת. אנא נסה שוב.');
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
            <label htmlFor="business_id">מזהה עסק *</label>
            <input
              type="text"
              id="business_id"
              name="business_id"
              value={formData.business_id}
              onChange={handleChange}
              className={errors.business_id ? 'error' : ''}
              placeholder="הזן מזהה עסק"
            />
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
            <label htmlFor="image">תמונה</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
              className="file-input"
            />
            {formData.image_path && (
              <span className="file-name">קובץ נבחר: {formData.image_path}</span>
            )}
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
              <option value="draft">טיוטה</option>
              <option value="active">פעיל</option>
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
