document.addEventListener("DOMContentLoaded", () => {
    const openPopupButton = document.getElementById("openPopupButton");
    const closePopupButton = document.getElementById("closePopupButton");
    const popup = document.getElementById("popup");
  
    if (openPopupButton && closePopupButton && popup) {
      openPopupButton.addEventListener("click", () => {
        popup.style.display = "flex";
      });
  
      closePopupButton.addEventListener("click", () => {
        popup.style.display = "none";
      });
  
      window.addEventListener("click", (event) => {
        if (event.target === popup) {
          popup.style.display = "none";
        }
      });
    } else {
      console.error("Elementos do popup não foram encontrados.");
    }
  });
  