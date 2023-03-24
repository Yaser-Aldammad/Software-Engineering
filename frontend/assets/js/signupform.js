const form = document.querySelector("#signup");
form.addEventListener("submit", async function (event) {
  event.preventDefault();
  handleForm()
    .then((data) => {
      localStorage.setItem("token", data.data.token);
      const token = localStorage.getItem("token");
      console.log(token);
      window.location.replace("./index.html");
    })
    .catch((error) => {
      console.error(error);
    });
});

async function handleForm() {
  const username = document.getElementById("username").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const countryCode = "+"+document.getElementById("countrycode").value.toString();;
  const phoneNo = document.getElementById("phone").value;

  const res = await fetch("http://localhost:3000/v1/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_name: username,
      last_name: lastName,
      email: email,
      username: username,
      password: password,
      countryCode: countryCode,
      phoneNo: phoneNo,
    }),
  });
  return res.json();
}