# CommunityCast

## Project Overview

CommunityCast is a digital marketplace platform designed to empower small and medium-sized businesses within shopping centers to independently, quickly, and affordably manage digital advertising space on Point-of-Sale (PoS) screens. The primary goal is to provide an effective marketing tool for businesses to convey real-time messages to customers already present in the shopping complex, addressing the current limitations of traditional digital signage advertising.

## Key Components

*   **Frontend:** User interface for both shopping center administrators and business owners to manage their advertising campaigns and settings.
*   **API:** Backend service that handles business logic, data management, and communication with the NoviSign system.
*   **Persistence Layer:** Data storage for all advertisements, business information, and other system data. Utilizing MongoDB for flexibility during the PoC phase.
*   **NoviSign Integration:** External system responsible for the actual display, design, and broadcasting of content to the digital screens. Communication is handled via direct HTTP API calls for the Proof of Concept (PoC).

## Setup and Development

Further details on setup, development, and architecture can be found in the `docs/` directory.
