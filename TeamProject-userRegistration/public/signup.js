const registrationForm = document.getElementById('registration-form');
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const ageInput = document.getElementById('age');
const firstNameError = document.getElementById('first-name-error');
const lastNameError = document.getElementById('last-name-error');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const confirmPasswordError = document.getElementById('confirm-password-error');
const ageError = document.getElementById('age-error');
const successMessage = document.getElementById('success-message');
 
registrationForm.addEventListener('submit', async (event) => {
  event.preventDefault();
 
  // Basic input validation
  if (!isValidName(firstNameInput.value)) {
    showErrorMessage(firstNameError, "First name must contain only letters.");
    return;
  }
 
  if (!isValidName(lastNameInput.value)) {
    showErrorMessage(lastNameError, "Last name must contain only letters.");
    return;
  }
 
  if (!isValidEmail(emailInput.value)) {
    showErrorMessage(emailError, "Please enter a valid email address.");
    return;
  }
 
  if (!isValidPassword(passwordInput.value)) {
    showErrorMessage(passwordError, "Password must meet the requirements.");
    return;
  }
 
  if (passwordInput.value !== confirmPasswordInput.value) {
    showErrorMessage(confirmPasswordError, "Passwords must match.");
    return;
  }
 
  if (!isValidAge(ageInput.value)) {
    showErrorMessage(ageError, "Age must be between 18 and 110.");
    return;
  }
 
  // Prepare data for backend API call
  const userData = {
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    email: emailInput.value,
    password: passwordInput.value, // Consider hashing this on the server
    age: parseInt(ageInput.value)
  };
 
  try {
    // Send user data to the backend API
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
 
    if (response.ok) {
      const result = await response.json();
      successMessage.textContent = result.message || "Registration successful!";
      registrationForm.reset(); // Clear the form fields
 
      // Redirect the user to the dashboard after successful registration
      setTimeout(() => {
        window.location.href = 'http://localhost:5001'; // Redirect to dashboard.html
      }, 2000); // Wait for 2 seconds before redirecting to show the success message
    } else {
      const errorData = await response.json();
      successMessage.textContent = `Error: ${errorData.message || 'Registration failed.'}`;
    }
  } catch (error) {
    console.error("Error during registration:", error);
    successMessage.textContent = "An error occurred. Please try again later.";
  }
});
 
// Helper functions for input validation
function isValidName(name) {
  return /^[a-zA-Z]+$/.test(name);
}
 
function isValidEmail(email) {
  // Basic email validation (you might want to use a more robust library)
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
}
 
function isValidPassword(password) {
  // Check for at least 8 characters, uppercase, lowercase, number, and special character
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
}
 
function isValidAge(age) {
  return age >= 18 && age <= 110;
}
 
function showErrorMessage(element, message) {
  element.textContent = message;
  element.style.display = 'block';
}
 
// Clear error messages on input focus
firstNameInput.addEventListener('focus', () => {
  firstNameError.style.display = 'none';
});
 
lastNameInput.addEventListener('focus', () => {
  lastNameError.style.display = 'none';
});
 
emailInput.addEventListener('focus', () => {
  emailError.style.display = 'none';
});
 
passwordInput.addEventListener('focus', () => {
  passwordError.style.display = 'none';
});
 
confirmPasswordInput.addEventListener('focus', () => {
  confirmPasswordError.style.display = 'none';
});
 
ageInput.addEventListener('focus', () => {
  ageError.style.display = 'none';
});
 
// Event listener for password input to dynamically change the message color
passwordInput.addEventListener('input', () => {
  const password = passwordInput.value;
 
  // Check if the password meets the requirements
  if (isValidPassword(password)) {
    passwordError.textContent = "Password meets the requirements.";
    passwordError.style.color = "green";  // Change message color to green
  } else {
    passwordError.textContent = "Password must meet the requirements.";
    passwordError.style.color = "red";  // Change message color to red
  }
});