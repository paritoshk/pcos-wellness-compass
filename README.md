# PCOS Wellness Compass

## 💖 Your Companion for Navigating PCOS Wellness

PCOS Wellness Compass is a web application designed to support individuals with Polycystic Ovary Syndrome (PCOS) by providing tools and information to manage their health and wellness journey. This application aims to offer features like food analysis, insightful chat, and personalized tracking.

## ✨ Features

*   **Informative Content:** Access to curated information about PCOS.
*   **Symptom Tracker (Planned):** Log and monitor symptoms over time.
*   **Food Journal & Analysis (In Progress):**
    *   Log meals and analyze their nutritional content.
    *   Image-based food recognition for quick logging.
*   **AI-Powered Chat (Planned):** Get answers to common PCOS questions and receive support.
*   **Personalized Insights (Planned):** Receive insights based on tracked data.
*   **User Accounts & History (Planned):** Securely store your data, chat history, and analysis results with Auth0 and Supabase integration.

## 🛠️ Tech Stack

This project is built with modern web technologies:

*   **Frontend:** React, Vite, TypeScript
*   **UI Components:** shadcn-ui
*   **Styling:** Tailwind CSS
*   **Package Manager:** pnpm
*   **Deployment:** Vercel (primarily), Lovable

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [pnpm](https://pnpm.io/installation) (This project uses `pnpm` for package management)

## 🚀 Getting Started

Follow these steps to set up and run the project locally:

1.  **Clone the Repository:**
    ```sh
    git clone <YOUR_GIT_URL> # Replace <YOUR_GIT_URL> with the actual URL of this repository
    ```

2.  **Navigate to the Project Directory:**
    ```sh
    cd pcos-wellness-compass # Or your project's directory name
    ```

3.  **Install Dependencies:**
    ```sh
    pnpm install
    ```

4.  **Environment Variables:**
    Create a `.env` file in the root of the project by copying from `.env.example` (if one exists). Populate it with necessary API keys and configuration values.
    *Initially, this might not be strictly necessary for basic UI rendering but will be crucial for features like Auth0, Supabase, and any external APIs.*

5.  **Start the Development Server:**
    ```sh
    pnpm run dev
    ```
    This will start the development server, typically at `http://localhost:5173`, with auto-reloading and an instant preview.

## ✅ Running Tests

To run automated tests (if configured):

```sh
pnpm run test # Or the specific test command defined in package.json
```
*(Note: Test scripts and configurations might need to be set up if not already present.)*

## ☁️ Deployment

This project is configured for deployment on Vercel. Refer to `vercel.json` and `DEPLOYMENT.md` for more details on the Vercel deployment setup.

Alternatively, deployment can also be managed via [Lovable](https://lovable.dev/projects/f97ada70-9d2d-4f71-911c-3427c88a81cd) by clicking on Share -> Publish.

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/YourFeature`).
6.  Open a Pull Request.

Please ensure your code adheres to the project's linting rules and includes tests where applicable.

## 🎯 Future Goals

*   Full integration of Auth0 for secure authentication.
*   Supabase integration for database (user profiles, chat history, food logs, analysis results) and storage (user-uploaded images).
*   Enhanced mobile optimization and PWA capabilities.

## 📄 License

*(Specify your license here, e.g., MIT License. If no license is chosen, consider adding one.)*

---

*This README was last updated by an AI assistant.*
    