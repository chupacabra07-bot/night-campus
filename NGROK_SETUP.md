# 🌐 Ngrok Setup Guide - Night Campus

## What is Ngrok?
Ngrok creates secure public URLs for your local development servers, allowing anyone on the internet to access your app.

---

## 📋 Quick Start

### Step 1: Start Your Servers (Already Running ✅)
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

### Step 2: Start Ngrok Tunnels

**Option A: Double-click the batch file**
```
start-ngrok.bat
```

**Option B: Run manually**
```bash
ngrok start --all --config ngrok.yml
```

### Step 3: Get Your Public URLs

After starting ngrok, you'll see output like:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:3000
Forwarding  https://def456.ngrok-free.app -> http://localhost:8000
```

**Copy these URLs!**

---

## 🔧 Update Frontend API URL

Once you have the backend ngrok URL, update your frontend to use it:

1. Open: `frontend/next-app/.env.local`
2. Add/update:
   ```
   NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-NGROK-URL.ngrok-free.app
   ```
3. Restart your Next.js dev server

---

## 📱 Share with Friends

Send your friends the **frontend ngrok URL**:
```
https://abc123.ngrok-free.app
```

They can access it from:
- Any device (phone, tablet, laptop)
- Any location (doesn't need to be on same WiFi)
- Any browser

---

## ⚠️ Important Notes

### Free Tier Limitations:
- URLs change every time you restart ngrok
- Session timeout after 2 hours of inactivity
- Ngrok warning page before accessing (users can click "Visit Site")

### Keep Running:
- Don't close the ngrok terminal window
- Keep frontend and backend servers running
- If you restart ngrok, URLs will change (share new URLs)

### Security:
- Free ngrok URLs are public (anyone with link can access)
- Don't share sensitive data
- This is for testing only, not production

---

## 🎯 Troubleshooting

### "Tunnel not found"
- Make sure frontend (3000) and backend (8000) are running first
- Check ngrok.yml configuration

### "502 Bad Gateway"
- Backend server might have crashed
- Check Django terminal for errors

### Friends can't access
- Make sure you shared the correct frontend URL
- They might need to click "Visit Site" on ngrok warning page
- Check if ngrok tunnel is still active

### CORS Errors
- Already configured! Should work out of the box
- If issues persist, check browser console

---

## 📊 Monitor Ngrok

Visit the ngrok dashboard while running:
```
http://localhost:4040
```

See all requests, inspect traffic, and debug issues.

---

## 🚀 Alternative: Ngrok Account (Recommended)

Sign up for free at: https://ngrok.com

Benefits:
- Custom domains (e.g., `nightcampus.ngrok.app`)
- Longer session times
- No warning page for users
- Better performance

After signup:
1. Get your authtoken
2. Run: `ngrok config add-authtoken YOUR_TOKEN`
3. Use the same commands as above

---

## 🎉 You're Ready!

1. ✅ Servers running
2. ✅ Ngrok configured
3. ✅ Django settings updated
4. 🚀 Run `start-ngrok.bat`
5. 📤 Share the frontend URL with friends!

---

**Need help?** Check the ngrok terminal output for your public URLs!
