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
})
