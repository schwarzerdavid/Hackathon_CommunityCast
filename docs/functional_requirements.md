# Functional Requirements for CommunityCast

This document details the functional requirements and use cases for the CommunityCast platform, based on the Architectural Decision Record.

## 3. Processes (Use Cases) and Functional Requirements

### 3.1 Shopping Center Administrator (Admin/Provider)

*   **Business Management (Onboarding):** Ability to create a new business in the system and issue a unique identification code for the business owner.
*   **Business Removal:** Ability to delete or disable a business from the system (thereby stopping all its advertisements).
*   **Activity Report (Logging):** Receive a consolidated list of all advertisements displayed, including calculating the cumulative duration for which each advertisement was actually active (for financial billing).

### 3.2 Business Owner (The Merchant)

*   **Authentication:** Login to the management system using the unique code received from the center administrator.
*   **Advertisement Creation:** Upload marketing content including: title, concise text, detailed advertisement text, and an image.
*   **Campaign Scheduling:** Define a precise time window for display (start date and time, end date and time).
*   **Advertisement Inventory Management:** Ability to manually take down/stop an existing advertisement before the defined time expires.

### 3.3 Display Screen System

*   **Filtering and Validation:** Display only advertisements that meet the time conditions (Active & In-range).
*   **"Board View" Display:** Display a synoptic list of all currently active promotions (Business Name + concise text).
*   **"Spotlight View" Display:** Cyclical transition between active advertisements in full-screen display (title, full text, image).
*   **Animation Management:** Smooth and automatic transition between the two display modes.

## 7. System Processes (Flows)

### 7.1 Business Management (Center Administrator)
**Goal:** Establish infrastructure for a new business in the complex.
*   **Input:** `business_name`, `contact_info`.
*   **Output:** `business_id`.

### 7.2 Update Business Details (Business Owner)
**Goal:** Update business contact details in the system.
*   **Input:** `business_id`, `contact_details`.
*   **Output:** `success_status`.

### 7.3 Retrieve Identification Code (Business Owner)
**Goal:** View the identification code (Token) used to securely upload advertisements.
*   **Input:** `business_id`.
*   **Output:** `business_code`.

### 7.4 Generate Activity Report (Center Administrator)
**Goal:** Obtain detailed data on actual advertising times for monitoring and billing a specific business.
*   **Input:** `business_id`, `start_date`, `end_date`.
*   **Output:** Ad List (details of each advertisement), Active Duration per Ad, Total Active Time (cumulative time for the business in the selected period).
*   **Possible Extensions:** Export the report to an Excel or PDF file for sending as a detailed appendix to the business owner's invoice.

### 7.5 Create New Advertisement (Business Owner)
**Goal:** Upload advertising content to the system and update NoviSign screens.
*   **Input:** `business_code`, `title`, `short_text`, `promo_text`, `image_file`, `start_time`, `end_time`.
*   **Output:** `ad_id`, `success_status`.
*   **Possible Extensions:**
    1.  Instead of a single creation process and a single take-down process, an advertisement could be created in a draft status, allowing the business owner to upload and take it down, while the system records all times the advertisement was active.
    2.  Validation: Check image resolution and validate content (check for prohibited words or inappropriate content).
    3.  Generative AI: Implement AI tools (like GPT-5 or Nano Banana) that allow the business owner to describe the promotion in free text, and the system automatically generates a marketing title, call-to-action text, and a matching high-quality image.

### 7.6 Remove/Stop Advertisement (Business Owner)
**Goal:** Immediately stop advertising.
*   **Input:** `business_code`, `ad_id`.
*   **Output:** `status`, `stop_time`.

### 7.7 Screen Display - Board View and Rotation
**Goal:** Manage display on the large screen according to timings and animation settings.
