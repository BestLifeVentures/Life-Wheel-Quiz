// Quiz Data Structure
const quizData = {
    categories: [
        {
            name: 'Money',
            icon: '💰',
            color: '#EC4899',
            questions: [
                {
                    text: 'felt about the daily anxiety and stress related to my financial survival (bills, debt, etc.).',
                    labelLeft: '...felt constant dread and deep stress over my financial future.',
                    labelRight: '...felt zero anxiety and consistent confidence in my financial security.'
                },
                {
                    text: 'believed about my competence to manage my money and make sound financial decisions.',
                    labelLeft: '...felt utterly incompetent and out of control with my money.',
                    labelRight: '...felt highly competent and fully in command of my financial choices.'
                },
                {
                    text: 'felt about whether my finances allowed me to pursue my most important life goals and desired experiences.',
                    labelLeft: '...felt completely constrained and prevented from pursuing my goals by money.',
                    labelRight: '...felt my finances fully supported all my life goals and desires.'
                }
            ]
        },
        {
            name: 'Health',
            icon: '💪',
            color: '#06B6D4',
            questions: [
                {
                    text: 'felt about my physical energy level and vitality during a typical day.',
                    labelLeft: '...felt perpetually exhausted and physically drained.',
                    labelRight: '...felt consistently vital and full of energy.'
                },
                {
                    text: 'believed about the reliable function of my body (mobility, strength, internal health).',
                    labelLeft: '...felt my body often failed me and was unreliable.',
                    labelRight: '...felt my body functioned perfectly and was highly reliable.'
                },
                {
                    text: 'felt about my physical appearance and how satisfied I was with the way I looked.',
                    labelLeft: '...felt intense disgust or dissatisfaction with my looks.',
                    labelRight: '...felt completely satisfied and proud of my physical appearance.'
                }
            ]
        },
        {
            name: 'Mindset',
            icon: '🧠',
            color: '#A855F7',
            questions: [
                {
                    text: 'believed about my current place and circumstances in life.',
                    labelLeft: '...believed I was completely off track or lost in life.',
                    labelRight: '...believed I was exactly where I needed to be and felt peace.'
                },
                {
                    text: 'felt about the emotions I experienced, even the difficult or negative ones.',
                    labelLeft: '...rejected or avoided the emotions I experienced.',
                    labelRight: '...felt I liked and accepted all the emotions I experienced.'
                },
                {
                    text: 'felt upon waking up about the day ahead.',
                    labelLeft: '...felt a sense of dread and was not excited for the day.',
                    labelRight: '...felt genuine excitement and readiness for the day ahead.'
                }
            ]
        },
        {
            name: 'Relationships',
            icon: '🤝',
            color: '#F97316',
            questions: [
                {
                    text: 'felt about the emotional safety and freedom to be my authentic self in my key relationships.',
                    labelLeft: '...felt I had to change myself or hide who I was to be accepted.',
                    labelRight: '...felt fully connected while remaining completely authentic.'
                },
                {
                    text: 'believed about having people available to do the activities and experiences I truly wanted to do.',
                    labelLeft: '...felt I never had anyone to share activities I desired with.',
                    labelRight: '...felt I always had people available to share desired experiences with.'
                },
                {
                    text: 'believed about the reliability of having someone truly there for me if I faced a major personal crisis.',
                    labelLeft: '...believed I was completely alone and had no reliable support system.',
                    labelRight: '...believed I was completely supported and never alone in a crisis.'
                }
            ]
        },
        {
            name: 'Spirituality',
            icon: '✨',
            color: '#84CC16',
            questions: [
                {
                    text: 'felt about my faith, core beliefs, or philosophy guiding my life.',
                    labelLeft: '...felt I did not trust my faith or beliefs at all.',
                    labelRight: '...felt a deep, consistent trust in my faith and guiding beliefs.'
                },
                {
                    text: 'believed about whether the general flow of life and events worked in my favor.',
                    labelLeft: '...believed things were constantly working against me and felt like a victim.',
                    labelRight: '...believed things were always working in my favor and felt positive.'
                },
                {
                    text: 'felt about my connection to something greater than myself (nature, cosmos, divinity, humanity).',
                    labelLeft: '...felt profoundly disconnected and isolated from the rest of existence.',
                    labelRight: '...felt a powerful, consistent sense of connection and awe.'
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
    document.getElementById('question-text').textContent = 'This year, I...';
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

    // Draw center circle
    ctx.fillStyle = '#2D3139';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#3A3F4A';
    ctx.lineWidth = 2;
    ctx.stroke();
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
