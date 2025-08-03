# Custom Vanilla JS Slider

A fast and responsive image slider built with plain JavaScript (no dependencies), featuring:
- Slide and fade animations
- Smart autoplay (pauses on hover, visibility, etc.)
- Mobile swipe and desktop drag
- Arrow and dot navigation
- Infinite looping
- Responsive images with <picture> support

## Features

- Autoplay (optional)
- Animation choice: slide or fade
- Customizable transition for slide mode
- Touch and mouse drag support
- Infinite looping between slides
- Responsive images for mobile, tablet, desktop
- Accessible: ARIA on controls and alt on images
- Configuration validation with sensible defaults
- Custom focus styling for arrows and navigation dots
- Centered images inside the <picture> tag
- Multiple sliders supported on the same page

## Project Files 

project-root/
- assets/
- css/
- - _slider.scss (source)
- - _variables.scss 
- - main.scss (source)
- - slider.css (compiled)
- - style.css
- data/
- - images.json
- script/
- - script.js (compiled)
- - slider.js (compiled)
- typescript/
- - script.ts (source)
- - slider.ts (source)
- .gitignore
- Index.html
- tsconfig.json
- package.json


## Files Description

- **assets**          → Static assets used in the project.
- **slider.scss**     → Source styles for the slider component (SCSS).
- **slider.css**      → Compiled styles from SCSS. Includes animations and layout.
- **style.css**       → General page styles (reset, layout, typography, etc.).
- **images.json**     → JSON file used to simulate image loading from an API. Defines `src` paths and optional `alt` text.
- **script.ts**       → Entry point that loads image data and initializes the slider.
- **slider.ts**       → Core logic of the slider, fully typed in TypeScript.
- **.gitignore**      → Defines untracked files and folders Git should ignore.
- **index.html**      → Main HTML file referencing styles and scripts.
- **README.md**       → Project documentation.
- **tsconfig.json**   → TypeScript configuration file.
- **package.json**    → Project metadata and scripts.


## Installation

Clone the repository:

```bash
git clone https://github.com/MiBonato/slider_legacy.git
```

Install dependencies:

```bash
npm install
```


## Usage

### Include Required Files

- Add the CSS files (`css/slider.css` and `css/style.css`) in the `<head>` of your HTML.
- Load the compiled JavaScript files (`script/script.js`) in the `<body>` as ES modules.

### HTML Container Structure

Each slider container must have:
- A unique `id`
- The attribute `data-slider`

Example:
```html
<div id="slider-one" data-slider></div>
<div id="slider-two" data-slider></div>
```

### Image Dataset Structure

Create or customize your `data/images.json` file like this:
```json
[
  {
    "src": {
      "mobile": "img1-mobile.jpg",
      "tablet": "img1-tablet.jpg",
      "desktop": "img1-desktop.jpg"
    },
    "alt": "Image description"
  }
]
```
At least one valid image source is required per image.

### JavaScript Initialization Example

```ts
import { Slider } from './slider.js';

async function fetchImagesData() {
  const response = await fetch('./data/images.json');
  if (!response.ok) throw new Error(`HTTP error ${response.status}`);
  return await response.json();
}

document.addEventListener('DOMContentLoaded', async () => {
  const images = await fetchImagesData();
  const sliderId = document.getElementById('CS')?.id;
  if (!sliderId) return;

  new Slider({
    containerSelector: `#${sliderId}`,
    images,
    config: {
      autoplay: true,
      duration: 4000,
      showArrows: true,
      showDots: true,
      animation: 'slide',
      transition: 'transform 0.6s ease'
    }
  });
});
```


## Configuration Options

| Key          | Type    | Default                        | Description                              |
| ------------ | ------- | ------------------------------ | ---------------------------------------- |
| `autoplay`   | boolean | `true`                         | Enables or disables autoplay             |
| `duration`   | number  | `4500`                         | Time between slides (in ms)              |
| `showArrows` | boolean | `true`                         | Show left/right navigation arrows        |
| `showDots`   | boolean | `true`                         | Display navigation dots below the slider |
| `animation`  | string  | `'slide'`                      | `'slide'` or `'fade'`                    |
| `transition` | string  | `'transform 0.5s ease-in-out'` | CSS transition for the animation         |



## Build & Development Setup

This project uses **TypeScript** and **SCSS**.

### 📦 Install
```bash
npm install
```

### 🛠 Development Commands

To compile TypeScript files:
```bash
npm run build
```

To compile SCSS manually:
```bash
npx sass css/slider.scss css/slider.css
```

To serve locally with auto-reload:
```bash
npm run start
```

This uses `live-server` to open the project at `http://localhost:8080/` or similar.

### 🧾 Project Structure Summary

- All `.ts` files are in `typescript/` → compiled into `script/`
- All `.scss` files are in `css/` → compiled into `.css`
- Output files (`.js`, `.css.map`) are ignored by Git

### 🔐 Security Note

This project includes `live-server` as a dev dependency. Some known vulnerabilities may appear via `npm audit`, but this project is intended for local development only.


## Changelog

- Converted core logic to TypeScript.
- Integrated SCSS with manual compilation.
- Added custom focus styles for arrows and dots (accessibility improvement).
- Ensured images inside <picture> are centered using modern layout.
- Now supports multiple sliders on the same page independently.