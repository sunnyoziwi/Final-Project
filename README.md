# 🎤 Project: Web Interview Recorder (Per-Question Upload)

## Introduction


This project implements a secure and reliable client-server application for conducting remote, structured interviews. Developed by a team of four students over five weeks, the application's core feature is the per-question upload mechanism. This design choice directly addresses the primary challenge of network instability by minimizing potential data loss—if a network error occurs, only the current question's video is at risk, not the entire session. The system serves as a practical exercise in applying computer networking principles over HTTP/HTTPS communication.

---

## 1. Project Overview

This project implements a secure and reliable client-server application for conducting structured, remote interviews. Developed by a team over five weeks, the application is a practical exercise in Network and Communication Technology principles.

The core technical feature is the per-question upload mechanism. This design directly mitigates the primary challenge of network instability by isolating data risk—if an error occurs, only the current question's video segment is jeopardized, not the entire session. The system operates over **HTTP/HTTPS**.

### 1.1. Key Technical Objectives
The project addresses the following learning objectives:
* Utilizing the **Media Devices.getUserMedia** API for camera/microphone access.
* Designing a sequential UI for a maximum of **5 questions**.
* Managing the session using the four mandatory API endpoints: **verify-token**, **session/start**, **upload-one**, and **session/finish**.
* Implementing network error handling via retry with exponential backoff.

-----

## 2. System Architecture and Networking

### 2.1. Client-Server Architecture

The architecture adheres to a strict **Client-Server model**.

* **Client (Frontend):**
    * **Media Management:** Utilizes the `Media Devices.getUserMedia` API to request and manage camera/microphone access.
    * **State Management:** Controls the sequential User Interface (UI), ensuring only one question (maximum five total) is displayed at a time.
    * **Reliability Layer:** Manages the **retry logic**, implements the **Exponential Backoff policy**, and displays clear upload statuses.
* **Server (Backend):**
    * **Security Gateway:** Enforces **token validation** and **sanitization** of user input.
    * **Data Persistence:** Handles file storage, organizes the unique folder structure, and updates metadata incrementally.
    * **Audit Trail:** Maintains robust logs with **ISO 8601 timestamps** and the mandated **Asia/Bangkok timezone**.

### 2.2. Mandatory Session Flow

The operational flow is strictly sequential and relies on explicit API calls for state transitions: 

1.  **Start:** User provides **Token/Name** $\to$ Server-side validation (`verify-token`) $\to$ Media permission $\to$ **Session Initialization** (`session/start`) which creates the dedicated server folder.
2.  **Per-Question Cycle:** The user presses **Next** $\to$ Recording stops $\to$ **Immediate Upload** (`upload-one`).
3.  **Progression Control (Crucial):** The client **must not** proceed to the next question ($i+1$) until the upload for question $i$ is confirmed as successful.
4.  **Finish:** User presses **Finish** $\to$ **Session Closure** (`session/finish`), which finalizes the metadata and ensures no further uploads are possible.

---

## 3. API Contract and Data Handling

### 3.1. Required API Endpoints

The following four APIs form the backbone of the client-server communication:

| Endpoint | Method | Role | Input (Body/Fields) | Success Response |
| :--- | :---: | :--- | :--- | :--- |
| `/api/verify-token` | **POST** | Authentication | `{token}` | `{ok: true}` (or 401 status) |
| `/api/session/start` | **POST** | Session Control | `{token, userName}` | `{ok: true, folder: "..."}` |
| `/api/upload-one` | **POST** | Data Transfer | `token, folder, questionIndex, video` (multipart/form-data) | `{ok: true, savedAs: "Q<index>.webm"}` |
| `/api/session/finish` | **POST** | Finalization | `{token, folder, questionsCount}` | `{ok: true}` |

### 3.2. Data Structure and Naming Convention

* **Folder Structure:** The server must create a unique folder named by time and user: `DD_MM_YYYY_HH_mm_ten_user/`.
    * **Timezone:** All server time operations and logging must adhere to the **Asia/Bangkok timezone**.
* **File Naming:** Video files are named sequentially (`Q1.webm`, `Q2.webm`, etc.).
* **Metadata (`meta.json`):** This file is updated after each `upload-one` and **finalized at** `session/finish`. It must include critical information for auditing: `userName`, `uploadedAt` (ISO 8601), `timeZone`, and the `list of received questions`.

-------


## 4. Reliability and Error Handling

### 4.1. Network Retry Policy

The system is engineered to handle network instability by implementing a dedicated retry mechanism for the most critical action: `/api/upload-one`.

* **Mechanism:** Retry with **Exponential Backoff** must be implemented for the **/api/upload-one call**.
* **Requirement:** Must attempt to retry the upload at least **two to three times**.
* **User Feedback:** The client must clearly display the status (`uploading`, `retry`, `success`) and provide a **manual Retry button**.

### 4.2. Security and Constraints

* **HTTPS Requirement:** **HTTPS is mandatory** for public deployment to enable camera/microphone access.
* **Token Validation:** Validation is strictly **server-side**; client-side checks are only advisory.
* **Input Sanitization:** The candidate name must be **sanitized** before being used to create the folder name, mitigating filesystem safety risks.
* **Limits:** The State size limits and accepted MIME types (e.g., `video/webm`) must be clearly documented and enforced.

---

## 5. Implementation and Deployment

### 5.1. Run Instructions

1.  **Prerequisites:** [Specify required runtime environments, e.g., **Node.js v18+, Docker**].
2.  **Clone:** `git clone [[repository-link](https://github.com/sunnyoziwi/Final-Project.git)]`
3.  **Install Dependencies:**
    ```bash
    npm install --prefix client && npm install --prefix server.
    ```
4.  **Configuration:** Configure environment variables (e.g., `.env` files) for the server, including API keys and token lists.
5.  **Start Services:**
    **terminal 1 
      cd client 
      npm install 
      npm run build**

      **terminal 2
      cd sercer
      npm insrall
      npm start**

      **terminal 3
      cd client 
      .\ngrok http 5000**
6.  **Access:** Navigate to **[Client URL]**. We recommend using `https://localhost` during development, or a service like **Ngrok** for testing public HTTPS requirements.

### 5.2. Bonus Feature (Optional)

The system includes a component for the **Speech-to-Text (STT)** feature.

* **Functionality:** Generates a text transcript for each question.
* **Deliverable:** `transcript.txt`.
* **Requirement:** The transcript must be **labeled per question** to link it to the corresponding video segment.
  
