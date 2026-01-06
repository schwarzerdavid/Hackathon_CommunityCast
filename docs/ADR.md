# Architectural Decision Record: CommunityCast

## 1. Introduction
This document outlines the requirements and technical specification for the MVP (Minimum Viable Product) of the CommunityCast platform. The product aims to enable small and medium-sized business owners in shopping centers to independently, quickly, and affordably purchase and manage digital advertising spaces at Point of Sale. This document defines the capabilities required for the initial Proof of Concept (PoC) of the system.

## 2. Business Requirement
Currently, advertising on digital signage in shopping centers is considered a "premium product," mainly accessible to large chains with annual advertising budgets. Small business owners within the center (e.g., food stalls, boutique shops, service providers) are left without an effective marketing tool to convey real-time messages to customers already physically present in the complex.

Furthermore, there is a timing gap: a business owner often needs "here and now" advertising (e.g., a flash sale to clear inventory in the last hour of the day, or promoting a specific product during peak hours). The current model of signage companies does not allow for such flexibility. CommunityCast solves these problems by creating a digital Marketplace that makes screens accessible to every store owner, generates additional revenue for the center owner from a "long tail" of advertisers, and improves the shopping experience for customers through exposure to relevant and immediate offers.

## 3. Processes (Use Cases) and Functional Requirements
*(Detailed functional requirements are further elaborated in `functional_requirements.md`)*

## 4. Non-Functional Requirements
**TBD:** This section will cover items potentially relevant for the PoC or future phases.
Examples include:
*   Authentication and Authorization processes are not fully defined.
*   Error Management.
*   Considerations for Scale, etc.

## 5. Technical Specification

### 5.1 High Level Component Diagram
The system consists of the following components:
*   **Frontend:** Serves the shopping center manager and business owners.
*   **API:** Serves the UI.
*   **Persistence layer:** Stores all advertisements.
*   **NoviSign:** An external system responsible for the design and broadcasting of the screens themselves.

### 5.2 Design Decisions

*   **Database (Persistence Layer): MongoDB.**
    *   **Decision:** Using NoSQL allows maximum flexibility in changing advertisement fields (schema-less) during PoC development.
*   **File Management: Local File System.**
    *   **Decision:** Physically storing files on the API server and registering the path in the DB.
    *   **Rationale:** A quick solution that saves time on cloud infrastructure setup. In a production system, files will be stored in Object Storage (e.g., AWS S3) for durability and scale.
*   **Communication with Signage System: Direct API Integration (Simplified for PoC).**
    *   **Decision:** The API will perform direct and synchronous HTTP calls to NoviSign for every end-user action.
    *   **Future Roadmap:** In a real system, communication will be asynchronous (Pub/Sub). A notification about a new advertisement will be sent to a queue, undergo validation and optimization processes (e.g., image compression), and only then be approved for dispatch. Additionally, a dedicated Scheduler Service will be established to manage complex timings and communication with NoviSign, decoupled from the user-facing API.

## 6. Business Entity Definitions (Data Models)
*(Detailed data models are further elaborated in `data_models.md`)*

## 7. System Processes (Flows)
*(Detailed system flows are further elaborated in `functional_requirements.md`)*

## 8. Open Questions
1.  Is it possible to define schedules within NoviSign itself, or is scheduling done only by the server?
2.  What will the exact timing be? One option: each screen for about 10 seconds.
3.  What happens if there are more advertisements than space on the centralized board view?
