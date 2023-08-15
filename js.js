function createGalleryItem(imageData) {
    var link = document.createElement("a");
    link.href = imageData.link;
    link.target = "_blank";
    link.classList.add("gallery__link");
    var figure = document.createElement("figure");
    figure.classList.add("gallery__thumb");
    var img = document.createElement("img");
    img.src = imageData.src;
    img.alt = imageData.alt;
    img.classList.add("gallery__image");
    figure.appendChild(img);
    link.appendChild(figure);
    return link;
}
var NUMBER_OF_IMAGES = 8;
var API_KEY = "";
var ENDPOINT = "https://picsum.photos/v2/list?page=1&limit=".concat(NUMBER_OF_IMAGES, "&w=500&h=500");
fetch(ENDPOINT)
    .then(function (response) { return response.json(); })
    .then(function (data) {
    var gallery = document.querySelector(".gallery");
    if (!gallery) {
        console.error("Gallery element not found in the DOM");
        return;
    }
    data.forEach(function (item) {
        var imgData = {
            link: item.url,
            src: item.download_url,
            alt: item.author,
        };
        var galleryItem = createGalleryItem(imgData);
        var column = document.createElement("div");
        column.classList.add("gallery__column");
        column.appendChild(galleryItem);
        gallery.appendChild(column);
    });
    // Start the slideshow once all images are loaded
    var images = gallery.querySelectorAll('.gallery__link');
    displayFullscreenImage(images);
})
    .catch(function (error) {
    console.error('Error fetching images:', error);
});
var currentIndex = 0;
var previousLink = null;
function displayFullscreenImage(images) {
    var _a;
    console.log('im in displayFullscreen');
    var fullscreenContainer = document.getElementById("fullscreen-container");
    // Clear the previous image and reset opacity for the fade-in effect
    fullscreenContainer.innerHTML = "";
    fullscreenContainer.style.opacity = "0";
    if (currentIndex >= images.length) {
        console.log('currentIndex', currentIndex);
        currentIndex = 0; // Reset to the first image if we've reached the end
    }
    var currentImage = (_a = images[currentIndex]
        .querySelector("img")) === null || _a === void 0 ? void 0 : _a.cloneNode(true);
    console.log(currentImage);
    if (currentImage) {
        currentImage.style.width = "100vw"; // Full viewport width
        currentImage.style.height = "100vh"; // Full viewport height
        currentImage.style.objectFit = "cover"; // Cover the viewport without distorting the image
        // Display the image after a 1-second blackout
        setTimeout(function () {
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
    console.log('currentIndex2', currentIndex);
    // Set a timeout to clear the current image after 4 seconds (5 seconds total - 1 second for the blackout)
    setTimeout(function () {
        fullscreenContainer.style.opacity = "0"; // Fade out before clearing
        console.log('in timeout', fullscreenContainer.style.opacity);
        setTimeout(function () {
            fullscreenContainer.innerHTML = "";
            // Set another timeout to display the next image after the blackout
            setTimeout(function () { return displayFullscreenImage(images); }, 1000);
        }, 500); // Wait for the fade-out transition to complete
    }, 4000);
}
