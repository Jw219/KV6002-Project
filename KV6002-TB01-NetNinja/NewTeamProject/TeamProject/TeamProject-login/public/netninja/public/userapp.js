// get the user input from the form
document.getElementById('updateButton').addEventListener('click', async function() {
  const email = document.getElementById('email').value; 
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const password = document.getElementById('password').value;

  // check that the user has entered the email
  if (!email) {
    document.getElementById('message').innerText = "Please enter your email.";
    return;
  }

  const userData = {
    email: email,
    firstName: firstName,
    lastName: lastName,
    password: password,
  };

  try {
    const response = await fetch('http://localhost:5002/updateUser', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await response.text();
    document.getElementById('message').innerText = result;
  } catch (error) {
    document.getElementById('message').innerText = 'Error updating user';
  }
});

// delete the user account 
document.getElementById('deleteButton').addEventListener('click', async function() {
  const email = document.getElementById('email').value; // 

  if (!email) {
    document.getElementById('message').innerText = "Please enter your email.";
    return;
  }

  const userData = { email: email };

  try {
    const response = await fetch('http://localhost:5002/deleteUser', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Expect JSON response from the server
    const result = await response.json(); 

    // display if the user was deleted successfully 
    document.getElementById('message').innerText = result.message || 'Account deleted successfully';

    // if the account was deleted successfully redirect to home.html
    if (response.ok && result.redirect) {
      setTimeout(() => {
        window.location.href = result.redirect; 
      }, 2000); 
    }
  } catch (error) {
    document.getElementById('message').innerText = 'Error deleting account'; // error message if there was a problem
  }
});
