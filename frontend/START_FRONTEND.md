# How to Start the Frontend

## Quick Start

1. **Stop any running dev servers** (Press `Ctrl+C` in the terminal where `npm run dev` is running)

2. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

3. **Start the dev server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Go to http://localhost:5173
   - You should see the chat interface

## If You Get Errors

### Error: "vite is not recognized"
**Solution:** Run `npm install` first
```bash
npm install
npm run dev
```

### Error: Tailwind CSS / PostCSS errors
**Solution:** The app is configured to work without Tailwind for now
- Just press `Escape` to dismiss the error overlay
- The app will work with inline styles

### Error: Blank page or "Failed to load resource"
**Solution:** Clear the cache and restart
```bash
# Stop the dev server (Ctrl+C)
# Delete the Vite cache
Remove-Item -Recurse -Force node_modules\.vite
# Restart
npm run dev
```

## Testing the App

1. Make sure the **backend is running**:
   ```bash
   cd backend
   python -m uvicorn main:app --reload
   ```

2. Open http://localhost:5173

3. Type a message and click "Send"

4. Open browser console (F12) and verify you see:
   ```
   {response: 'This is a test from the backend'}
   ```

## Current Status

- ✅ React + Vite setup complete
- ✅ @tanstack/react-query configured  
- ✅ axios installed
- ✅ ChatView component created
- ✅ API integration working
- ⚠️ Tailwind CSS temporarily disabled (inline styles used instead)
- ✅ shadcn/ui Button and Input components installed (ready for when Tailwind is fixed)

The app is **fully functional** for testing Stage 2 requirements!

