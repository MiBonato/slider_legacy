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

## Project Files 

project-root/
├── assets/
├── css/
│   ├── slider.css
│   └── style.css
├── data/
│   └── images.json
├── script/
│    ├── script.js
│    └── slider.js
├── .gitignore
├── Index.html
└── README.md

## Files Description

- assets          → Static assets used in the project.
- slider.css      → Contains specific styles for the slider component, including animations and layout.
- style.css       → General styles for the HTML page (reset, layout, typography, etc.).
- images.json     → Example JSON file used to simulate image loading from an API. Defines `src` paths and optional `alt` text for responsive images.
- script.js       → Entry script for initializing the slider. Handles configuration loading and setup logic.
- slider.js       → Core logic of the slider module. Contains all the slider functionality (animation, autoplay, swipe, navigation, etc.).
- .gitignore      → Defines untracked files and folders Git should ignore (e.g., node_modules, build folders, .env, etc.).
- Index.html      → Main HTML file that includes references to styles and scripts. It contains the container element used to generate the slider.
- README.md       → Project documentation file. Explains how to set up, configure, and use the slider.


## Installation

- Clone the repository:

git clone https://github.com/MiBonato/slider_legacy.git

- Add the script (slider.js) and style files (slider.css) into your project and load them in your header/footer.
- get your ressources with your prefered method ( see ## Image Format)
- call createSlider with your parameters

createSlider({
  containerSelector: '#YourId',
  images: images,
  config: {
    autoplay: true,
    duration: 4500,
    showArrows: true,
    showDots: true,
    animation: 'slide', // or 'fade'
    transition: 'transform 0.5s ease-in-out'
  }
});

## Configuration Options

| Key          | Type    | Default                        | Description                              |
| ------------ | ------- | ------------------------------ | ---------------------------------------- |
| `autoplay`   | boolean | `true`                         | Enables or disables autoplay             |
| `duration`   | number  | `4500`                         | Time between slides (in ms)              |
| `showArrows` | boolean | `true`                         | Show left/right navigation arrows        |
| `showDots`   | boolean | `true`                         | Display navigation dots below the slider |
| `animation`  | string  | `'slide'`                      | `'slide'` or `'fade'`                    |
| `transition` | string  | `'transform 0.5s ease-in-out'` | CSS transition for the animation         |

## Image Format
Each image object should follow this format:

{
  "src": {
    "mobile": "mobile-image.jpg",
    "tablet": "tablet-image.jpg",
    "desktop": "desktop-image.jpg"
  },
  "alt": "Image description"
}

You can omit tablet or desktop if not needed. At least one valid image is required.
