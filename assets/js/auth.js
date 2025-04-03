document.addEventListener("DOMContentLoaded", function () {
    const toastSuccess = document.getElementById("toastSuccess");
    toast_show_success = new bootstrap.Toast(toastSuccess);
    const toastError = document.getElementById("toastError");
    toast_show_error = new bootstrap.Toast(toastError);
    document.getElementById("loginForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        let response = await fetch(`${CONFIG.BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        let data = await response.json();
        
        if (response.ok) {
            localStorage.setItem("token", data.access_token);
            toast_show_success.show();
            window.location.href = "/admin.html";
        } else {
            toast_show_error.show();
            console.error("Login failed:", data.message);
        }
    });
});
