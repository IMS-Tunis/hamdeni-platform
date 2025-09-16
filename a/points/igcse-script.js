document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".past-paper-btn");

  buttons.forEach(button => {
    const modalId = button.getAttribute("data-modal");
    const modal = document.getElementById(modalId);

    if (modal) {
      const closeBtn = modal.querySelector(".close-button");

      // ✅ Add class 'active' instead of using display
      button.addEventListener("click", () => {
        modal.classList.add("active");
      });

      closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
      });

      window.addEventListener("click", (event) => {
        if (event.target === modal) {
          modal.classList.remove("active");
        }
      });
    }
  });
});
