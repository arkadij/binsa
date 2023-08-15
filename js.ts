interface GalleryImageData {
  link: string;
  src: string;
  alt: string;
}

function createGalleryItem(imageData: GalleryImageData): HTMLAnchorElement {
  const link = document.createElement("a");
  link.href = imageData.link;
  link.target = "_blank";
  link.classList.add("gallery__link");

  const figure = document.createElement("figure");
  figure.classList.add("gallery__thumb");

  const img = document.createElement("img");
  img.src = imageData.src;
  img.alt = imageData.alt;
  img.classList.add("gallery__image");

  figure.appendChild(img);
  link.appendChild(figure);

  return link;
}

const NUMBER_OF_IMAGES: number = 8;
const API_KEY: string = "";
const ENDPOINT: string = `https://picsum.photos/v2/list?page=1&limit=${NUMBER_OF_IMAGES}&w=500&h=500`;


fetch(ENDPOINT)
  .then(response => response.json())
  .then((data: any[]) => {
    const gallery = document.querySelector(".gallery") as HTMLDivElement | null;
    if (!gallery) {
      console.error("Gallery element not found in the DOM");
      return;
    }

    data.forEach(item => {
      const imgData: GalleryImageData = {
        link: item.url,
        src: item.download_url,
        alt: item.author,
      };
      const galleryItem = createGalleryItem(imgData);
      const column = document.createElement("div");
      column.classList.add("gallery__column");
      column.appendChild(galleryItem);
      gallery.appendChild(column);
    });

    // Start the slideshow once all images are loaded
    const images = gallery.querySelectorAll('.gallery__link') as NodeListOf<HTMLAnchorElement>;
    displayFullscreenImage(images);
  })
  .catch(error => {
    console.error('Error fetching images:', error);
  });

  let currentIndex = 0;
  let previousLink: HTMLAnchorElement | null = null;

  function displayFullscreenImage(images: NodeListOf<HTMLAnchorElement>) {
    console.log('im in displayFullscreen')
    const fullscreenContainer = document.getElementById(
        "fullscreen-container"
        ) as HTMLDivElement;
        
        // Clear the previous image and reset opacity for the fade-in effect
        fullscreenContainer.innerHTML = "";
        fullscreenContainer.style.opacity = "0";
        
        if (currentIndex >= images.length) {
        console.log('currentIndex', currentIndex)
        currentIndex = 0; // Reset to the first image if we've reached the end
    }
    
    const currentImage = images[currentIndex]
    .querySelector("img")
    ?.cloneNode(true) as HTMLImageElement;
    console.log(currentImage);
    if (currentImage) {
      currentImage.style.width = "100vw"; // Full viewport width
      currentImage.style.height = "100vh"; // Full viewport height
      currentImage.style.objectFit = "cover"; // Cover the viewport without distorting the image

      // Display the image after a 1-second blackout
      setTimeout(() => {
        fullscreenContainer.appendChild(currentImage);
        fullscreenContainer.style.opacity = "1";
      }, 1000);
    }

    // Handle the "selected" class for the grid images
    if (previousLink) {
      previousLink.classList.remove("selected"); // Remove the "selected" class from the previous link
    }
    images[currentIndex].classList.add("selected"); // Add the "selected" class to the current link
    previousLink = images[currentIndex];

    currentIndex++;
    console.log('currentIndex2', currentIndex)
    
    // Set a timeout to clear the current image after 4 seconds (5 seconds total - 1 second for the blackout)
    setTimeout(() => {
        fullscreenContainer.style.opacity = "0"; // Fade out before clearing
        console.log('in timeout', fullscreenContainer.style.opacity)
      setTimeout(() => {
        fullscreenContainer.innerHTML = "";
        // Set another timeout to display the next image after the blackout
        setTimeout(() => displayFullscreenImage(images), 1000);
      }, 500); // Wait for the fade-out transition to complete
    }, 4000);
  }

