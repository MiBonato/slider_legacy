import { Slider, ImageData } from './slider.js';

async function fetchImagesData(): Promise<ImageData[]> {
  try {
    const response = await fetch('./data/images.json');
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data: ImageData[] = await response.json();
    return data;
  } catch (err) {
    console.error("Fetch error :", err);
    return [];
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const images = await fetchImagesData();
  const sliderEl = document.getElementById('CS');
  if (!sliderEl) return;

  new Slider({
    containerSelector: `#${sliderEl.id}`,
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
