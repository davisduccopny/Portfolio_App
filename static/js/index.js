// experience
const spinner_form = document.querySelector("#loadingSpinner");
let toast_show_success;
let toast_show_error;
document.addEventListener("DOMContentLoaded", function () {
  const toastSuccess = document.getElementById("toastSuccess");
  toast_show_success = new bootstrap.Toast(toastSuccess);
  const toastError = document.getElementById("toastError");
  toast_show_error = new bootstrap.Toast(toastError);
  const form_client_sent = document.querySelector("#FormContactClient");
  if (form_client_sent) {
    form_client_sent.addEventListener("submit", sendContactForm);
  }
});

function sendContactForm(event) {
  event.preventDefault();
  if (spinner_form) {
    spinner_form.classList.remove("d-none");
  }
  const form = document.querySelector("#FormContactClient");
  const formData = new FormData(form);
  fetch(`${CONFIG.BASE_URL}/contact`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.status == 200) {
        toast_show_success.show();
        form.reset();
      } else {
        toast_show_error.show();
      }
    })
    .catch((error) => console.error("Error sending message:", error))
    .finally(() => {
      if (spinner_form) {
        spinner_form.classList.add("d-none");
      }
    });
}