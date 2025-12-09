# Life Wheel Quiz - 3 Minute Life Score Assessment

A psychologically-focused, emotion-anchored life assessment tool that helps users evaluate their life satisfaction across 5 key dimensions: Money, Health, Mindset, Relationships, and Spirituality.

## Features

- **Emotion-Focused Questions**: Questions are framed to lead with pain points ("Over the past year, I felt...") with 1 anchored to the most extreme negative emotion
- **Mobile-Optimized**: Fully responsive design that works seamlessly on phones without scrolling
- **One Question Per Page**: Clean, distraction-free interface with slider-based answers
- **Front-Loaded Progress Bar**: Early questions contribute more to progress for better user motivation
- **Interactive Results**: Beautiful life wheel visualization showing scores across all 5 categories
- **Save Results**: Download your results as an image for future reference
- **QR Code Integration**: Generate a circular QR code for video integration

## Quiz Categories

### 💰 Money (Financial Pain & Constraint)
- Control & Competence with finances
- Security & Relief from financial stress
- Perceived Fairness of income/opportunity

### 💪 Health (Physical Suffering & Limitation)
- Health Efficacy and control over outcomes
- Body Acceptance & Satisfaction
- Perceived Symptom Burden

### 🧠 Mindset (Inner Turmoil & Self-Doubt)
- Global Self-Esteem and worthiness
- Emotional Resilience
- Perceived Mastery & Autonomy

### 🤝 Relationships (Loneliness & Conflict)
- Perceived Social Support
- Relationship Quality & Harmony
- Intimacy & Vulnerability

### ✨ Spirituality (Existential Despair & Disconnection)
- Sense of Purpose
- Awe/Transcendence experiences
- Optimism & Hope

## Usage

### Running Locally

1. Clone this repository
2. Open `index.html` in a web browser
3. Fill in your information (BLV ID is optional)
4. Complete the 15-question assessment
5. View and save your results

### Deploying to Web

Upload all files to your web hosting:
- `index.html` - Main quiz application
- `styles.css` - Styling and design
- `quiz.js` - Quiz logic and functionality
- `qr-code.html` - QR code generator for video integration

### Generating QR Code for Videos

1. Deploy the quiz to a public URL
2. Open `qr-code.html` in a browser
3. Enter your quiz URL
4. Click "Generate QR Code"
5. Use screen capture (OBS, QuickTime, etc.) to record the circular QR code
6. Overlay this QR code on your video

Alternatively, access directly with URL parameter:
```
qr-code.html?url=https://yoursite.com/quiz
```

## Design

- **Color Scheme**: Blue (#2D5BFF) and Yellow (#FDB022) with clean, minimalistic design
- **Typography**: System fonts for fast loading and native feel
- **Inspired By**: Claude AI's clean, professional interface

## Technical Details

- Pure HTML, CSS, and JavaScript (no frameworks required)
- Uses html2canvas for image export functionality
- QRCode.js for QR code generation
- Canvas API for life wheel visualization
- Mobile-first responsive design

## Data Collection

The quiz collects:
- BLV ID (optional)
- First Name
- Email
- Answers to 15 questions (rated 1-10)

**Note**: Currently, data is only stored in the browser session. For permanent storage, integrate with your backend API.

## License

© Best Life Ventures

## Support

For questions or issues, contact Best Life Ventures support.