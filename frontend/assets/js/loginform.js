const form = document.querySelector("#login");
const errorMessage = document.getElementById('error-message');
form.addEventListener("submit", async function (event) {
  event.preventDefault();
  handleForm()
    .then((data) => {
      console.log(data);
      if (typeof data.success !== 'undefined' && data.success) {
        localStorage.setItem("token", data.data.token);
        console.log(localStorage.getItem("token"));
        window.location.replace("./index.html");
      } else {
        errorMessage.textContent = 'Username or password incorrect';
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

async function handleForm() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const url = new URL('http://localhost:3000/v1/login');
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    url.search = params.toString();

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
  return res.json();
}