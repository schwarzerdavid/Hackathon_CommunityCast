# CommunityCast Frontend

This is the React frontend for the CommunityCast advertising management system.

## Features

- **Business Management**: Add new businesses to the system with authentication tokens
- **Advertisement Management**: Create and manage advertisements for businesses
- **Responsive Design**: Works on desktop and mobile devices
- **RTL Support**: Fully supports right-to-left Hebrew text

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── BusinessModal.js          # Business creation modal
│   │   ├── BusinessModal.css
│   │   ├── AdvertisementModal.js     # Advertisement creation modal
│   │   └── AdvertisementModal.css
│   ├── App.js                        # Main application component
│   ├── App.css
│   ├── index.js                      # Application entry point
│   └── index.css
└── package.json
```

## Data Models

### Business Entity
- `business_id`: Unique identifier (auto-generated)
- `business_code`: Access token for business owner authentication
- `name`: Business name
- `contact_info`: Contact details

### Advertisement Entity
- `ad_id`: Unique identifier (auto-generated)
- `business_id`: Reference to business
- `title`: Advertisement title
- `image_path`: Path to advertisement image
- `start_time`: Advertisement start date/time
- `end_time`: Advertisement end date/time
- `stop_time`: Actual stop date/time (if manually stopped)

## Backend Integration

The application is configured to send data to the following endpoints:
- `POST /api/businesses` - Create new business
- `POST /api/advertisements` - Create new advertisement

Make sure to implement these endpoints in your MongoDB backend.

## Technologies Used

- React 18
- Axios for HTTP requests
- CSS3 with modern features (Grid, Flexbox, Animations)
- RTL (Right-to-Left) support for Hebrew

## Future Enhancements

- File upload functionality for advertisement images
- Business selection dropdown for advertisements
- Data validation improvements
- Success/error notifications
- List views for businesses and advertisements
- Edit and delete functionality
