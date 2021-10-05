// Select Elements
let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bulletsElement = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");

// Set Option
let currentIndx = 0;
let rightAnswers = 0;
let counterInterval;

function getQuesyions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {

        if (this,this.readyState === 4 && this.status === 200) {

            let questionsObject = JSON.parse(this.responseText);
            let questionsCount = questionsObject.length;
            
            // Create Bullets + Set Questions Count
            createBullet(questionsCount);

            // Add Question Data
            addQuestionData(questionsObject[currentIndx] , questionsCount);

            // Start Count Down
            countDown(20 , questionsCount)

            // Click On Submit
            submitButton.onclick = () => {

                // Get Right Answer
                let theRightAnswer = questionsObject[currentIndx].right_answer;

                // console.log(theRightAnswer)

                // Increase Index
                currentIndx++;

                // Check The Answer
                checkAnswer(theRightAnswer , questionsCount);

                // Remove Previous Questions  + Answer Area
                quizArea.innerHTML = "";
                answerArea.innerHTML = "";

                // Add Question Data
                addQuestionData(questionsObject[currentIndx] , questionsCount);

                // Handle Bullets Classes
                handleBullets();

                    
                // Start Count Down
                clearInterval(counterInterval);
                countDown(20 , questionsCount);

                // Show Results
                showResults(questionsCount);

            }
        }
    };
    myRequest.open("Get" , "html_questions.json" , true);
    myRequest.send()
}

getQuesyions();

function createBullet(num) {

    countSpan.innerHTML = num;

    // Create Spans
    for (let i = 0; i < num; i++) {

        // Create Bullet 
        let theBullet = document.createElement("span");

        // Check If Its First Span
        if (i === 0 ) {
            theBullet.className = "on"
        }

        // Append Bullets To Main Bullet Countainer
        bulletsSpanContainer.appendChild(theBullet);
    }
}

function addQuestionData(obj , count) {

    if (currentIndx < count) {
        
        // Create H2 Question Title
        let qTitle = document.createElement("h2");

        // Create Question Text
        let qText = document.createTextNode(obj["title"]);

        // Append Text To H2
        qTitle.appendChild(qText);

        // Apend H2 To Quiz Area
        quizArea.appendChild(qTitle);

        // Create The Answers
        for (let i = 1; i <= 4; i++) {

            // Create Min Answer Div
            let mainDiv = document.createElement("div");

            // Add Class To Main Div
            mainDiv.className = "answer";

            // Create Radio Input 
            let raidoInput = document.createElement("input");

            // Add Type + Name + Id
            raidoInput.name = "questions";
            raidoInput.type = "radio";
            raidoInput.id = `answer_${i}`;
            raidoInput.dataset.answer = obj[`answer_${i}`];

            // Make First Option Select
            if (i === 1) {
                raidoInput.checked = true
            }

            // Create Lable
            let theLabel = document.createElement("label");

            // Add For Attribute
            theLabel.htmlFor = `answer_${i}`;

            // Create Label Text
            let theLabelText = document.createTextNode(obj[`answer_${i}`]);

            // Add The Text To The Label
            theLabel.appendChild(theLabelText);

            // Add Input + Label To Main Div
            mainDiv.appendChild(raidoInput);
            mainDiv.appendChild(theLabel );

            // Append All Divs To Answers Area
            answerArea.appendChild(mainDiv);
        }
    }
}

function checkAnswer(rAnswer , count) {

    let answers = document.getElementsByName("questions");
    let theChoosenAnswer;
    // var x ;

    for (let x = 0; x < answers.length; x++) {

        if (answers[x].checked) {

            theChoosenAnswer = answers[x].dataset.answer;
        }
    }
    if (rAnswer === theChoosenAnswer) {

        rightAnswers++;
        console.log("Good Answer");
    }
}

function handleBullets() {

    let bulletsSpan = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpan = Array.from(bulletsSpan);

    arrayOfSpan.forEach((span , index) => {

        if (currentIndx === index) {

            span.className = "on";
        }
    });
}

function showResults(count) {
    let theResults;

    if (currentIndx === count) {

        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        submitButton.remove();
        bulletsElement.remove();

        if (rightAnswers > (count / 2) && rightAnswers < count) {

            theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count} Is Good`;

        } else if(rightAnswers === count) {

            theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
        } else{

            theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count} Is Good`;
        }

        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "10px";
        resultsContainer.style.backgroundColor = "#fff";
        resultsContainer.style.marginTop = "10px";
    }
}

function countDown(duration , count) {

    if (currentIndx < count) {

        let minutes , seconds;

        counterInterval = setInterval(function (){

            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes; 
            seconds = seconds < 10 ? `0${seconds}` : seconds; 

            countDownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {

                clearInterval(counterInterval);
                submitButton.click();

            }
        } , 1000)
    }
}

