import { createServer } from 'http';
import qs from 'querystring';



var bigString = `<!DOCTYPE HTML>
<html>

<head>
    <!-- Meta Data -->
    <meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0"/>
    <meta name="description" content="Online Quiz">
    <meta name="keywords" content="Quiz, javascript">
    <meta name="author" content="Ed Brown">
    <title>COMP6905 Quiz</title>
    <!-- Favicon -->
</head>

<body>
<div id="intro">
    <h1>Online Quiz</h1>
</div>
<br>
<div>
    <div><!-- INTRO --></div>
    <form action="/quiz" method="POST">
        <input type="hidden" name="qnumber" value="QNUMBER PLACEHOLDER"/>
        <p>QUESTION PLACEHOLDER 
        <input type="text" size="40" name="qanswer" id="qanswer" />
        </p>
        <br>
        <button type="submit" id="submit">Submit</button>
    </form>
</div>
</body>
</html>`

var questions = [
    ["What HTML tag starts a javascript element?", "script"],
    ["What is the capital of Canada?", "Ottawa"],
    ["What is 2+2?", "4"]
];
var question_index = 0;

//create a server object:
createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' }); // http header
    var url = req.url;
    
    if (url === '/quiz') {
        let data = '';
        req.on('data', chunk => {
          data += chunk;
        })
        req.on('end', () => {        
          let post = qs.parse(data);
          let answer = post['qanswer'];
          let qnum = parseInt(post['qnumber']);
          let correctness = questions[qnum][1] == answer ? "CORRECT" : "INCORRECT"; 
          
          let introString = `<p><mark>${correctness}</mark> The answer is ${questions[qnum][1]}</p>`;
          let newString = bigString.replace('<!-- INTRO -->', introString );

          question_index = (question_index +1) % questions.length;

          newString = newString.replace("QNUMBER PLACEHOLDER", question_index);
          newString = newString.replace("QUESTION PLACEHOLDER", questions[question_index][0]);

          res.write(newString);

          res.end();
        })

    } else {

        let newString = bigString.replace("QNUMBER PLACEHOLDER", question_index);
        newString = newString.replace("QUESTION PLACEHOLDER", questions[question_index][0]);
        res.write(newString); //write a response
        res.end(); //end the response
    }
}).listen(3000, function () {
    console.log("server start at port 3000"); //the server object listens on port 3000
});