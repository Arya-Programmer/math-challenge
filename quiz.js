document.addEventListener('DOMContentLoaded', function () {
    // Variables
    let num1, num2, correctAnswer, currentOperation;
    let score = 0;
    let streak = 0;
    let timer;
    let timeLeft;
    let settings = {
        operations: {
            addition: true,
            subtraction: true,
            multiplication: true,
            division: true
        },
        difficulty: 'easy',
        timeLimit: 0 // 0 means no time limit
    };

    // Operation definitions
    const operations = {
        addition: { symbol: '+', name: 'addition' },
        subtraction: { symbol: '−', name: 'subtraction' },
        multiplication: { symbol: '×', name: 'multiplication' },
        division: { symbol: '÷', name: 'division' }
    };

    // Load settings
    loadSettings();

    // Set up event listeners
    document.getElementById('checkButton').addEventListener('click', checkAnswer);
    document.getElementById('newProblemButton').addEventListener('click', newProblem);
    document.getElementById('backButton').addEventListener('click', goBack);
    document.getElementById('darkModeToggle').addEventListener('change', toggleDarkMode);

    // Allow pressing Enter to check answer
    document.getElementById('answerTB').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    });

    // Initialize the quiz
    init();

    // Functions
    function init() {
        // Initialize dark mode based on saved preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark');
            document.getElementById('darkModeToggle').checked = true;
            updateDarkModeIcon();
        }

        // Initialize score and streak
        score = 0;
        streak = 0;
        document.getElementById('scoreSpan').textContent = score;
        document.getElementById('streakSpan').textContent = streak;

        // Set up timer if needed
        if (settings.timeLimit > 0) {
            document.getElementById('timerContainer').classList.remove('hidden');
        } else {
            document.getElementById('timerContainer').classList.add('hidden');
        }

        // Generate first problem
        newProblem();
    }

    function newProblem() {
        // Clear any existing timer
        if (timer) {
            clearInterval(timer);
        }

        // Get enabled operations
        const availableOperations = getEnabledOperations();

        if (availableOperations.length === 0) {
            return; // This shouldn't happen due to our validation
        }

        // Randomly select from enabled operations
        const selectedOpKey = availableOperations[Math.floor(Math.random() * availableOperations.length)];
        currentOperation = operations[selectedOpKey];

        // Generate numbers based on operation type and difficulty
        switch (currentOperation.symbol) {
            case '+':
                generateAdditionProblem();
                break;
            case '−':
                generateSubtractionProblem();
                break;
            case '×':
                generateMultiplicationProblem();
                break;
            case '÷':
                generateDivisionProblem();
                break;
        }

        // Display the numbers and operation
        document.getElementById('num1Span').textContent = num1;
        document.getElementById('num2Span').textContent = num2;
        document.getElementById('operationSpan').textContent = currentOperation.symbol;

        // Clear the answer textbox and feedback
        document.getElementById('answerTB').value = '';
        const feedbackDiv = document.getElementById('feedbackDiv');
        feedbackDiv.textContent = '';
        feedbackDiv.className = 'feedback-neutral';

        // Focus on the answer textbox
        document.getElementById('answerTB').focus();

        // Start timer if needed
        if (settings.timeLimit > 0) {
            startTimer();
        }
    }

    function generateAdditionProblem() {
        switch (settings.difficulty) {
            case 'easy':
                num1 = Math.floor(Math.random() * 20) + 1; // 1-20
                num2 = Math.floor(Math.random() * 20) + 1; // 1-20
                break;
            case 'medium':
                num1 = Math.floor(Math.random() * 50) + 1; // 1-50
                num2 = Math.floor(Math.random() * 50) + 1; // 1-50
                break;
            case 'hard':
                num1 = Math.floor(Math.random() * 100) + 1; // 1-100
                num2 = Math.floor(Math.random() * 100) + 1; // 1-100
                break;
        }
        correctAnswer = num1 + num2;
    }

    function generateSubtractionProblem() {
        switch (settings.difficulty) {
            case 'easy':
                num1 = Math.floor(Math.random() * 20) + 10; // 10-29
                num2 = Math.floor(Math.random() * num1); // 0 to num1-1
                break;
            case 'medium':
                num1 = Math.floor(Math.random() * 50) + 20; // 20-69
                num2 = Math.floor(Math.random() * num1); // 0 to num1-1
                break;
            case 'hard':
                num1 = Math.floor(Math.random() * 100) + 50; // 50-149
                num2 = Math.floor(Math.random() * num1); // 0 to num1-1
                break;
        }
        correctAnswer = num1 - num2;
    }

    function generateMultiplicationProblem() {
        switch (settings.difficulty) {
            case 'easy':
                num1 = Math.floor(Math.random() * 10) + 1; // 1-10
                num2 = Math.floor(Math.random() * 10) + 1; // 1-10
                break;
            case 'medium':
                num1 = Math.floor(Math.random() * 12) + 1; // 1-12
                num2 = Math.floor(Math.random() * 12) + 1; // 1-12
                break;
            case 'hard':
                num1 = Math.floor(Math.random() * 20) + 1; // 1-20
                num2 = Math.floor(Math.random() * 12) + 1; // 1-12
                break;
        }
        correctAnswer = num1 * num2;
    }

    function generateDivisionProblem() {
        switch (settings.difficulty) {
            case 'easy':
                correctAnswer = Math.floor(Math.random() * 10) + 1; // 1-10
                num2 = Math.floor(Math.random() * 5) + 1; // 1-5
                break;
            case 'medium':
                correctAnswer = Math.floor(Math.random() * 12) + 1; // 1-12
                num2 = Math.floor(Math.random() * 10) + 1; // 1-10
                break;
            case 'hard':
                correctAnswer = Math.floor(Math.random() * 20) + 1; // 1-20
                num2 = Math.floor(Math.random() * 12) + 1; // 1-12
                break;
        }
        num1 = correctAnswer * num2; // This ensures whole number division
    }

    function checkAnswer() {
        const userAnswer = parseInt(document.getElementById('answerTB').value);
        const feedbackDiv = document.getElementById('feedbackDiv');

        if (isNaN(userAnswer)) {
            feedbackDiv.textContent = 'Please enter a number';
            feedbackDiv.className = 'feedback-error';
            return;
        }

        // Clear any existing timer
        if (timer) {
            clearInterval(timer);
        }

        if (userAnswer === correctAnswer) {
            const encouragements = [
                'Excellent! 🎉',
                'Perfect! 🌟',
                'Outstanding! 🚀',
                'Brilliant! ✨',
                'Amazing! 🎯',
                'Fantastic! 🏆'
            ];
            const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

            feedbackDiv.textContent = `Correct! ${randomEncouragement}`;
            feedbackDiv.className = 'feedback-success';

            // Update score and streak
            score++;
            streak++;
            document.getElementById('scoreSpan').textContent = score;
            document.getElementById('scoreSpan').classList.add('pulse');
            document.getElementById('streakSpan').textContent = streak;
            document.getElementById('streakSpan').classList.add('pulse');

            setTimeout(() => {
                document.getElementById('scoreSpan').classList.remove('pulse');
                document.getElementById('streakSpan').classList.remove('pulse');
            }, 500);

            // Generate a new problem after a short delay
            setTimeout(newProblem, 1500);
        } else {
            feedbackDiv.textContent = `Incorrect. The correct answer is ${correctAnswer}. Try the next one!`;
            feedbackDiv.className = 'feedback-error';

            // Reset streak
            streak = 0;
            document.getElementById('streakSpan').textContent = streak;
        }
    }

    function startTimer() {
        timeLeft = settings.timeLimit;
        document.getElementById('timerText').textContent = `${timeLeft}s`;
        document.getElementById('timerProgress').style.width = '100%';

        timer = setInterval(() => {
            timeLeft--;
            document.getElementById('timerText').textContent = `${timeLeft}s`;

            // Update progress bar
            const percentage = (timeLeft / settings.timeLimit) * 100;
            document.getElementById('timerProgress').style.width = `${percentage}%`;

            // Change color as time runs out
            if (timeLeft <= 5) {
                document.getElementById('timerProgress').style.backgroundColor = 'var(--error)';
            } else {
                document.getElementById('timerProgress').style.backgroundColor = 'var(--primary)';
            }

            if (timeLeft <= 0) {
                clearInterval(timer);
                timeOut();
            }
        }, 1000);
    }

    function timeOut() {
        const feedbackDiv = document.getElementById('feedbackDiv');
        feedbackDiv.textContent = `Time's up! The correct answer was ${correctAnswer}.`;
        feedbackDiv.className = 'feedback-error';

        // Reset streak
        streak = 0;
        document.getElementById('streakSpan').textContent = streak;

        // Disable input
        document.getElementById('answerTB').disabled = true;
        document.getElementById('checkButton').disabled = true;

        // Enable after a delay
        setTimeout(() => {
            document.getElementById('answerTB').disabled = false;
            document.getElementById('checkButton').disabled = false;
            newProblem();
        }, 2000);
    }

    function getEnabledOperations() {
        return Object.keys(settings.operations).filter(op => settings.operations[op]);
    }

    function loadSettings() {
        const savedSettings = localStorage.getItem('quizSettings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
        }
    }

    function goBack() {
        window.location.href = 'index.html';
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark');
        localStorage.setItem('darkMode', document.body.classList.contains('dark'));
        updateDarkModeIcon();
    }

    function updateDarkModeIcon() {
        const toggleIcon = document.querySelector('.theme-toggle-icon');
        if (document.body.classList.contains('dark')) {
            toggleIcon.textContent = '🌙';
        } else {
            toggleIcon.textContent = '☀️';
        }
    }
});
