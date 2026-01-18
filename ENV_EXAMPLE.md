# Example .env.local Configuration

Here's a complete example showing how your `.env.local` should look after setup:

```bash
# Google Form Configuration for Exam Results

GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/1FAIpQLSd1234567890abcdefghijklmnop/formResponse

# Entry IDs from your Google Form (these are examples - replace with YOUR actual IDs)
ENTRY_STUDENT_NAME=entry.1234567890
ENTRY_EMAIL=entry.9876543210
ENTRY_PHONE=entry.5555555555
ENTRY_SCORE=entry.4444444444
ENTRY_TOTAL_QUESTIONS=entry.3333333333
ENTRY_PERCENTAGE=entry.2222222222
ENTRY_STATUS=entry.1111111111
ENTRY_ANSWERS=entry.6666666666
```

## How to Fill This In

### Your GOOGLE_FORM_URL:

1. Open your Google Form in edit mode
2. Copy the URL from address bar
3. Replace `/edit` at the end with `/formResponse`

**Example**:

- From: `https://docs.google.com/forms/d/e/1FAIpQLSd1234567890/edit`
- To: `https://docs.google.com/forms/d/e/1FAIpQLSd1234567890/formResponse`

### Your Entry IDs:

1. Open your form for filling (not edit mode)
2. Press F12 to open DevTools
3. Click "Network" tab
4. Fill in the first field
5. Look for POST request to docs.google.com/forms
6. In Request Body, you'll see entries like:
   ```
   entry.1234567890=John
   entry.9876543210=john@email.com
   ```
7. Extract just the entry ID number and enter it here

## Where to Put This File

Save this as `.env.local` in your project root:

```
/front-end/exam-system/.env.local
```

The file is already created with placeholder values. Just update them with your real values.

## Important Notes

⚠️ Keep this file safe - it contains your form URL  
⚠️ Don't commit to git - add to `.gitignore` if not already there  
⚠️ Restart your app after making changes to `.env.local`  
⚠️ All entry IDs are unique to your form - don't use examples

## Testing Your Configuration

1. Update `.env.local` with your values
2. Restart your dev server (`npm run dev`)
3. Submit a test exam through the application
4. Check your Google Form Responses - you should see your data

If nothing appears, check:

- [ ] `GOOGLE_FORM_URL` is correct and ends with `/formResponse`
- [ ] All entry IDs match your form fields
- [ ] Form fields are in the correct order
- [ ] Dev server was restarted after changing `.env.local`
