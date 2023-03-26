/**
 * @file Sends backend GET API request and retrieves all quiz data
 * @author Pranav Arora <parora@mun.ca>
 */

// redirect if not logged in or signed up
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
