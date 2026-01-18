# Google Forms Setup Guide for Exam Results

This exam system now uses **Google Forms** (free, no paid service required) to store all exam submissions.

## Step-by-Step Setup

### Step 1: Create a Google Form

1. Go to [Google Forms](https://forms.google.com)
2. Click "Create New Form" → "Blank Form"
3. Name your form (e.g., "Exam Results")
4. Add the following fields in this exact order:

| Field Type   | Field Name      | Description                            |
| ------------ | --------------- | -------------------------------------- |
| Short answer | Student Name    | Name of the student                    |
| Short answer | Email           | Email of the student                   |
| Short answer | Phone Number    | Interviewer's phone number             |
| Short answer | Score           | Number of correct answers              |
| Short answer | Total Questions | Total questions in exam                |
| Short answer | Percentage      | Score percentage                       |
| Short answer | Status          | PASSED or FAILED                       |
| Paragraph    | Answers (JSON)  | Detailed answer details in JSON format |

### Step 2: Get Your Form ID

1. Open your Google Form in edit mode
2. Look at the URL in the address bar:
   ```
   https://docs.google.com/forms/d/e/1FAIpQLSd1234567890abc/edit
                                 ^^^^^^^^^^^^^^^^^^^^
                                 This is your FORM_ID
   ```
3. Your complete form submission URL will be:
   ```
   https://docs.google.com/forms/d/e/1FAIpQLSd1234567890abc/formResponse
   ```

### Step 3: Get Entry IDs for Each Field

This is the tricky part but it's easy once you know the steps:

1. **Open your form in a new tab** (not edit mode, but as if you're filling it)

   - You can get the link by clicking "Send" → Copy the sharing link

2. **Open Developer Tools**: Press `F12` on your keyboard

3. **Go to the Network tab** in Developer Tools

4. **Fill in one field** in the form (e.g., type "Test" in Student Name)

5. **Look at Network tab** - you should see requests appearing

6. **Find the form submission request**:

   - Look for a request to `docs.google.com/forms/d/e/...`
   - Click on it → Go to "Payload" or "Request Body" tab

7. **Copy the Entry IDs**:

   - You'll see something like this in the payload:

   ```
   entry.123456789=Test
   entry.987654321=test@example.com
   entry.555555555=9876543210
   entry.444444444=10
   entry.333333333=15
   entry.222222222=67
   entry.111111111=PASSED
   entry.666666666={"questionId":1,...}
   ```

8. **Match Entry IDs to Fields**:
   - The order matches the order you created your form fields
   - First field (Student Name) = first entry.xxxxx
   - Second field (Email) = second entry.xxxxx
   - And so on...

### Step 4: Configure Your Environment

1. Open `.env.local` file in your project root

2. Update with your values:

```bash
GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse

ENTRY_STUDENT_NAME=entry.123456789
ENTRY_EMAIL=entry.987654321
ENTRY_PHONE=entry.555555555
ENTRY_SCORE=entry.444444444
ENTRY_TOTAL_QUESTIONS=entry.333333333
ENTRY_PERCENTAGE=entry.222222222
ENTRY_STATUS=entry.111111111
ENTRY_ANSWERS=entry.666666666
```

### Step 5: Restart Your Application

```bash
# Stop your dev server (Ctrl+C)
# Then restart it
npm run dev
```

## Verification

1. **Submit a test exam** through your application
2. **Check your Google Form responses**:
   - Go to your Google Form in edit mode
   - Click "Responses" tab
   - You should see your test submission there

## Advantages of Google Forms

✅ **Free** - No paid services required  
✅ **Easy to use** - Simple interface to view responses  
✅ **Automatic spreadsheet** - Google creates a spreadsheet automatically  
✅ **Accessible** - View from anywhere with Google account  
✅ **Shareable** - Can share form responses with others  
✅ **Download data** - Export responses as CSV/Excel  
✅ **No limits** - Unlimited responses

## Troubleshooting

### "Data not being submitted to Google Form"

- Check if `GOOGLE_FORM_URL` is set correctly in `.env.local`
- Check browser console for any errors
- Verify entry IDs are correct
- Make sure form fields are in the same order as listed above

### "Entry IDs not found"

- Clear your browser cache
- Use Incognito/Private window to test
- Double-check the Network tab for the POST request
- Make sure you're looking at the correct form response URL

### "Form submission works but entries are empty"

- Entry IDs might be wrong
- Field order in form might be different
- Re-follow Step 3 to get correct entry IDs

## Data View in Google Forms

Once submissions start coming in:

1. Open your Google Form
2. Click "Responses" tab
3. You can:
   - View individual responses
   - See summary statistics
   - Download as CSV/Excel
   - View connected spreadsheet

## Additional Notes

- The JSON answers field contains detailed information about each question
- You can analyze data directly in Google Sheets if needed
- Google Forms automatically creates a linked Google Sheet with all responses
- Data is stored securely in your Google account
- You have full control over the data

---

**Questions?** Check the `.env.local` file comments for additional help.
