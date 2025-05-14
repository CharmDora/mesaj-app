document.getElementById('login-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username && password) {
    alert(`Welcome, ${username}!`);
    // Burada sunucuya giriş isteği gönderebilirsiniz.
  } else {
    alert('Please fill in all fields.');
  }
});
