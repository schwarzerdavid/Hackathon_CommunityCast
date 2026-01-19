import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './AdList.css';

const AdList = ({ refreshTrigger }) => {
  const [ads, setAds] = useState([]);
  const [businesses, setBusinesses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAds();
  }, [refreshTrigger]);

  const fetchAds = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch advertisements
      const adsResponse = await axios.get(`${API_URL}/api/advertisements`);
      const adsData = adsResponse.data.advertisements || [];

      // Fetch businesses
      const businessesResponse = await axios.get(`${API_URL}/api/businesses`);
      const businessesData = businessesResponse.data.businesses || [];

      // Create a map of business_id -> business_name
      const businessMap = {};
      businessesData.forEach(business => {
        businessMap[business.business_id] = business.name;
      });

      setAds(adsData);
      setBusinesses(businessMap);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('שגיאה בטעינת הנתונים');
      setLoading(false);
    }
  };

  const toggleStatus = async (adId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'disabled' : 'active';

      await axios.put(`${API_URL}/api/advertisements/${adId}`, {
        status: newStatus
      });

      // Refresh the list
      fetchAds();
    } catch (err) {
      console.error('Error toggling status:', err);
      alert('שגיאה בשינוי סטטוס הפרסומת');
    }
  };

  const deleteAd = async (adId) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את הפרסומת?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/advertisements/${adId}`);
      // Refresh the list
      fetchAds();
    } catch (err) {
      console.error('Error deleting advertisement:', err);
      alert('שגיאה במחיקת הפרסומת');
    }
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isAdActive = (ad) => {
    if (ad.status !== 'active') return false;

    const now = new Date();
    const start = new Date(ad.start_time);
    const end = new Date(ad.end_time);

    return now >= start && now <= end;
  };

  if (loading) {
    return <div className="ad-list-loading">טוען...</div>;
  }

  if (error) {
    return <div className="ad-list-error">{error}</div>;
  }

  if (ads.length === 0) {
    return <div className="ad-list-empty">אין פרסומות להצגה</div>;
  }

  return (
    <div className="ad-list">
      <h2>רשימת פרסומות</h2>
      <div className="ad-list-container">
        {ads.map(ad => (
          <div key={ad.ad_id} className={`ad-card ${isAdActive(ad) ? 'active' : 'inactive'}`}>
            <div className="ad-header">
              <h3>{ad.title}</h3>
              <span className={`status-badge ${ad.status}`}>
                {ad.status === 'active' ? 'פעיל' : ad.status === 'draft' ? 'טיוטה' : 'מושבת'}
              </span>
            </div>

            <div className="ad-body">
              {ad.image_path && (
                <div className="ad-image-container">
                  <img
                    src={`${API_URL}/${ad.image_path}`}
                    alt={ad.title}
                    className="ad-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="ad-image-error" style={{ display: 'none' }}>
                    ❌ שגיאה בטעינת התמונה
                  </div>
                </div>
              )}
              <div className="ad-info">
                <strong>עסק:</strong> {businesses[ad.business_id] || 'לא ידוע'}
              </div>
              <div className="ad-info">
                <strong>טקסט קצר:</strong> {ad.short_text}
              </div>
              <div className="ad-info">
                <strong>זמן תצוגה:</strong>
                <br />
                {formatDateTime(ad.start_time)} - {formatDateTime(ad.end_time)}
              </div>
              <div className="ad-info">
                <strong>מוצג כרגע:</strong> {isAdActive(ad) ? '✅ כן' : '❌ לא'}
              </div>
            </div>

            <div className="ad-actions">
              <button
                className={`btn-toggle ${ad.status === 'active' ? 'btn-disable' : 'btn-enable'}`}
                onClick={() => toggleStatus(ad.ad_id, ad.status)}
              >
                {ad.status === 'active' ? '⏸️ השבת' : '▶️ הפעל'}
              </button>
              <button
                className="btn-delete"
                onClick={() => deleteAd(ad.ad_id)}
              >
                🗑️ מחק
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdList;
