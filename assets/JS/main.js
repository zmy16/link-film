document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("#film-sites a");
  links.forEach((link) => {
    link.addEventListener("mouseover", () => {
      link.style.color = "#ffffff";
    });
    link.addEventListener("mouseout", () => {
      link.style.color = "#ffcc00";
    });
    link.addEventListener("click", () => {
      link.innerHTML = "Loading...";
    });
  });
});

// Lazy loading images
document.addEventListener("DOMContentLoaded", function () {
  let lazyloadImages = document.querySelectorAll("img.lazy");
  let lazyloadThrottleTimeout;

  function lazyload() {
    if (lazyloadThrottleTimeout) {
      clearTimeout(lazyloadThrottleTimeout);
    }

    lazyloadThrottleTimeout = setTimeout(function () {
      let scrollTop = window.pageYOffset;
      lazyloadImages.forEach(function (img) {
        if (img.offsetTop < window.innerHeight + scrollTop) {
          img.src = img.dataset.src;
          img.classList.remove("lazy");
        }
      });
      if (lazyloadImages.length == 0) {
        document.removeEventListener("scroll", lazyload);
        window.removeEventListener("resize", lazyload);
        window.removeEventListener("orientationChange", lazyload);
      }
    }, 20);
  }

  document.addEventListener("scroll", lazyload);
  window.addEventListener("resize", lazyload);
  window.addEventListener("orientationChange", lazyload);
});
