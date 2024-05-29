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

  // Disable right-click, view source, inspect element, copy, text selection, and Ctrl + A
document.addEventListener("contextmenu", (event) => event.preventDefault());
document.addEventListener("keydown", (event) => {
  if (
    event.ctrlKey &&
    (event.key === "u" ||
      event.key === "i" ||
      event.key === "c" ||
      event.key === "j" ||
      event.key === "a")
  ) {
    event.preventDefault();
  }
  if (event.key === "F12") {
    event.preventDefault();
  }
});
document.addEventListener("copy", (event) => event.preventDefault());
});
