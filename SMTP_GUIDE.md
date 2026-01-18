# How to Get Email Credentials (SMTP) for "Forgot Password"

To allow your website to send emails (like password reset links), needed to "login" to an email account via code. This requires **SMTP Credentials**.

The easiest free way is to use a **Gmail** account with an **App Password**.

## Step 1: Enable 2-Factor Authentication (2FA)
(If you haven't already)
1. Go to your [Google Account Security Page](https://myaccount.google.com/security).
2. Under "How you sign in to Google", enable **2-Step Verification**.

## Step 2: Generate an App Password
1. Go back to the [Security Page](https://myaccount.google.com/security).
2. Search for "App Passwords" in the top search bar (or look under "2-Step Verification").
3. Name the app "Bloom Branding Website".
4. Click **Create**.
5. Google will show you a **16-character code** (e.g., `abcd efgh ijkl mnop`). **Copy this.**

## Step 3: Update your Backend Configuration
1. Open the file `backend/.env` in your project.
2. Add (or update) these lines:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=YOUR_GMAIL_ADDRESS@gmail.com
SMTP_PASSWORD=PASTE_THE_16_CHAR_CODE_HERE
FROM_EMAIL=YOUR_GMAIL_ADDRESS@gmail.com
FROM_NAME=Bloom Branding
```

3. **Save** the file.
4. **Restart** your backend server (Stop it with `Ctrl+C` and run `npm run dev` again).

## Step 4: Test
Go to your `Client Login` page, click "Forgot Password", and try sending an email!
