if (!localStorage.getItem("token")) {
  window.location.replace("./login.html");
} else {
  const token = localStorage.getItem("token");
  console.log(token);

  async function quiz() {
    const res = await fetch("http://localhost:3000/v1/quiz", {
      method: "GET",
      headers: {
        Authorization: `bearer ${token}`,
      },
    });

    return res.json();
  }

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
