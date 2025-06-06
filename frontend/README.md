# VoyageIQ Frontend

This is the frontend application for the VoyageIQ travel booking platform built with React, Vite, and TailwindCSS.

## Features

- Modern React application with functional components and hooks
- Fast development and build with Vite
- Responsive UI with TailwindCSS
- Form validation with Joi
- API integrations with Axios
- State management with React Context
- Route management with React Router
- AI Trip Generator using Google's Generative AI

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository
2. Navigate to the frontend directory:

```bash
cd frontend
```

3. Install dependencies:

```bash
npm install
```

4. Copy the environment variables example file and update it with your values:

```bash
cp .env.example .env
```

### Development

Start the development server:

```bash
npm run dev
```

For development with host accessibility (to test on other devices):

```bash
npm run host
```

### Production Build

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

- `src/assets` - Static assets like images
- `src/components` - Reusable UI components
- `src/config` - Application configuration
- `src/contexts` - React contexts for state management
- `src/hooks` - Custom React hooks
- `src/pages` - Page components corresponding to routes
- `src/router` - Routing configuration
- `src/services` - API services and integrations
- `src/utils` - Utility functions and helpers

## Component Style Guide

- Use functional components with hooks
- Use named exports for components
- Keep components focused on a single responsibility
- Use proper prop validation with PropTypes
- Follow the pattern:

```jsx
import React from "react";
import PropTypes from "prop-types";
import "./ComponentName.css"; // If using CSS modules

const ComponentName = ({ prop1, prop2 }) => {
  // Component logic

  return <div className="component-name">{/* Component JSX */}</div>;
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};

ComponentName.defaultProps = {
  prop2: 0,
};

export default ComponentName;
```

## Available Scripts

- `dev` - Start the development server
- `build` - Build for production
- `preview` - Preview production build
- `host` - Start dev server with host accessibility
