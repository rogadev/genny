# Genny

This project was designed to create a simplified version of a chat agent that answers questions, unlike Apple Siri or Google Assistant. Toward the end of the project, the ChatGPT app was released, making this solution somewhat obsolete. Additionally, changes to the API key process have affected the functionality. However, the project remains a demonstration of my ability to quickly develop a solution within a day.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Environment Variables](#environment-variables)

## Installation

To install the project, follow these steps:

```bash

# Clone the repository

git clone https://github.com/yourusername/genny.git

# Navigate into the project directory

cd genny

# Install the dependencies

pnpm install
```

Make sure you have [pnpm](https://pnpm.io/) installed before proceeding.

## Usage

To start the development server, use the following command:

```bash
pnpm dev
```

For building the project, you can run:

```bash
pnpm build
```

To generate a static version of the site:

```bash
pnpm generate
```

To preview the built site:

```bash
pnpm preview
```

## Scripts

The following scripts are defined in `package.json`:

- `pnpm build`: Builds the project for production.
- `pnpm dev`: Starts the development server.
- `pnpm generate`: Generates a static version of the project.
- `pnpm preview`: Previews the built site.
- `pnpm postinstall`: Prepares the Nuxt environment after dependencies are installed.

## Dependencies

The project uses the following dependencies:

- **@nuxtjs/tailwindcss**: A Nuxt module to use Tailwind CSS.
- **@tailwindcss/typography**: Adds typography utilities to Tailwind CSS.
- **nuxt**: A framework for building Vue.js applications.
- **nuxt-icon**: A Nuxt module for handling icons.
- **daisyui**: A plugin for Tailwind CSS that provides pre-built UI components.
- **openai**: The official OpenAI package to interact with their API.
- **theme-change**: A small utility to dynamically change themes.
- **zod**: A TypeScript-first schema declaration and validation library.

## Environment Variables

To configure the project, you'll need to set up the following environment variables in a `.env` file:

```bash

# OpenAI API key for accessing GPT models

OPENAI_API_KEY=your-openai-api-key

# Base URL for API calls

BASE_API_URL=https://your-api-url.com
```

Make sure to replace the placeholders with actual values.
