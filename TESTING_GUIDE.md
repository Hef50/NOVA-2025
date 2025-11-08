# Testing Guide for NOVA-2025

This guide explains how to test each stage of the NOVA-2025 project setup.

---

## Stage 1: Backend Setup

### Automated Test

Run the automated test script:

```bash
cd backend
python test_stage1.py
```

**Expected Output:** All tests should pass with ✅ checkmarks.

### Manual Test

1. Start the backend server:
   ```bash
   cd backend
   python -m uvicorn main:app --reload
   ```

2. Open your browser and navigate to:
   - **Root endpoint:** http://localhost:8000/
     - Should see: `{"hello": "world"}`
   
   - **API docs:** http://localhost:8000/docs
     - Should see interactive Swagger UI documentation

3. Test the chat endpoint:
   ```bash
   curl -X POST http://localhost:8000/chat_streaming -H "Content-Type: application/json" -d "{\"message\":\"test\"}"
   ```
   - Should return: `{"response":"This is a test from the backend"}`

---

## Stage 2: Frontend Setup

### Automated Test

Run the automated test script:

```bash
cd frontend
node test_stage2.js
```

**Expected Output:** All tests should pass with ✅ checkmarks.

### Manual Test

1. **Start the backend** (if not already running):
   ```bash
   cd backend
   python -m uvicorn main:app --reload
   ```

2. **Start the frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open the application:**
   - Navigate to http://localhost:5173 in your browser
   - You should see a clean chat interface with:
     - A messages container at the top (showing "Messages will appear here...")
     - An input field at the bottom
     - A blue "Send" button

4. **Test the chat functionality:**
   - Type a message in the input field (e.g., "Hello, this is a test!")
   - Click the "Send" button
   - The button should briefly change to "Sending..." and be disabled
   - Open the browser console (Press F12, then click "Console" tab)
   - You should see: `{response: 'This is a test from the backend'}`

5. **Verify the UI:**
   - The input field should clear after sending
   - The button should return to "Send" after the request completes
   - No errors should appear in the console

---

## Common Issues & Solutions

### Backend Issues

**Issue:** `ModuleNotFoundError: No module named 'fastapi'`
- **Solution:** Install dependencies: `pip install -r requirements.txt`

**Issue:** Port 8000 already in use
- **Solution:** Stop other processes using port 8000, or change the port:
  ```bash
  python -m uvicorn main:app --reload --port 8001
  ```
  (Remember to update the frontend URL in `ChatView.tsx`)

**Issue:** CORS errors in browser console
- **Solution:** Verify `allow_origins` in `backend/main.py` includes your frontend URL

### Frontend Issues

**Issue:** `npm: command not found`
- **Solution:** Install Node.js from https://nodejs.org/

**Issue:** Dependencies not installed
- **Solution:** Run `npm install` in the frontend directory

**Issue:** Port 5173 already in use
- **Solution:** Vite will automatically try the next available port (5174, 5175, etc.)

**Issue:** "Failed to fetch" or network errors
- **Solution:** 
  1. Verify backend is running on http://localhost:8000
  2. Check browser console for CORS errors
  3. Verify the URL in `ChatView.tsx` matches your backend URL

**Issue:** Tailwind CSS not working / styles not loading
- **Solution:** 
  1. Verify `postcss.config.js` exists
  2. Verify `tailwind.config.ts` exists
  3. Restart the dev server: Stop (Ctrl+C) and run `npm run dev` again

---

## Testing Checklist

### Stage 1 Backend ✓
- [ ] `test_stage1.py` passes all tests
- [ ] Backend starts without errors
- [ ] Root endpoint returns `{"hello": "world"}`
- [ ] `/docs` shows Swagger UI
- [ ] `/chat_streaming` returns test response

### Stage 2 Frontend ✓
- [ ] `test_stage2.js` passes all tests
- [ ] Frontend starts without errors
- [ ] Chat interface displays correctly
- [ ] Can type in input field
- [ ] Send button works
- [ ] Console shows backend response
- [ ] No errors in browser console

---

## Quick Test Commands

```bash
# Test everything at once (run from project root)

# Terminal 1 - Backend
cd backend && python test_stage1.py && python -m uvicorn main:app --reload

# Terminal 2 - Frontend  
cd frontend && node test_stage2.js && npm run dev
```

Then open http://localhost:5173 and test the chat!

---

## Next Steps

Once both Stage 1 and Stage 2 tests pass, you're ready to move on to:
- **Stage 3:** Implementing actual AI chat functionality
- **Stage 4:** Adding streaming responses
- **Stage 5:** Enhancing the UI with message history

---

**Need Help?**
- Check the console output for specific error messages
- Verify all dependencies are installed
- Ensure both servers are running simultaneously
- Check that ports 8000 (backend) and 5173 (frontend) are available

