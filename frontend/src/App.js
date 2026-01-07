import React, { useState } from 'react';
import BusinessModal from './components/BusinessModal';
import AdvertisementModal from './components/AdvertisementModal';
import './App.css';

function App() {
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>CommunityCast</h1>
          <p className="subtitle">מערכת ניהול פרסומות למרכז מסחרי</p>
        </header>

        <div className="card">
          <h2>ניהול המערכת</h2>
          <p className="description">
            בחר את הפעולה הרצויה להוספת עסק חדש או פרסומת חדשה למערכת
          </p>
          
          <div className="button-container">
            <button 
              className="action-button business-button"
              onClick={() => setIsBusinessModalOpen(true)}
            >
              <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="button-text">הוסף עסק חדש</span>
              <span className="button-description">הוספת בעל עסק למערכת הניהול</span>
            </button>

            <button 
              className="action-button ad-button"
              onClick={() => setIsAdModalOpen(true)}
            >
              <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <span className="button-text">הוסף פרסומת חדשה</span>
              <span className="button-description">יצירת פרסומת עבור עסק קיים</span>
            </button>
          </div>
        </div>

        <footer className="footer">
          <p>© 2026 CommunityCast. All rights reserved.</p>
        </footer>
      </div>

      <BusinessModal 
        isOpen={isBusinessModalOpen} 
        onClose={() => setIsBusinessModalOpen(false)} 
      />
      
      <AdvertisementModal 
        isOpen={isAdModalOpen} 
        onClose={() => setIsAdModalOpen(false)} 
      />
    </div>
  );
}

export default App;
