// Quiz Data Structure
const quizData = {
    categories: [
        {
            name: 'Money',
            icon: '💰',
            color: '#EC4899',
            questions: [
                {
                    text: 'felt about my ability to manage my money and handle unexpected expenses...',
                    labelLeft: '...felt completely out of control and financially helpless.',
                    labelRight: '...felt highly competent and always in command of my financial situation.'
                },
                {
                    text: 'felt about the relief and security of my current finances covering my needs and plans...',
                    labelLeft: '...felt constantly stressed and terrified that my finances were inadequate for my basic needs.',
                    labelRight: '...felt consistently secure and calm about my current and future financial status.'
                },
                {
                    text: 'believed about the fairness of my income and opportunity...',
                    labelLeft: '...believed my financial situation was profoundly unfair and felt deep resentment.',
                    labelRight: '...believed my financial situation was completely fair and felt deep satisfaction.'
                }
            ]
        },
        {
            name: 'Health',
            icon: '💪',
            color: '#06B6D4',
            questions: [
                {
                    text: 'believed about the impact of my choices (diet, sleep, exercise) on my physical well-being...',
                    labelLeft: '...believed my health outcomes were out of my hands and felt powerless to change them.',
                    labelRight: '...believed my health outcomes were strongly within my control and felt empowered by my choices.'
                },
                {
                    text: 'felt about the physical appearance and capabilities of my body...',
                    labelLeft: '...felt deeply ashamed and consistently judged my body negatively.',
                    labelRight: '...felt deep acceptance and consistently appreciated my body\'s form and function.'
                },
                {
                    text: 'experienced discomfort, low energy, or pain in my daily physical life...',
                    labelLeft: '...felt severely handicapped and consistently drained by physical discomfort and lack of energy.',
                    labelRight: '...felt consistently energetic and rarely experienced any significant physical discomfort.'
                }
            ]
        },
        {
            name: 'Mindset',
            icon: '🧠',
            color: '#A855F7',
            questions: [
                {
                    text: 'felt about my worthiness and equality compared to others...',
                    labelLeft: '...felt fundamentally worthless and undeserving of basic happiness or good treatment.',
                    labelRight: '...felt profoundly worthy and deserving of all the happiness life has to offer.'
                },
                {
                    text: 'felt about my ability to recover from setbacks or strong negative emotions...',
                    labelLeft: '...felt completely overwhelmed and incapable of recovering from emotional challenges.',
                    labelRight: '...felt highly resilient and confident in my ability to manage and recover from any emotional distress.'
                },
                {
                    text: 'felt about my influence over my life\'s path...',
                    labelLeft: '...felt utterly powerless and trapped by external circumstances controlling my life.',
                    labelRight: '...felt highly powerful and confident in my ability to shape my life\'s decisions and direction.'
                }
            ]
        },
        {
            name: 'Relationships',
            icon: '🤝',
            color: '#F97316',
            questions: [
                {
                    text: 'believed about the availability of people who would reliably be there for me in a major crisis...',
                    labelLeft: '...believed I was completely alone and doubted anyone would truly stand by me in a crisis.',
                    labelRight: '...believed I was completely surrounded by reliable people who would support me no matter what.'
                },
                {
                    text: 'experienced in my key relationships regarding mutual respect and understanding...',
                    labelLeft: '...experienced frequent and deep conflict and felt highly misunderstood in my key relationships.',
                    labelRight: '...experienced consistent harmony and felt deeply respected and understood in my key relationships.'
                },
                {
                    text: 'felt about being completely open and vulnerable with people close to me...',
                    labelLeft: '...felt I had to hide my true self and felt emotionally isolated from others.',
                    labelRight: '...felt I could be consistently vulnerable and deeply connected to others without any fear of judgment.'
                }
            ]
        },
        {
            name: 'Spirituality',
            icon: '✨',
            color: '#84CC16',
            questions: [
                {
                    text: 'felt about the value and purpose of my life and the activities I engaged in...',
                    labelLeft: '...felt my life was fundamentally meaningless, aimless, and I lacked any compelling purpose.',
                    labelRight: '...felt my life had a clear, profound purpose that motivated my every action.'
                },
                {
                    text: 'experienced a sense of wonder, awe, or connection to something vast and inspiring...',
                    labelLeft: '...felt life was monotonous and I rarely experienced true wonder or deep spiritual connection.',
                    labelRight: '...frequently experienced moments of awe and felt deeply connected to a higher power or the universe.'
                },
                {
                    text: 'felt about my own future and the future of the world around me...',
                    labelLeft: '...felt consistently hopeless and deeply pessimistic about both my personal future and the world\'s direction.',
                    labelRight: '...felt consistently hopeful and fundamentally optimistic about my future and the world\'s progress.'
                }
            ]
        }
    ]
};

// Quiz State
let currentQuestionIndex = 0;
let answers = [];
let userData = {};

// Flatten all questions for easier navigation
const allQuestions = [];
quizData.categories.forEach((category, catIndex) => {
    category.questions.forEach((question, qIndex) => {
        allQuestions.push({
            categoryIndex: catIndex,
            questionIndex: qIndex,
            category: category.name,
            icon: category.icon,
            color: category.color,
            ...question
        });
    });
});

// Progress bar weights - front-loaded
const progressWeights = [
    10, 10, 10,  // First 3 questions: 30% total
    8, 8, 8,     // Next 3: 24% total
    6, 6, 6,     // Next 3: 18% total
    5, 5, 5,     // Next 3: 15% total
    4.33, 4.33, 4.34  // Last 3: ~13% total
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Handle intro form submission
    document.getElementById('intro-form').addEventListener('submit', (e) => {
        e.preventDefault();
        userData = {
            blvId: document.getElementById('blv-id').value,
            firstName: document.getElementById('first-name').value,
            email: document.getElementById('email').value
        };
        startQuiz();
    });

    // Initialize with default value
    answers = new Array(allQuestions.length).fill(5);
});

// Add slider auto-advance functionality
function initSlider() {
    const slider = document.getElementById('answer-slider');
    let hasInteracted = false;

    // Auto-advance on change (after user interaction)
    slider.addEventListener('change', (e) => {
        if (hasInteracted) {
            setTimeout(() => {
                nextQuestion();
            }, 300);
        }
    });

    // Track that user has interacted
    slider.addEventListener('input', (e) => {
        hasInteracted = true;
    });

    // Reset interaction flag when question changes
    slider.addEventListener('questionChanged', () => {
        hasInteracted = false;
    });
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function startQuiz() {
    showScreen('quiz-screen');
    currentQuestionIndex = 0;
    initSlider();
    displayQuestion();
    updateProgress();
}

function displayQuestion() {
    const question = allQuestions[currentQuestionIndex];

    // Update content
    document.getElementById('category-icon').textContent = question.icon;
    document.getElementById('category-title').textContent = question.category;
    document.getElementById('question-text').textContent = 'Over the past year, I ' + question.text;
    document.getElementById('label-left').textContent = question.labelLeft;
    document.getElementById('label-right').textContent = question.labelRight;

    // Set slider value
    const slider = document.getElementById('answer-slider');
    slider.value = answers[currentQuestionIndex];

    // Dispatch custom event to reset interaction tracking
    slider.dispatchEvent(new Event('questionChanged'));

    // Update buttons
    const backButton = document.getElementById('back-button');

    if (currentQuestionIndex === 0) {
        backButton.style.visibility = 'hidden';
    } else {
        backButton.style.visibility = 'visible';
    }
}


function updateProgress() {
    let totalProgress = 0;
    for (let i = 0; i <= currentQuestionIndex; i++) {
        totalProgress += progressWeights[i];
    }

    document.getElementById('progress-fill').style.width = totalProgress + '%';
}

function nextQuestion() {
    // Save current answer
    const slider = document.getElementById('answer-slider');
    answers[currentQuestionIndex] = parseInt(slider.value);

    if (currentQuestionIndex < allQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
        updateProgress();
    } else {
        showResults();
    }
}

function goBack() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
        updateProgress();
    }
}

function showResults() {
    // Calculate category averages
    const categoryScores = quizData.categories.map((category, catIndex) => {
        const startIdx = catIndex * 3;
        const categoryAnswers = answers.slice(startIdx, startIdx + 3);
        const average = categoryAnswers.reduce((sum, val) => sum + val, 0) / categoryAnswers.length;
        return {
            name: category.name,
            icon: category.icon,
            color: category.color,
            score: average.toFixed(1)
        };
    });

    // Display category scores
    const scoresHTML = categoryScores.map(cat => `
        <div class="score-item">
            <h4>${cat.icon} ${cat.name}</h4>
            <div class="score">${cat.score}</div>
        </div>
    `).join('');
    document.getElementById('category-scores').innerHTML = scoresHTML;

    // Draw wheel chart
    drawWheelChart(categoryScores);

    // Show results screen
    showScreen('results-screen');
    document.getElementById('progress-fill').style.width = '100%';
}

function drawWheelChart(categoryScores) {
    const canvas = document.getElementById('results-canvas');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = 220;

    // Clear canvas with dark background
    ctx.fillStyle = '#23272F';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background circles
    ctx.strokeStyle = '#3A3F4A';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 10; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (maxRadius / 10) * i, 0, 2 * Math.PI);
        ctx.stroke();
    }

    // Draw spokes
    const numCategories = categoryScores.length;
    const angleStep = (2 * Math.PI) / numCategories;

    ctx.strokeStyle = '#3A3F4A';
    ctx.lineWidth = 1;
    for (let i = 0; i < numCategories; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + maxRadius * Math.cos(angle);
        const y = centerY + maxRadius * Math.sin(angle);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    // Draw data polygon with gradient
    ctx.beginPath();
    categoryScores.forEach((cat, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const radius = (cat.score / 10) * maxRadius;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.closePath();

    // Fill with gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
    gradient.addColorStop(0, 'rgba(212, 165, 116, 0.25)');
    gradient.addColorStop(1, 'rgba(212, 165, 116, 0.08)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Stroke the polygon
    ctx.strokeStyle = '#D4A574';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw points with glow effect - all same yellow color
    categoryScores.forEach((cat, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const radius = (cat.score / 10) * maxRadius;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        // Glow
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#D4A574';
        ctx.fillStyle = '#D4A574';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Dark center
        ctx.fillStyle = '#23272F';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });

    // Draw category labels and values
    ctx.fillStyle = '#F9FAFB';
    ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.textAlign = 'center';

    categoryScores.forEach((cat, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const labelRadius = maxRadius + 50;
        const x = centerX + labelRadius * Math.cos(angle);
        const y = centerY + labelRadius * Math.sin(angle);

        // Draw icon
        ctx.fillText(cat.icon, x, y - 10);

        // Draw name
        ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
        ctx.fillStyle = '#C1C7D0';
        ctx.fillText(cat.name, x, y + 8);

        // Draw score
        ctx.font = '700 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
        ctx.fillStyle = '#D4A574';
        ctx.fillText(cat.score, x, y + 28);

        // Reset font and color
        ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
        ctx.fillStyle = '#F9FAFB';
    });

    // Draw center circle with "RATE 1-10"
    ctx.fillStyle = '#2D3139';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#3A3F4A';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#C1C7D0';
    ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.textAlign = 'center';
    ctx.fillText('RATE', centerX, centerY - 5);
    ctx.fillText('1 - 10', centerX, centerY + 20);
}

function saveResults() {
    const resultsContainer = document.querySelector('.results-container');

    // Use html2canvas to capture the results
    html2canvas(resultsContainer, {
        backgroundColor: '#FFFFFF',
        scale: 2,
        logging: false
    }).then(canvas => {
        // Convert to blob and download
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `life-wheel-results-${userData.firstName || 'user'}-${Date.now()}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        });
    });
}
