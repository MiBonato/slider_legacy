import { Slider } from './slider.js';

async function fetchImagesData() {
  try {
    const response = await fetch('./data/images.json');
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Fetch error :", err);
    return [];
  }
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
        animation: 'slide',
        transition: 'transform 0.6s ease'
      }
    });
  });
});
