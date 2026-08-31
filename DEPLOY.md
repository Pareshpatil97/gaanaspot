# 🚀 Deploy GaanaSpot (FREE) — Step by Step

This guide will make GaanaSpot live on the internet in **~10 minutes**.
Everyone can play it from their phone/laptop — no installs needed.

**You need:** A computer with internet (just for setup — after that, anyone can play from any device)

---

## Step 1: Get a Free Database (MongoDB Atlas)

1. Go to **https://www.mongodb.com/cloud/atlas/register**
2. Sign up (free — use Google sign-in for speed)
3. Click **"Build a Database"** → Choose **FREE / M0** → Click **"Create"**
4. Set a username and password (remember these!) → Click **"Create User"**
5. Under "Where would you like to connect from?" → Click **"Allow Access from Anywhere"** → Click **"Add Entry"**
6. Click **"Finish and Close"**
7. On the next page, find your cluster and click **"Connect"** → Choose **"Drivers"**
8. Copy the connection string. It looks like:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
9. Replace `USERNAME` and `PASSWORD` with what you set in step 4
10. Add `/gaanaspot` before the `?` so it becomes:
    ```
    mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/gaanaspot?retryWrites=true&w=majority
    ```

**Save this string — you'll need it in Step 3.**

---

## Step 2: Push Code to GitHub

1. Go to **https://github.com** → Sign in (or create free account)
2. Click **"+"** (top right) → **"New repository"**
3. Name: `gaanaspot` → Make it **Public** → Click **"Create repository"**
4. On your computer, open Terminal and run:

```bash
cd /Users/ghanshyampatil/.gemini/antigravity/scratch/gaanaspot

git remote add origin https://github.com/YOUR_USERNAME/gaanaspot.git
git branch -M main
git push -u origin main
```

(Replace `YOUR_USERNAME` with your GitHub username)

---

## Step 3: Deploy on Render (FREE)

1. Go to **https://render.com** → Sign in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your **gaanaspot** GitHub repo
4. Fill in:
   - **Name:** `gaanaspot`
   - **Runtime:** `Node`
   - **Build Command:** `npm run render:build`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. Click **"Advanced"** → Add these **Environment Variables:**

   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | (paste your MongoDB string from Step 1) |
   | `JWT_SECRET` | `any-random-text-here-abc123xyz` |
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |

6. Click **"Create Web Service"**
7. Wait 2-3 minutes for it to build and deploy ⏳

---

## Step 4: Seed the Songs

After deploy is done, you need to add the 125 songs to the database. Open Terminal:

```bash
# Install dependencies locally (just for seeding)
cd /Users/ghanshyampatil/.gemini/antigravity/scratch/gaanaspot/server
npm install

# Set the MongoDB URI and seed
MONGODB_URI="your-mongodb-atlas-string-from-step-1" node seeds/seed.js
```

You should see:
```
MongoDB Connected for Seeding...
Deleted existing songs.
Inserted 125 songs.
Created admin user.
Seeding completed successfully!
```

---

## ✅ DONE!

Your app is now live at:

```
https://gaanaspot.onrender.com
```

(Render gives you a free URL like this)

**Share this link with anyone** — they just open it on their phone/laptop and play!

---

## 💡 Tips

- **First load might be slow** (30 seconds) — Render free tier sleeps after 15 min of no activity. After the first load, it's fast.
- **Custom domain:** You can add your own domain (like gaanaspot.com) in Render settings for free.
- **Songs:** To add more songs, edit `server/seeds/songData.js` and re-run the seed command.
- **Updates:** Just push new code to GitHub — Render auto-deploys.

---

## If Something Goes Wrong

| Problem | Fix |
|---------|-----|
| "Application error" on the URL | Check Render logs (Dashboard → your service → Logs) |
| "MongoDB connection failed" | Double-check your MONGODB_URI — make sure password is correct and `/gaanaspot` is in the URL |
| Songs not showing | Run the seed command again (Step 4) |
| Slow first load | Normal for free tier — wait 30 seconds |
