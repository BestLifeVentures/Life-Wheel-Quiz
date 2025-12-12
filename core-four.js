// User data storage
let userData = {
    blvId: '',
    name: '',
    email: '',
    answers: {
        page2: ['', '', ''],
        page3: ['', '', ''],
        page4: ['', '', ''],
        page5: ['', '', '']
    }
};

// Speech recognition setup
let recognition = null;
let currentRecordingPage = null;
let currentRecordingQuestion = null;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }

        if (currentRecordingPage && currentRecordingQuestion) {
            const textareaId = `q${currentRecordingPage}-${currentRecordingQuestion}`;
            const textarea = document.getElementById(textareaId);
            if (textarea) {
                // Append to existing text
                if (finalTranscript) {
                    textarea.value = (textarea.value + ' ' + finalTranscript).trim();
                }
            }
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopRecording();
    };

    recognition.onend = () => {
        stopRecording();
    };
}

// Page navigation
function showPage(pageNum) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`page-${pageNum}`).classList.add('active');

    // Scroll to top
    window.scrollTo(0, 0);
}

function startSession() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!name || !email) {
        alert('Please enter your name and email to continue.');
        return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Store user data
    userData.blvId = document.getElementById('blv-id').value.trim();
    userData.name = name;
    userData.email = email;

    // Save to localStorage
    localStorage.setItem('coreFourUserData', JSON.stringify(userData));

    // Go to page 2
    showPage(2);
}

function nextPage(pageNum) {
    // Save answers from current page
    const currentPage = pageNum - 1;
    for (let i = 1; i <= 3; i++) {
        const answer = document.getElementById(`q${currentPage}-${i}`).value.trim();
        userData.answers[`page${currentPage}`][i - 1] = answer;
    }

    // Save to localStorage
    localStorage.setItem('coreFourUserData', JSON.stringify(userData));

    // Navigate to next page
    showPage(pageNum);
}

// Audio playback
function playAudio(pageNum) {
    const audio = document.getElementById(`audio-${pageNum}`);
    if (audio && audio.src) {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
            audio.currentTime = 0;
        }
    } else {
        alert('Audio file not yet uploaded. This functionality will be available once audio files are added.');
    }
}

// Voice recording
function recordAnswer(pageNum, questionNum) {
    if (!recognition) {
        alert('Speech recognition is not supported in your browser. Please type your answer instead.');
        return;
    }

    const button = event.target;
    const textareaId = `q${pageNum}-${questionNum}`;

    // If already recording, stop
    if (button.classList.contains('recording')) {
        stopRecording();
        return;
    }

    // Start recording
    currentRecordingPage = pageNum;
    currentRecordingQuestion = questionNum;

    try {
        recognition.start();
        button.classList.add('recording');
        button.textContent = 'Stop';
    } catch (error) {
        console.error('Error starting recognition:', error);
        alert('Could not start recording. Please try again.');
    }
}

function stopRecording() {
    if (recognition && currentRecordingPage && currentRecordingQuestion) {
        try {
            recognition.stop();
        } catch (error) {
            console.error('Error stopping recognition:', error);
        }

        // Reset button state
        const buttons = document.querySelectorAll('.btn-record.recording');
        buttons.forEach(button => {
            button.classList.remove('recording');
            button.textContent = 'Record';
        });

        currentRecordingPage = null;
        currentRecordingQuestion = null;
    }
}

// Summarization function
function summarizeText(text) {
    if (!text || text.trim().length === 0) {
        return '[No answer provided]';
    }

    // Simple summarization: limit to ~150 characters
    // In a production app, you might use an AI API for better summarization
    const words = text.trim().split(/\s+/);
    if (words.length <= 25) {
        return text.trim();
    }

    // Take first 25 words and add ellipsis if longer
    const summary = words.slice(0, 25).join(' ');
    return summary + '...';
}

// Generate results text
function generateResults() {
    const archetypes = {
        page2: 'The Warrior',
        page3: 'The Magician',
        page4: 'The Lover',
        page5: 'The Sage'
    };

    const questions = [
        'All you need to focus on is',
        'All you need to remember is',
        'All you need to do is'
    ];

    let resultsText = '';

    // Add each archetype's answers
    Object.keys(archetypes).forEach(pageKey => {
        const archetype = archetypes[pageKey];
        resultsText += `${archetype} says:\n`;

        userData.answers[pageKey].forEach((answer, index) => {
            const question = questions[index];
            const summary = summarizeText(answer);
            resultsText += `[${question}: ${summary}]\n`;
        });

        resultsText += '\n';
    });

    // Add AI prompt
    resultsText += 'You are an expert in psychology, human motivation, and behavior. here are my inner parts separated into 4 key guides. the warrior, the magician, the lover, the sage. Use the answers i give you to help me APPLY their advice in my daily life. for this conversation you are meant to ask questions only. state " I am only asking questions" and Instruct me to provide answers to your questions. Ask questions that will help me apply the advice given to my life based on my current circumstances and beliefs.';

    return resultsText;
}

// Copy results to clipboard
async function copyForAI() {
    // Save final answers
    for (let pageNum = 2; pageNum <= 5; pageNum++) {
        for (let i = 1; i <= 3; i++) {
            const answer = document.getElementById(`q${pageNum}-${i}`)?.value.trim() || '';
            userData.answers[`page${pageNum}`][i - 1] = answer;
        }
    }

    const resultsText = generateResults();

    // Show preview
    document.getElementById('results-preview').textContent = resultsText;

    // Copy to clipboard
    try {
        await navigator.clipboard.writeText(resultsText);
        alert('Results copied to clipboard! Paste into your AI assistant (we recommend Gemini).');
    } catch (error) {
        console.error('Failed to copy:', error);
        // Fallback method
        const textarea = document.createElement('textarea');
        textarea.value = resultsText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            alert('Results copied to clipboard! Paste into your AI assistant (we recommend Gemini).');
        } catch (err) {
            alert('Failed to copy. Please manually select and copy the text below.');
        }
        document.body.removeChild(textarea);
    }
}

// Download results as text file
function downloadResults() {
    // Save final answers
    for (let pageNum = 2; pageNum <= 5; pageNum++) {
        for (let i = 1; i <= 3; i++) {
            const answer = document.getElementById(`q${pageNum}-${i}`)?.value.trim() || '';
            userData.answers[`page${pageNum}`][i - 1] = answer;
        }
    }

    const resultsText = generateResults();

    // Show preview
    document.getElementById('results-preview').textContent = resultsText;

    // Create download
    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `core-four-results-${userData.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Load saved data on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedData = localStorage.getItem('coreFourUserData');
    if (savedData) {
        try {
            userData = JSON.parse(savedData);

            // Restore form values if present
            if (userData.blvId) document.getElementById('blv-id').value = userData.blvId;
            if (userData.name) document.getElementById('name').value = userData.name;
            if (userData.email) document.getElementById('email').value = userData.email;

            // Restore answers
            for (let pageNum = 2; pageNum <= 5; pageNum++) {
                for (let i = 1; i <= 3; i++) {
                    const textareaId = `q${pageNum}-${i}`;
                    const textarea = document.getElementById(textareaId);
                    if (textarea && userData.answers[`page${pageNum}`]) {
                        textarea.value = userData.answers[`page${pageNum}`][i - 1] || '';
                    }
                }
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }
});

// Prevent losing data on page refresh
window.addEventListener('beforeunload', (event) => {
    // Save any current page answers
    const currentPage = document.querySelector('.page.active');
    if (currentPage) {
        const pageId = currentPage.id;
        const pageNum = parseInt(pageId.split('-')[1]);

        if (pageNum >= 2 && pageNum <= 5) {
            for (let i = 1; i <= 3; i++) {
                const answer = document.getElementById(`q${pageNum}-${i}`)?.value.trim() || '';
                userData.answers[`page${pageNum}`][i - 1] = answer;
            }
            localStorage.setItem('coreFourUserData', JSON.stringify(userData));
        }
    }
});
