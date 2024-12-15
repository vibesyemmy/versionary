# Versionary

A Figma plugin for structured version management of design files.

## Features

- Capture detailed snapshots of your Figma files
- Tag versions by feature or sprint
- Visual comparison between versions
- Generate shareable changelogs

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm

### Setup

1. Clone the repository
```bash
git clone [your-repo-url]
cd versionary
```

2. Install dependencies
```bash
npm install
```

3. Build the plugin
```bash
npm run build
```

4. Start development mode
```bash
npm run dev
```

### Installing in Figma

1. Open Figma
2. Go to Plugins > Development > Import plugin from manifest
3. Select the `manifest.json` file from this project

## Project Structure

```
versionary/
├── src/               # Source files
│   ├── code.ts       # Plugin main script
│   └── ui.html       # Plugin UI
├── dist/             # Compiled files
├── package.json      # Dependencies and scripts
└── manifest.json     # Plugin manifest
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
