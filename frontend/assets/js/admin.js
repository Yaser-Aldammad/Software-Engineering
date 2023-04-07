/**
 * @file Admin frontend to backend bridge
 * @author Balsher Singh <balshers@mun.ca>
 * @param {Event} event - The event object representing the form submission
 */
const form = document.querySelector("#addQuiz");
const successMessage = document.getElementById('success-message');
form.addEventListener("submit", async function (event) {
  event.preventDefault();
  handleForm()
    .then((data) => {
        if (typeof data.success !== 'undefined' && data.success) {
            successMessage.textContent = 'Quiz Created Successfully!';
            get_quiz();
          } else {
            successMessage.textContent = 'Quiz failed to create';
          }
    })
    .catch((error) => {
      console.error(error);
    });
});

/**
 * Sends a POST request to add new quiz
 * @async
 * @function
 * @returns {Promise<Object>} The response object as a JSON object
 */

async function handleForm() {
  const title = document.getElementById("title").value;
  const qtype = document.getElementById("qtype").value;
  const qdescription = document.getElementById("qdescription").value;
  const objectid = localStorage.getItem("objectid");
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:3000/v1/quiz", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `bearer ${token}`
    },
    body: JSON.stringify({
        title:title,
        quizType:qtype,
        description:qdescription,
        createdBy:objectid
    }),
  });
  return res.json();
}

function get_quiz(){
    if (!localStorage.getItem("token")) {
        window.location.replace("./login.html");
      } else {
        const token = localStorage.getItem("token"); // gets the token from the localStorage
        console.log(token);
      
        /**
         * Makes GET request to backend to fetch the quiz array
         * @returns response data: Promise
         */
        async function quiz() {
          const res = await fetch("http://localhost:3000/v1/quiz", {
            method: "GET",
            headers: {
              Authorization: `bearer ${token}`,
            },
          });
      
          return res.json();
        }
      
        /**
         * Resolves promise and interpolates the data into the webpage dynamically
         */
        quiz()
          .then((data) => {
            console.log(data.data.quizzes[0]);
            for (let i of data.data.quizzes) {
              document.getElementById("quizCards").innerHTML += `
              <div class="card m-2" style="width: 18rem;">
                  <div class="card-body">
                      <h5 class="card-title">
                          ${i.title}
                      </h5>
                      <h6 class="card-subtitle mb-2 text-muted">Quiz Type: ${i.quizType}
                      </h6>
                      <p class="card-text">
                          ${i.description}
                      </p>
                      <a href="./quiz.html?objId=${i._id}" class="card-link attempt-quiz">Attempt Quiz</a>
                      <a href="#" class="card-link">Another link</a>
                  </div>
              </div>
            `;
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }    
}

get_quiz()