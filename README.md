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
- - slider.css
- - style.css
- data/
- - images.json
- script/
- - script.js
- - slider.js
-  .gitignore
- Index.html
- README.md

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

- Include required files in your project:
- - Add the CSS files (css/slider.css and css/style.css) in the <head> of your HTML.
- - Load the JS files (script.js and slider.js) in the <body> or as ES modules depending on your setup.

- Prepare your HTML container:

Each slider container must have:

- - A unique id
- - The attribute data-slider

For example:
<div id="my-slider" data-slider></div>

You can add multiple sliders like this:
<div id="slider-one" data-slider></div>
<div id="slider-two" data-slider></div>

- Provide an image dataset

Create or customize your data/images.json file with this structure:

      [
        {
          "src": {
            "mobile": "img1-mobile.jpg",
            "tablet": "img1-tablet.jpg",
            "desktop": "img1-desktop.jpg"
          },
          "alt": "Image description"
        },
        ...
      ]

At least one valid image source (mobile, tablet, or desktop) is required per image.

- Initialize the sliders with JavaScript:

Make sure your main script imports the Slider class and targets all [data-slider] containers. Example:

      import { Slider } from './slider.js';

      async function fetchImagesData() {
        const response = await fetch('./data/images.json');
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return await response.json();
      }

      document.addEventListener('DOMContentLoaded', async () => {
        const images = await fetchImagesData();
        const sliderContainers = document.querySelectorAll('[data-slider]');

        sliderContainers.forEach((container, index) => {
          const sliderId = container.getAttribute('id') || `slider-${index}`;

          new Slider({
            containerSelector: `#${sliderId}`,
            images: images,
            config: {
              autoplay: true,
              duration: 4000,
              showArrows: true,
              showDots: true,
              animation: 'slide', // or 'fade'
              transition: 'transform 0.6s ease'
            }
          });
        });
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


## Changelog

- Added custom focus styles for arrows and dots (accessibility improvement).
- Ensured images inside <picture> are centered using modern layout.
- Now supports multiple sliders on the same page independently.