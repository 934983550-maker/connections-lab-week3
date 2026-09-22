let data;

let currentQuestion = 0;

let userTraits = {
    courage: 0,
    curiosity: 0,
    loyalty: 0,
    caution: 0,
    risk: 0
};


const intro = document.getElementById("intro");
const questionScreen = document.getElementById("questionScreen");
const resultScreen = document.getElementById("resultScreen");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const questionNumber = document.getElementById("questionNumber");
const question = document.getElementById("question");
const answers = document.getElementById("answers");

const resultType = document.getElementById("resultType");
const resultDescription = document.getElementById("resultDescription");


// Load the dataset
fetch("data.json")
    .then(response => response.json())
    .then(json => {
        data = json;
    })
    .catch(error => {
        console.error("Could not load data:", error);
    });


// Start the simulator
startButton.addEventListener("click", function() {

    intro.classList.add("hidden");

    questionScreen.classList.remove("hidden");

    currentQuestion = 0;

    resetTraits();

    showQuestion();
});


// Show current question
function showQuestion() {

    const current = data.questions[currentQuestion];

    questionNumber.textContent =
        `SCENARIO ${currentQuestion + 1} / ${data.questions.length}`;

    question.textContent = current.question;

    answers.innerHTML = "";


    current.answers.forEach(function(answer) {

        const button = document.createElement("button");

        button.classList.add("answer");

        button.textContent = answer.text;


        button.addEventListener("click", function() {

            applyTraits(answer.traits);

            currentQuestion++;


            if (currentQuestion < data.questions.length) {

                showQuestion();

            } else {

                showResult();

            }

        });


        answers.appendChild(button);
    });
}


// Add selected answer's traits
function applyTraits(traits) {

    for (let trait in traits) {

        userTraits[trait] += traits[trait];

    }
}


// Find closest character type
function findResult() {

    let bestType = null;
    let smallestDifference = Infinity;


    data.types.forEach(function(type) {

        let difference = 0;


        for (let trait in userTraits) {

            difference += Math.abs(
                userTraits[trait] - type.traits[trait]
            );

        }


        if (difference < smallestDifference) {

            smallestDifference = difference;

            bestType = type;

        }

    });


    return bestType;
}


// Show final result
function showResult() {

    questionScreen.classList.add("hidden");

    resultScreen.classList.remove("hidden");


    const result = findResult();

    resultType.textContent = result.name;

    resultDescription.textContent = result.description;


    createVisualization();
}


// Reset user traits
function resetTraits() {

    userTraits = {
        courage: 0,
        curiosity: 0,
        loyalty: 0,
        caution: 0,
        risk: 0
    };
}


// Restart
restartButton.addEventListener("click", function() {

    resultScreen.classList.add("hidden");

    intro.classList.remove("hidden");

    clearCanvas();

});