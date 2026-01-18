# Online Exam System

A secure, fullscreen-based online examination platform built with Next.js, featuring anti-cheating measures, real-time timer, and automated WhatsApp result notifications.

## Features

✅ **15 Objective Questions** - Multiple choice exam format
✅ **45-Minute Timer** - Real-time countdown with visual warnings
✅ **Fullscreen Mode** - Exam runs in fullscreen, prevents tab switching
✅ **Copy Protection** - Prevents copying, screenshots, and right-click context menu
✅ **Anti-Cheating Measures**:
   - Blocks Ctrl+C, Ctrl+X, Ctrl+A
   - Detects window/tab switching
   - Auto-submits after multiple attempts to exit
   - Prevents browser shortcuts

✅ **WhatsApp Result Notification** - Results automatically sent via WhatsApp
✅ **Question Navigation** - Jump between questions easily
✅ **Answer Summary** - Visual indicator of answered questions
✅ **Responsive Design** - Works on desktop browsers
✅ **Real-time Score Calculation** - Instant result display

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Notifications**: Twilio (WhatsApp)
- **Authentication**: N/A (can be added)

## Installation

1. **Clone or download the project**
   ```bash
   cd exam-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Twilio credentials:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## WhatsApp Integration Setup

### Using Twilio (Recommended)

1. **Sign up for Twilio**: https://www.twilio.com/console
2. **Get your credentials**:
   - Account SID
   - Auth Token
3. **Set up WhatsApp Sandbox**:
   - Go to Twilio Console → Messaging → WhatsApp
   - Join the sandbox with the provided code
4. **Get your WhatsApp number** from the sandbox
5. **Add to `.env.local`**
6. **Uncomment Twilio code** in `app/api/submit-exam/route.ts`

### Alternative Services
You can also integrate:
- **WhatsApp Business API**
- **AWS SNS**
- **Firebase Cloud Messaging**

## Project Structure

```
exam-system/
├── app/
│   ├── api/
│   │   └── submit-exam/
│   │       └── route.ts          # API for result submission
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main exam page
├── components/
│   ├── Question.tsx              # Question component with copy protection
│   └── Timer.tsx                 # Countdown timer
├── lib/
│   ├── questions.ts              # Questions database
│   └── fullscreen.ts             # Fullscreen utilities
├── public/                       # Static files
├── .env.example                  # Environment variables template
├── next.config.ts                # Next.js config
├── tailwind.config.ts            # Tailwind CSS config
└── tsconfig.json                 # TypeScript config
```

## Usage

### Starting an Exam

1. Click "Start Exam" button
2. Grant fullscreen permission
3. Answer all 15 questions within 45 minutes
4. Click "Finish Exam" when done
5. Enter your name and WhatsApp number
6. Click "Submit & Get Results"
7. Your result will be sent via WhatsApp

### Exam Rules

- **Timer**: Once started, cannot be paused
- **Fullscreen**: Exam runs in fullscreen mode
- **Navigation**: Use Previous/Next buttons or question number buttons
- **Copy Protection**: Copying questions is blocked
- **Tab Switching**: Switching tabs will show warnings
- **Auto-Submit**: Multiple exits will auto-submit exam

## Customization

### Add More Questions

Edit `lib/questions.ts`:

```typescript
export const questions: Question[] = [
  {
    id: 1,
    question: "Your question here?",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    correctAnswer: 2, // Index of correct option (0-based)
  },
  // Add more questions...
];
```

### Change Timer Duration

In `app/page.tsx`, modify the Timer component:
```typescript
<Timer totalMinutes={45} onTimeUp={handleTimeUp} />
// Change 45 to desired minutes
```

### Styling

All styles use Tailwind CSS. Modify colors in `components/Question.tsx` and `app/page.tsx`:

```typescript
className="bg-blue-600 hover:bg-blue-700" // Change colors here
```

## API Reference

### POST /api/submit-exam

Submit exam answers and send WhatsApp notification.

**Request Body:**
```json
{
  "phoneNumber": "+91XXXXXXXXXX",
  "userName": "Student Name",
  "score": 12,
  "totalQuestions": 15,
  "answers": [
    {
      "questionId": 1,
      "selectedAnswer": 2,
      "correctAnswer": 2,
      "isCorrect": true
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Exam submitted successfully",
  "score": 12,
  "totalQuestions": 15,
  "percentage": 80,
  "status": "PASSED"
}
```

## Security Features

1. **Copy Protection**
   - Disabled right-click context menu
   - Blocked keyboard shortcuts (Ctrl+C, Ctrl+X, Ctrl+A)
   - Text selection disabled

2. **Anti-Tab Switching**
   - Detects visibility changes
   - Shows warnings
   - Auto-submits after 3 attempts

3. **Fullscreen Enforcement**
   - Exam only runs in fullscreen mode
   - Browser UI is hidden

4. **Data Protection**
   - No local storage of sensitive data
   - Server-side validation
   - HTTPS recommended for production

## Browser Compatibility

- ✅ Chrome/Edge 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Opera 47+

**Note**: Fullscreen API support may vary. Test on target browsers.

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Visit https://vercel.com
3. Import the repository
4. Add environment variables
5. Deploy

### Deploy to Other Platforms

- **Netlify**: Build command: `npm run build`, Publish: `.next`
- **AWS**: Use Amplify or EC2 with Node.js
- **Docker**: Use the provided Dockerfile

## Troubleshooting

### Fullscreen not working?
- Check browser permissions
- Some browsers block fullscreen from non-HTTPS
- Try a different browser

### WhatsApp message not sending?
- Verify Twilio credentials
- Check account balance
- Verify WhatsApp number format
- Check logs in `console.log`

### Timer issues?
- Clear browser cache
- Check system time
- Restart browser

## Performance Optimization

- Lazy loading enabled
- Image optimization
- Code splitting
- CSS purging

## Future Enhancements

- [ ] User authentication
- [ ] Detailed analytics dashboard
- [ ] Multiple exam categories
- [ ] Question randomization
- [ ] Negative marking
- [ ] Section-wise time limits
- [ ] Admin panel

## License

MIT License - Feel free to use this project

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the code comments
3. Check browser console for errors

## Author

Created with ❤️ for secure online examinations
