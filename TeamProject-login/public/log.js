document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
   // User input fields retrival
   
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok) {
        // Redirect user to dashboard
        window.location.href = "netninja/dashboard.html";
    } else {
        document.getElementById('error-message').textContent = result.message || 'Login failed';
    }
});
