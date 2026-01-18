# Quick Google Form Setup Reference

## TL;DR - Quick Steps

1. **Create Google Form** with 8 fields (in order):

   - Student Name
   - Email
   - Phone Number
   - Score
   - Total Questions
   - Percentage
   - Status
   - Answers (JSON)

2. **Get Form URL**: Copy from address bar and add `/formResponse` at end

3. **Get Entry IDs**:

   - Open form → Right-click → Inspect
   - Fill a test field
   - Check Network tab → Look for POST to google.com/forms
   - Copy entry IDs from payload

4. **Update `.env.local`**:

   ```bash
   GOOGLE_FORM_URL=your_url_here
   ENTRY_STUDENT_NAME=entry.xxxxx
   ENTRY_EMAIL=entry.xxxxx
   # ... etc
   ```

5. **Restart app** and test

## Visual Guide for Finding Entry IDs

```
In Network tab, you'll see:
POST https://docs.google.com/forms/d/e/FORM_ID/formResponse

Request Body shows:
entry.123456789=John Doe          → Student Name
entry.987654321=john@email.com    → Email
entry.555555555=+919876543210     → Phone
entry.444444444=12                → Score
entry.333333333=15                → Total Questions
entry.222222222=80                → Percentage
entry.111111111=PASSED            → Status
entry.666666666={"data"...}       → Answers (JSON)
```

## Common Mistakes to Avoid

❌ Wrong form URL format (missing `/formResponse`)  
❌ Entry IDs in wrong order  
❌ Form fields in different order than created  
❌ Not restarting the app after `.env.local` changes  
❌ Copying entry IDs from wrong request

## Verify It's Working

1. Submit a test exam
2. Go to Google Form → Responses tab
3. Should see new entry with student data
4. ✓ Done!

For detailed help, see `GOOGLE_FORM_SETUP.md`
