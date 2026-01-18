import React, { useState } from 'react';
import axios from 'axios';
import './BusinessModal.css';

const BusinessModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
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
      const response = await axios.post('http://localhost:3001/api/businesses', formData);
      console.log('Business created:', response.data);

      const businessCode = response.data.business?.business_code;

      // Reset form
      setFormData({
        name: '',
        contact_info: ''
      });
      setErrors({});

      // Show success message with generated code
      alert(`העסק נוסף בהצלחה!\n\nקוד גישה לעסק: ${businessCode}\n\nשמור קוד זה - הוא נחוץ ליצירת מודעות`);
      onClose();
    } catch (error) {
      console.error('Error creating business:', error);
      const errorMsg = error.response?.data?.error || 'שגיאה בהוספת העסק. אנא נסה שוב.';
      alert(errorMsg);
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

          <div className="info-message" style={{
            padding: '10px',
            backgroundColor: '#e7f3ff',
            borderRadius: '4px',
            marginBottom: '15px',
            fontSize: '14px'
          }}>
            💡 קוד גישה ייווצר אוטומטית עבור העסק
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
