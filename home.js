document.addEventListener('DOMContentLoaded', function () {
    // Initialize settings
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

    // Load saved settings if available
    loadSettings();

    // Set up operation toggles
    const operationToggles = document.querySelectorAll('[data-operation]');
    operationToggles.forEach(toggle => {
        toggle.addEventListener('change', function () {
            const operation = this.dataset.operation;
            settings.operations[operation] = this.checked;

            // Update toggle appearance
            const toggleTrack = this.parentElement;
            if (this.checked) {
                toggleTrack.classList.add('active');
            } else {
                toggleTrack.classList.remove('active');
            }

            // Ensure at least one operation is selected
            const enabledCount = Object.values(settings.operations).filter(Boolean).length;
            if (enabledCount === 0) {
                // Re-enable this operation if it was the last one
                settings.operations[operation] = true;
                this.checked = true;
                toggleTrack.classList.add('active');

                // Show feedback
                alert('At least one operation must be selected!');
            }

            // Save settings
            saveSettings();
        });

        // Set initial state based on settings
        toggle.checked = settings.operations[toggle.dataset.operation];
        if (toggle.checked) {
            toggle.parentElement.classList.add('active');
        } else {
            toggle.parentElement.classList.remove('active');
        }
    });

    // Set up difficulty buttons
    const difficultyButtons = document.querySelectorAll('[data-difficulty]');
    difficultyButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            difficultyButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Update settings
            settings.difficulty = this.dataset.difficulty;

            // Save settings
            saveSettings();
        });

        // Set initial state based on settings
        if (button.dataset.difficulty === settings.difficulty) {
            button.classList.add('active');
        }
    });

    // Set up time limit buttons
    const timeButtons = document.querySelectorAll('[data-time]');
    timeButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            timeButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Update settings
            settings.timeLimit = parseInt(this.dataset.time);

            // Save settings
            saveSettings();
        });

        // Set initial state based on settings
        if (parseInt(button.dataset.time) === settings.timeLimit) {
            button.classList.add('active');
        }
    });

    // Start button click handler
    document.getElementById('startButton').addEventListener('click', startQuiz);

    // Enter key handler
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            startQuiz();
        }
    });

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('change', toggleDarkMode);

    // Initialize dark mode based on saved preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark');
        darkModeToggle.checked = true;
        updateDarkModeIcon();
    }

    // Functions
    function startQuiz() {
        // Save settings before navigating
        saveSettings();

        // Navigate to quiz page
        window.location.href = 'quiz.html';
    }

    function saveSettings() {
        localStorage.setItem('quizSettings', JSON.stringify(settings));
    }

    function loadSettings() {
        const savedSettings = localStorage.getItem('quizSettings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
        }
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
