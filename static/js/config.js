// ---- SET CONFIG VARIABLE----
const CONFIG = {
  // BASE_URL: "https://portfolio-app-8mi2.onrender.com",
  LOGIN_URL: "./login.html",
  ADMIN_URL: "./admin.html",
  BASE_URL: "http://localhost:8000",
};
// ---- SET CURRENT YEAR IN FOOTER ----
document.addEventListener("DOMContentLoaded", function () {
  const current_year_footer = document.getElementById("current-year");
  if (current_year_footer) {
    current_year_footer.innerText = new Date().getFullYear();
  }
});
// ---- SET FETCH WITH RETRY----
function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  return fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      if (retries > 0) {
        console.warn(`Retrying... (${3 - retries + 1})`, error);
        return new Promise((resolve) => setTimeout(resolve, delay)).then(() =>
          fetchWithRetry(url, options, retries - 1, delay)
        );
      } else {
        console.error("All retries failed:", error);
        throw error;
      }
    });
}
