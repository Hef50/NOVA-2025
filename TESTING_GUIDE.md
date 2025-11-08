# NOVA-2025 Testing Guide

## Quick Start

### Starting the Application

1. **Start Backend Server:**
   ```bash
   cd backend
   python main.py
   ```
   Backend should run on `http://localhost:8000`

2. **Start Frontend Development Server:**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend should run on `http://localhost:5173`

## Testing Each Feature

### 1. Plan New Trip Flow

#### Test: Date Requirement
1. Navigate to `/chat` (Plan New Trip)
2. **Expected:** Date pickers should appear first
3. **Expected:** Location search should NOT be visible until dates are selected
4. Select start and end dates
5. **Expected:** Location search should now appear with message "Please select your travel dates to continue" gone

#### Test: Location Search with Filters
1. After selecting dates, enter a search query (e.g., "beach vacation")
2. Click "Filters" button
3. Enter current location (e.g., "New York")
4. Adjust price range slider
5. Click "Apply Filters & Search"
6. **Expected:** AI should generate 10 destination recommendations based on filters
7. **Expected:** Each card should have an image, name, country, price, and highlights

#### Test: Unique Location Search
1. Search for a unique location like "Macao" or "Bhutan"
2. **Expected:** AI should generate recommendations even if not in local database
3. **Expected:** Results should be relevant to the search query

#### Test: Select Destination
1. Click on any destination card
2. **Expected:** "Continue to Activities" button should appear
3. Click "Continue to Activities"
4. **Expected:** Should navigate to activities page for the trip

### 2. Activities Page

#### Test: AI-Generated Activities
1. On the activities page, wait for activities to load
2. **Expected:** At least 5-10 activities should be displayed
3. **Expected:** Each activity should have an image, name, category, price level, and description
4. Use category filters (Adventure, Culture, Food, etc.)
5. **Expected:** Activities should filter by selected categories
6. Use price level filters (Free, Budget, Moderate, Luxury)
7. **Expected:** Activities should filter by selected price levels

#### Test: Add Activities to Trip
1. Click "Add to Trip" on several activities
2. **Expected:** Button should change to "Added" with checkmark
3. **Expected:** Selected activities should be saved to the trip

### 3. Schedule Page

#### Test: Weather Forecast
1. Navigate to Schedule page
2. **Expected:** Weather forecast section should display
3. **Expected:** 7-day forecast with icons, temperatures, and packing suggestions

#### Test: Schedule Creation
1. View the generated schedule
2. **Expected:** Activities should be organized by day
3. **Expected:** Each day should show date and planned activities

### 4. Booking Page

#### Test: Flight Deals Search
1. Navigate to Booking page
2. **Expected:** Should see "Flights" and "Hotels" tabs
3. On Flights tab, click "Search Deals" (or it auto-searches on load)
4. **Expected:** Loading animation with "Searching for the best flight deals..."
5. **Expected:** Animated cards showing booking sites being consulted (Expedia, Kayak, Skyscanner, Google Flights, Momondo)
6. After loading completes:
   - If deals found: List of deals with "Add to Budget" buttons
   - If no deals found: Fallback cards with direct links to booking sites

#### Test: Hotel Deals Search
1. Click "Hotels" tab
2. **Expected:** Same loading animation but for hotels
3. **Expected:** Different booking sites (Booking.com, Hotels.com, Expedia Hotels, Airbnb, Trivago)
4. **Expected:** Either deals or fallback cards with "Visit Site" buttons

#### Test: Add to Budget
1. If deals are found, click "Add to Budget" on any deal
2. **Expected:** Toast notification "Added to Budget"
3. Navigate to Budget page
4. **Expected:** Item should be in budget (check localStorage for pendingBudgetItem)

### 5. Budget Page

#### Test: Budget Tracking
1. Navigate to Budget page
2. **Expected:** Should see budget categories (Transport, Accommodation, Food, Activities, etc.)
3. Add expenses manually
4. **Expected:** Total budget should update
5. **Expected:** Expenses should be categorized correctly

### 6. Packing Page

#### Test: Packing List Generation
1. Navigate to Packing page
2. **Expected:** AI-generated packing list based on destination and dates
3. Check/uncheck items
4. **Expected:** Progress should update

#### Test: Image Upload Validation
1. Click "Upload Image" or similar button
2. Upload a photo of packed items
3. **Expected:** Loading state while AI analyzes image
4. **Expected:** Results showing:
   - Packed items with confidence scores (percentage and progress bar)
   - Missing items
   - Color-coded badges (green for high confidence, gray for lower)

### 7. Documents Page

#### Test: Visa Requirements
1. Navigate to Documents page
2. **Expected:** Visa Requirements section should load with spinner
3. After loading:
   - **Expected:** Visa status (Required/Not Required) with color coding
   - If required:
     - Visa type, processing time, cost in grid layout
     - List of required documents with checkmarks
     - Notes section with important information
     - "Visit Embassy Website" button
4. Click embassy website button
5. **Expected:** Opens new tab with embassy information

#### Test: Document Management
1. Click "Add Document"
2. Fill in document details (type, name, number, expiry date)
3. Click "Add"
4. **Expected:** Document appears in list
5. **Expected:** Documents expiring soon should have yellow background
6. **Expected:** Expired documents should have red background
7. Hover over document and click delete
8. **Expected:** Document should be removed

### 8. Done Page

#### Test: Completion Celebration
1. Navigate to Done page
2. **Expected:** Party popper animation
3. **Expected:** Trip summary with destination and dates
4. **Expected:** Completion progress circle showing percentage
5. **Expected:** Checklist of completed steps with icons and checkmarks

#### Test: Download Itinerary
1. Click "Download Itinerary"
2. **Expected:** Button shows "Downloading..."
3. **Expected:** .txt file downloads with trip summary
4. **Expected:** Toast notification "Downloaded!"

#### Test: Share Trip
1. Click "Share Trip"
2. **Expected:** Link copied to clipboard
3. **Expected:** Toast notification "Link Copied!"

#### Test: Navigation Buttons
1. Click "Back to Dashboard"
2. **Expected:** Navigate to dashboard
3. Return to Done page
4. Click "Plan Another Trip"
5. **Expected:** Navigate to /chat (plan new trip page)

### 9. Navigation Testing

#### Test: TripSubNav Order
1. Create a trip and navigate through pages
2. **Expected:** Navigation bar should show tabs in this order:
   - Activities
   - Schedule
   - Booking
   - Budget
   - Packing
   - Documents
   - Done
3. **Expected:** Active tab should be highlighted with gradient
4. **Expected:** All tabs should be clickable and navigate correctly

### 10. Dark Mode Testing

#### Test: Dark Mode Persistence
1. Toggle dark mode from header
2. **Expected:** Theme should change immediately with smooth transition
3. Navigate to different pages
4. **Expected:** Dark mode should persist across all pages
5. Refresh the page
6. **Expected:** Dark mode preference should be remembered
7. **Expected:** All pages should have proper dark mode styling

## Common Issues to Check

### Backend Issues
- [ ] Backend server is running on port 8000
- [ ] OpenRouter API key is valid
- [ ] Google API key and CX are configured
- [ ] CORS is properly configured for localhost:5173

### Frontend Issues
- [ ] Frontend is running on port 5173
- [ ] All API endpoints are pointing to localhost:8000
- [ ] No console errors in browser developer tools
- [ ] Images are loading correctly
- [ ] Animations are smooth

### API Integration Issues
- [ ] OpenRouter API calls are working (check Network tab)
- [ ] Google Custom Search is returning results
- [ ] Vision API is analyzing images correctly
- [ ] All endpoints return proper JSON responses

## Performance Checks

- [ ] Page load times are reasonable (< 3 seconds)
- [ ] AI generation completes within 10 seconds
- [ ] Images load progressively
- [ ] No memory leaks (check browser task manager)
- [ ] Smooth animations (60 FPS)

## Browser Compatibility

Test in:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)

## Mobile Responsiveness

Test on:
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

Use browser developer tools to test responsive design.

## Success Criteria

✅ All features work as expected
✅ No console errors
✅ No linter errors
✅ Smooth user experience
✅ AI generation is accurate
✅ Dark mode works correctly
✅ All navigation flows work
✅ Data persists correctly

## Reporting Issues

If you find any issues:
1. Note the exact steps to reproduce
2. Check browser console for errors
3. Check network tab for failed API calls
4. Note the browser and OS version
5. Take screenshots if applicable

---

**Last Updated:** November 8, 2025
**Version:** 2.0 (Post Bug Fixes)
