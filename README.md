# EduBot Playground

This is a React-based web application that serves as a playground for the Gemini API. It provides a user-friendly interface to interact with the Gemini models, allowing users to have a conversation with the AI.

## Features

-   **API Key Authentication:** Users need to provide their Gemini API key to start using the application.
-   **Chat Interface:** A simple and intuitive chat interface to send and receive messages from the Gemini model.
-   **Custom System Prompt:** Users can define a system prompt to set the context for the conversation.
-   **Model Selection:** Users can choose between different Gemini models (e.g., Gemini 2.5 Flash, Gemini Pro).
-   **Adjustable Parameters:** Users can tweak parameters like temperature and Top P to control the model's output.
-   **Error Handling:** The application handles API errors gracefully and provides feedback to the user.
-   **Responsive Design:** The application is designed to work on different screen sizes.

## Tech Stack

-   **Frontend:** React.js
-   **Styling:** Tailwind CSS
-   **API:** Gemini API

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/edubot-playground.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd edubot-playground
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

## Usage

1.  Start the development server:
    ```bash
    npm start
    ```
2.  Open your browser and go to `http://localhost:3000`.
3.  Enter your Gemini API key to start the chat.

## Available Scripts

In the project directory, you can run:

-   `npm start`: Runs the app in the development mode.
-   `npm test`: Launches the test runner in the interactive watch mode.
-   `npm run build`: Builds the app for production to the `build` folder.
-   `npm run eject`: Removes the single dependency and copies all the configuration files and transitive dependencies (webpack, Babel, ESLint, etc.) right into your project.

## Dependencies

-   `react`: A JavaScript library for building user interfaces.
-   `react-dom`: Serves as the entry point to the DOM and server renderers for React.
-   `react-scripts`: Provides scripts and configurations for Create React App.
-   `tailwindcss`: A utility-first CSS framework for rapid UI development.
-   `postcss`: A tool for transforming CSS with JavaScript.
-   `autoprefixer`: A PostCSS plugin to parse CSS and add vendor prefixes to CSS rules.
