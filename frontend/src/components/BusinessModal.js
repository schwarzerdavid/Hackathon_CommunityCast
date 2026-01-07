import React, { useState } from 'react';
import axios from 'axios';
import './BusinessModal.css';

const BusinessModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    business_code: '',
    name: '',
    contact_info: ''
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.business_code.trim()) {
      newErrors.business_code = 'קוד גישה הוא שדה חובה';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'שם העסק הוא שדה חובה';
    }
    
    if (!formData.contact_info.trim()) {
      newErrors.contact_info = 'פרטי קשר הם שדה חובה';
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
      const response = await axios.post('/api/businesses', formData);
      console.log('Business created:', response.data);
      
      // Reset form and close modal
      setFormData({
        business_code: '',
        name: '',
        contact_info: ''
      });
      setErrors({});
      onClose();
      alert('העסק נוסף בהצלחה!');
    } catch (error) {
      console.error('Error creating business:', error);
      alert('שגיאה בהוספת העסק. אנא נסה שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>הוספת עסק חדש</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="business_code">קוד גישה (Token) *</label>
            <input
              type="text"
              id="business_code"
              name="business_code"
              value={formData.business_code}
              onChange={handleChange}
              className={errors.business_code ? 'error' : ''}
              placeholder="הזן קוד גישה לבעל העסק"
            />
            {errors.business_code && <span className="error-message">{errors.business_code}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="name">שם העסק *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="הזן שם העסק"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contact_info">פרטי קשר *</label>
            <textarea
              id="contact_info"
              name="contact_info"
              value={formData.contact_info}
              onChange={handleChange}
              className={errors.contact_info ? 'error' : ''}
              placeholder="הזן פרטי קשר (טלפון, אימייל וכו')"
              rows="3"
            />
            {errors.contact_info && <span className="error-message">{errors.contact_info}</span>}
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

export default BusinessModal;
