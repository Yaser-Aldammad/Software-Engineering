const form = document.querySelector('#signup');
form.addEventListener('submit', async function(event) {
  event.preventDefault();
  handleForm().then(data => {
    localStorage.setItem('token',data.data.token)
    const token = localStorage.getItem('token')
    console.log(token)
  })
  .catch(error => {
    console.error(error)
  });
});

async function handleForm() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch('http://localhost:3000/v1/signup',
    {
        method:'POST',
        headers:{
            "Content-Type":'application/json'
        },
        body: JSON.stringify({
            first_name:firstName,
            last_name:lastName,
            email:email,
            username:firstName,
            password:password,
            countryCode:"+92",
            phoneNo:"9812451245"
        })
    })
    return res.json();
}