# 🌙 Night Campus

An anonymous campus social platform with antigravity UI aesthetics.

## ✨ Features

- 🎭 **Anonymous Posting** - Share thoughts without revealing identity
- 💬 **The Wall** - Campus-wide feed with rants, confessions, and advice
- 🎉 **Events** - Create and discover campus events
- 🤝 **Blind Matching** - Connect with people based on interests and vibes
- 🎨 **Antigravity UI** - Floating, glassmorphic design with smooth animations
- 🔐 **Google OAuth** - Secure authentication

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide Icons** - Icon library

### Backend
- **Django 6.0** - Python web framework
- **Django REST Framework** - API
- **Django Channels** - WebSocket support
- **SQLite** - Database (development)
- **JWT** - Authentication

## 🚀 Getting Started

### Prerequisites
- Python 3.14+
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd night-campus
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   # source .venv/bin/activate  # Mac/Linux
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. **Frontend Setup**
   ```bash
   cd frontend/next-app
   npm install
   npm run dev
   ```

4. **Environment Variables**
   
   Create `frontend/next-app/.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

### Running the App

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## 📱 Features Overview

### The Wall
- Post anonymously with different categories (Rant, Confession, Advice, Chaos)
- React with emojis
- Comment and engage
- Save posts for later

### Events
- Create and propose events
- Vote on event proposals
- RSVP to events
- Calendar view

### Blind Matching
- Match with people based on:
  - Shared interests
  - Brain type compatibility
  - Social energy levels
- **Sarcastic compatibility meters** with humorous labels
- Anonymous profiles until match is accepted
- In-app chat after matching

### Profile Customization
- Custom avatar builder
- Interests selection
- Brain type (Chaos, Delulu, WiFi, NPC, etc.)
- Social energy preferences

## 🎨 Design Philosophy

Night Campus features an **antigravity aesthetic**:
- Floating cards with soft shadows
- Glassmorphic elements
- Smooth, weightless animations
- Dark, cool-toned color palette
- Playful, sarcastic tone

## 📄 License

MIT License - feel free to use this project for learning!

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your campus!

---

Built with ❤️ for campus communities
