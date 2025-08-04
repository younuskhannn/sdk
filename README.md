# AI Terminal App

A Vue.js 3 web-based AI terminal application that allows progressive building of features through AI-powered commands. Built with the Composition API and modern web technologies.

> **Concept**: An AI Application that builds itself through progressive commands and feature generation.

## Features

- **Interactive Terminal Interface**: Full-featured terminal using xterm.js
- **AI-Powered Commands**: Execute commands to progressively build application features
- **Modern Tech Stack**: Vue.js 3, Composition API, Pinia, Tailwind CSS, PrimeVue
- **Extensible Architecture**: Clean, modular structure for easy feature additions
- **Responsive Design**: Works on desktop and mobile devices
- **Command History**: Navigate command history with arrow keys
- **Real-time Processing**: Visual feedback for command execution

## Tech Stack

- **Framework**: Vue.js 3 with Composition API (`<script setup>`)
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **UI Components**: PrimeVue
- **Terminal**: xterm.js
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Code Quality**: ESLint

## Project Structure

```
src/
├── components/
│   ├── buttons/           # Reusable button components
│   ├── modals/           # Modal components
│   ├── layout/           # Layout components (header, footer, etc.)
│   └── terminal/         # Terminal-related components
├── stores/               # Pinia stores
├── services/             # API services and utilities
├── views/                # Page components
├── router/               # Vue Router configuration
└── assets/               # Static assets and styles
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/younuskhannn/sdk.git
cd sdk
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

## Available Commands

### Built-in Terminal Commands

- `help` - Show available commands
- `clear` - Clear terminal history  
- `history` - Show command history
- `status` - Show application status
- `about` - About this application

### AI Commands (Future Implementation)

- `build` - Build application features
- `generate` - Generate components
- `deploy` - Deploy application

## Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

## Architecture

### State Management

The application uses Pinia for state management with a modular approach:

- `terminal.js` - Terminal state, command history, and execution logic

### API Integration

Ready for AI API integration with structured service layer:

- `api.js` - Axios client with interceptors
- `aiService` - AI command processing endpoints
- `appService` - Application management endpoints  
- `fileService` - File management endpoints

### Component Organization

Components are organized by functionality:

- **Layout**: Header, footer, main layout structure
- **Terminal**: xterm.js integration and terminal UI
- **Buttons**: Reusable button components
- **Modals**: Dialog and modal components

## Customization

### Terminal Theme

Customize the terminal appearance in `src/assets/main.css`:

```css
.terminal-container {
  --terminal-bg: #0f172a;
  --terminal-text: #e2e8f0;
  --terminal-green: #10b981;
}
```

### Tailwind Configuration

Extend Tailwind configuration in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      terminal: {
        // Custom terminal colors
      }
    }
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Roadmap

- [ ] AI API integration
- [ ] Component generation system
- [ ] File management interface
- [ ] Theme customization
- [ ] Mobile app version
- [ ] Desktop app version
- [ ] Plugin system
- [ ] Advanced terminal features

## License

This project is licensed under the ISC License.

## Support

For support, please open an issue in the repository or contact the development team.
