# peachismomo.github.io

Personal portfolio site built with **React 19**, **TypeScript**, **Vite**, and **Material UI**.

This site showcases my work in:

- C++ engine & tooling development  
- Rendering and graphics systems  
- Game / engine architecture (ECS, animation, serialization)  
- Full-stack development  

It also dynamically pulls featured projects from GitHub and renders their READMEs directly on the site.

---

## Tech Stack

- React 19
- TypeScript
- Vite
- Material UI (MUI)
- Emotion (styling engine)
- React Markdown + GFM

---

## Development

This project runs on Windows, macOS, and Linux.

### Prerequisites

- Node.js 24+ (see .nvmrc)
- npm (bundled with Node)

You can install Node in one of these ways:

#### Using Node Version Manager

Using a version manager keeps your environment clean and consistent.

**macOS / Linux (nvm):**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install
nvm use
```

**Windows (nvm-windows):**
Download and install from:
https://github.com/coreybutler/nvm-windows/releases

Then in a new terminal:

```bash
nvm install 24.13.0
nvm use 24.13.0
```

**Verify your setup:**
```bash
node -v
npm -v
```

You should see the Node and npm installed.

### Setup

If you haven't already, clone the repository and install the dependencies:

**Clone and install**
```bash
git clone https://github.com/peachismomo/peachismomo.github.io.git
cd peachismomo.github.io
npm install
```

### Run (Local Development)

**Start the local dev server**
```bash
npm run dev
```

You should be able to run the website on http:://localhost:5173

Vite supports hot module reload, so changes update instantly.

### Build Production

The repository has been setup to deploy to github pages on push via github actions.

**To create a production build locally**
```bash
npm run build
```

The production output will be generated in the dist/ directory.

**You can preview the production build locally**
```bash
npm run preview
```