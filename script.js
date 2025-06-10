document.addEventListener('DOMContentLoaded', () => {
    const stagePasswords = [
        '1488A',
        '33B01',
        '007AB',
        'CD123'
    ];

    const possibleLetters = [
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D'], // Letters for position 1
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D'], // Letters for position 2
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D'], // Letters for position 3
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D'], // Digits and letters for position 4
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D'] // Digits for position 5
    ];

    let currentLetters = [0, 0, 0, 0, 0];
    let correctPassword;
    let canInteract = true;
    let currentStage = 0;
    const totalStages = 4;

    // Load sounds
    const moveSound = new Audio('move.mp3');
    moveSound.preload = 'auto';
    moveSound.volume = 0.5;

    const failSound = new Audio('wall_hit.mp3');
    failSound.preload = 'auto';
    failSound.volume = 0.5;

    const successSound = new Audio('stage_complete.mp3');
    successSound.preload = 'auto';
    successSound.volume = 0.5;

    // Message elements
    const errorMessage = document.getElementById('error-message');
    const completionMessage = document.getElementById('completion-message');
    const stageDisplay = document.getElementById('stage-display');

    function initializeGame() {
        correctPassword = stagePasswords[currentStage];
        currentLetters = [0, 0, 0, 0, 0];
        updateDisplay();
        document.getElementById('status').textContent = '';
        errorMessage.classList.remove('show');
        completionMessage.classList.remove('show');
        stageDisplay.textContent = `КОД ${currentStage + 1}`;
        canInteract = true;
    }

    function changeLetter(position, direction) {
        if (!canInteract) return;
        moveSound.currentTime = 0;
        moveSound.play().catch(error => {
            console.error('Error playing move sound:', error);
        });
        const maxIndex = possibleLetters[position - 1].length - 1;
        currentLetters[position - 1] = (currentLetters[position - 1] + direction + maxIndex + 1) % (maxIndex + 1);
        updateDisplay();
    }

    function updateDisplay() {
        for (let i = 1; i <= 5; i++) {
            document.getElementById(`letter${i}`).textContent = possibleLetters[i - 1][currentLetters[i - 1]];
        }
    }

    function submitPassword() {
        if (!canInteract) return;
        const currentWord = currentLetters.map((index, i) => possibleLetters[i][index]).join('');
        if (currentWord === correctPassword) {
            successSound.currentTime = 0;
            successSound.play().catch(error => {
                console.error('Error playing success sound:', error);
            });
            document.getElementById('status').textContent = 'КРАСАВЕЛА';
            document.getElementById('status').style.color = '#0f0';
            canInteract = false;
            currentStage++;
            if (currentStage >= totalStages) {
                completionMessage.classList.add('show');
                setTimeout(() => {
                    completionMessage.classList.remove('show');
                    currentStage = 0;
                    initializeGame();
                }, 5000); // 5-second delay for completion message
            } else {
                setTimeout(initializeGame, 2000); // 2-second delay for stage transition
            }
        } else {
            failSound.currentTime = 0;
            failSound.play().catch(error => {
                console.error('Error playing fail sound:', error);
            });
            errorMessage.classList.add('show');
            document.getElementById('status').textContent = '';
            canInteract = false;
            currentStage = 0; // Reset to Stage 1 on failure
            setTimeout(() => {
                errorMessage.classList.remove('show');
                initializeGame();
            }, 2000);
        }
    }

    // Add click and touch event listeners for buttons
    const buttons = [
        { id: 'up1', position: 1, direction: 1 },
        { id: 'down1', position: 1, direction: -1 },
        { id: 'up2', position: 2, direction: 1 },
        { id: 'down2', position: 2, direction: -1 },
        { id: 'up3', position: 3, direction: 1 },
        { id: 'down3', position: 3, direction: -1 },
        { id: 'up4', position: 4, direction: 1 },
        { id: 'down4', position: 4, direction: -1 },
        { id: 'up5', position: 5, direction: 1 },
        { id: 'down5', position: 5, direction: -1 },
        { id: 'submit-btn', action: submitPassword }
    ];

    buttons.forEach(button => {
        const element = document.getElementById(button.id);
        if (button.action) {
            element.addEventListener('click', button.action);
            element.addEventListener('touchstart', (e) => {
                e.preventDefault();
                button.action();
            });
        } else {
            element.addEventListener('click', () => changeLetter(button.position, button.direction));
            element.addEventListener('touchstart', (e) => {
                e.preventDefault();
                changeLetter(button.position, button.direction);
            });
        }
    });

    initializeGame();
});