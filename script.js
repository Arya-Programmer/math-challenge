
let num1, num2, correctAnswer;
let score = 0;

function newProblem() {
    // Generate random numbers between 1 and 100
    num1 = Math.floor(Math.random() * 100);
    num2 = Math.floor(Math.random() * 100);
    correctAnswer = num1 + num2;

    // Display the numbers
    document.getElementById('num1Span').textContent = num1;
    document.getElementById('num2Span').textContent = num2;

    // Clear the answer textbox and feedback
    document.getElementById('answerTB').value = '';
    const feedbackDiv = document.getElementById('feedbackDiv');
    feedbackDiv.textContent = '';
    feedbackDiv.className = 'feedback-neutral';

    // Focus on the answer textbox
    document.getElementById('answerTB').focus();
}

function checkAnswer() {
    const userAnswer = parseInt(document.getElementById('answerTB').value);
    const feedbackDiv = document.getElementById('feedbackDiv');

    if (isNaN(userAnswer)) {
        feedbackDiv.textContent = 'Please enter a number';
        feedbackDiv.className = 'feedback-error';
        return;
    }

    if (userAnswer === correctAnswer) {
        feedbackDiv.textContent = 'Correct! Well done! 🎉';
        feedbackDiv.className = 'feedback-success';
        score++;
        document.getElementById('scoreSpan').textContent = score;
        document.getElementById('scoreSpan').classList.add('pulse');
        setTimeout(() => {
            document.getElementById('scoreSpan').classList.remove('pulse');
        }, 500);

        // Generate a new problem after a short delay
        setTimeout(newProblem, 1500);
    } else {
        feedbackDiv.textContent = `Incorrect. Try again! The correct answer is ${correctAnswer}.`;
        feedbackDiv.className = 'feedback-error';
    }
}

// Allow pressing Enter to check answer
document.getElementById('answerTB').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});

function toggleDarkMode() {
    document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', document.body.classList.contains('dark'));

    // Update the icon based on dark mode state
    const toggleIcon = document.querySelector('.theme-toggle-icon');
    if (document.body.classList.contains('dark')) {
        toggleIcon.textContent = '🌙';
    } else {
        toggleIcon.textContent = '☀️';
    }
}

// Initialize the app
function init() {
    // Restore dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark');
        document.getElementById('darkModeToggle').checked = true;
        document.querySelector('.theme-toggle-icon').textContent = '🌙';
    }

    // Initialize the first problem
    newProblem();
    document.getElementById('scoreSpan').textContent = score;
}

// Call init on page load
window.onload = init;
