document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("#film-sites a");

  // Menambahkan efek hover pada link
  links.forEach((link) => {
    link.addEventListener("mouseover", () => {
      link.style.color = "#ffffff";
    });

    link.addEventListener("mouseout", () => {
      link.style.color = "#ffcc00";
    });
  });

  // Disable right-click
  document.addEventListener("contextmenu", (event) => event.preventDefault());

  // Disable developer tools
  const preventDevTools = (event) => {
    if (
      event.key === "F12" ||
      (event.ctrlKey && event.shiftKey && event.key === "I") ||
      (event.ctrlKey && event.key === "U") ||
      (event.ctrlKey && event.shiftKey && event.key === "C")
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  document.addEventListener("keydown", preventDevTools);
  document.addEventListener("keyup", preventDevTools);

  // Additional prevention for contextmenu and F12
  window.addEventListener("keydown", function (event) {
    if (event.key === "F12") {
      event.preventDefault();
    }
  });

  // Check for other methods to open dev tools
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && (e.key === "U" || e.key === "u")) {
      e.preventDefault();
    }
    if (
      e.ctrlKey &&
      e.shiftKey &&
      (e.key === "I" || e.key === "C" || e.key === "J")
    ) {
      e.preventDefault();
    }
  });
});
