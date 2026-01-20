# Data Models for CommunityCast

This document defines the data models for the CommunityCast platform, based on the Architectural Decision Record.

## 6. Business Entity Definitions (Data Models)

The following defines the information stored in the system for each of the main entities:

### 6.1 Entity: Business

The entity representing a store or stall in the shopping center.

*   `business_id`: Unique identifier in the system.
*   `business_code`: Access code (Token) used by the business owner for authentication.
*   `name`: Business name as it will appear in the management system.
*   `contact_info`: Basic contact details.

### 6.2 Entity: Advertisement

The entity containing the marketing content and display logic.

*   `ad_id`: Unique identifier for the advertisement.
*   `business_id`: Reference to the Business entity.
*   `title`: Advertisement title (e.g., "End of Season Sale").
*   `image_path`: Path to the image file stored on the server.
*   `start_time`: Date and time when advertising begins.
*   `end_time`: Date and time when advertising ends.
*   `stop_time`: Actual date and time when advertising ceased (e.g., if manually stopped).
