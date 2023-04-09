/**
 * @file Login form submission and handling
 * @author Balsher Singh <balshers@mun.ca>
 * @param {Event} event - The event object representing the form submission
 */

const form = document.querySelector("#login");
const errorMessage = document.getElementById('error-message');
form.addEventListener("submit", async function (event) {
  event.preventDefault();
  handleForm()
    .then((data) => {
      console.log(data);
      if (typeof data.success !== 'undefined' && data.success) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("objectid",data.data.user._id);
        console.log(localStorage.getItem("token"));
        console.log(localStorage.getItem("objectid"));
        window.location.replace("./index.html");
      } else {
        errorMessage.textContent = 'Username or password incorrect';
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

/**
 * Sends a GET request with the provided username and password and handles the response
 * @async
 * @function
 * @returns {Promise<Object>} The response object as a JSON object
 */
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