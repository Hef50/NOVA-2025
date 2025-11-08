# NOVA-2025

Project: NovaNomad (React Edition)
1.1. Core Pitch: An agentic AI travel assistant that uses AI agents to plan your trip, multimodal vision to validate your packing, and generative video to create a unique souvenir.
1.2. Prize Targets:
1.2.1. Grand Prize ($2000): For the best overall project.
1.2.2. Agentuity Prize ($500): For the impressive, streamed implementation of agentic AI.
1.2.3. Looks Good, Works Good Prize: For the best UI/UX.
1.2.4. Best AI Generated Video Prize: For the integrated AI video souvenir.

Core Tech Stack
2.1. Frontend:
2.1.1. Build Tool: Vite
2.1.2. Framework: React
2.1.3. Language: TypeScript
2.1.4. UI Library: shadcn/ui
2.1.5. Styling: Tailwind CSS
2.1.6. Data Fetching: @tanstack/react-query
2.1.7. Streaming: @tanstack/react-query-v5-streaming
2.1.8. Animation: framer-motion
2.1.9. Routing: react-router-dom
2.2. Backend:
2.2.1. Framework: Python (FastAPI)
2.2.2. Server: uvicorn
2.2.3. Dependencies: requests, python-dotenv
2.3. AI & Services:
2.3.1. Agentic Chat: Agentuity
2.3.2. Multimodal Model: OpenRouter (e.g., Qwen3 VL)
2.3.3. Video Generation: ScottyLabs Video Generation Endpoint
2.3.4. Agentic Tools: MCP Servers (from hacker guide)

Page & Component Layout (React)
3.1. Global Components
3.1.1. MainLayout (Wrapper Component)
3.1.1.1. UI: Provides consistent navigation and content area.
3.1.1.2. TopNav:
3.1.1.2.1. UI: Clean, thin, fixed-top bar with blur backdrop.
3.1.1.2.2. Content: "NovaNomad" logo (left), Links: Plan New Trip (/) and My Trips (/trips).
3.2. Page 1: The Agentic Planner (Route: /)
3.2.1. Layout: Full-screen, responsive chat interface.
3.2.2. Components:
3.2.2.1. ChatView (Main Component):
3.2.2.1.1. UI: Scrolling div for messages.
3.2.2.1.2. Animation: Use AnimatePresence (Framer Motion) for new messages to fade in and slide up.
3.2.2.1.3. Content:
3.2.2.1.3.1. UserMessage: Simple blue bubble.
3.2.2.1.3.2. AgentMessage: Gray bubble that streams in text.
3.2.2.1.3.3. AgentThought (Key for Agentuity Prize): Distinct, smaller-font message (e.g., "🧠 Thinking... Calling get_local_attractions...").
3.2.2.2. ChatInput (Bottom Bar):
3.2.2.2.1. UI: Fixed input bar at the bottom.
3.2.2.2.2. Content: textarea and "Send" Button.
3.2.2.2.3. State: Button is disabled with a spinner when isFetching is true.
3.2.2.3. ItineraryPanel (Drawer/Sheet Component):
3.2.2.3.1. Functionality: Opens via a "View Full Itinerary" button that appears after chat completion.
3.2.2.3.2. Content:
3.2.2.3.2.1. Day 1, Day 2... itinerary.
3.2.2.3.2.2. "Generate My AI Trip Souvenir!" Button: Calls video endpoint, shows loading, then embeds the <video> element.
3.2.2.3.2.3. "Save Trip" Button: Navigates user to /trips.
3.3. Page 2: My Trips & Packer (Route: /trips)
3.3.1. Layout: Clean dashboard page.
3.3.2. Components:
3.3.2.1. TripCardGrid:
3.3.2.1.1. UI: Responsive grid of Card components.
3.3.2.1.2. Animation: whileHover={{ scale: 1.03 }} on cards.
3.3.2.1.3. Content: Destination and "Validate Packing" button.
3.3.2.2. PackingValidator (Modal Component):
3.3.2.2.1. UI: Large, two-column responsive Dialog.
3.3.2.2.2. Left Column (The "List"):
3.3.2.2.2.1. Content: AI-generated list, "✅ You Packed" list, "❌ You Forgot" list.
3.3.2.2.2.2. Animation: Use Framer Motion's layout prop to animate items moving between lists.
3.3.2.2.3. Right Column (The "Scanner"):
3.3.2.2.3.1. Content: File drop-zone with "Scan Your Suitcase" button.
3.3.2.2.3.2. Functionality: <input type="file" accept="image/*" capture="environment">.
3.3.2.2.3.3. State: Displays selected image with a loading overlay during analysis.
3.3.2.2.3.4. Buy Links: Add "Buy" link next to "Forgot" items.

Modular Build Plan (Step-by-Step)
4.1. Stage 1: Backend Setup (FastAPI)
4.1.1. In a new backend folder, create main.py. Set up a basic FastAPI app.
4.1.2. Create requirements.txt with fastapi, uvicorn, python-dotenv, and requests.
4.1.3. In backend/main.py, add CORSMiddleware to allow http://localhost:5173.
4.1.4. In backend/main.py, add a simple / GET endpoint returning {'hello': 'world'}.
4.1.5. In backend/main.py, create a /chat_streaming POST endpoint that returns a hard-coded JSON: {'response': 'This is a test'}.
4.2. Stage 2: Frontend Setup (React + Vite)
4.2.1. In a new frontend folder, initialize a React + Vite + TypeScript project.
4.2.2. Install dependencies: react-router-dom, @tanstack/react-query, axios.
4.2.3. Install and initialize Tailwind CSS.
4.2.4. Install and initialize shadcn/ui. Add Button and Input components.
4.2.5. In frontend/src/main.tsx, wrap App with QueryClientProvider.
4.2.6. In frontend/src/App.tsx, create ChatView.tsx component and render it.
4.2.7. In frontend/src/components/ChatView.tsx, build the basic layout: message div and a form with Input and Button.
4.2.8. In frontend/src/components/ChatView.tsx, create a simple useMutation hook to POST to http://localhost:8000/chat_streaming and console.log the response.
4.3. Stage 3: Backend Streaming (Core Feature)
4.3.1. In backend/main.py, copy the ChatRequest Pydantic model from the hacker guide.
4.3.2. In backend/main.py, update /chat_streaming to use StreamingResponse. Start with a hard-coded event_generator that yields dummy JSON chunks.
4.3.3. In backend, create chat_service.py. Copy the ChatService class from the guide.
4.3.4. In backend/main.py, import ChatService and implement the real stream_response logic, including the requests.post call to OpenRouter. Load OPENROUTER_API_KEY from .env.
4.4. Stage 4: Frontend Streaming (React Hook)
4.4.1. In frontend, install @tanstack/react-query-v5-streaming.
4.4.2. In frontend/src/hooks, create useChatStreaming.ts. Copy the hook from the hacker guide.
4.4.3. In frontend/src/utils, create streamParser.ts. Copy the utility functions from the guide.
4.4.4. In frontend/src/components/ChatView.tsx, replace useMutation with useChatStreaming.
4.4.5. In frontend/src/components/ChatView.tsx, manage Message[] state and render the chatHistory and the live streamingMessage.
4.5. Stage 5: Agentic Tools (Agentuity Prize)
4.5.1. In backend, create mcp_service.py. Copy MCPClient and MCPManager classes from the guide.
4.5.2. In backend, create mcp_servers.json (can be empty {} for now).
4.5.3. In backend/chat_service.py, modify create_payload to add the tools list via mcp_manager.
4.5.4. In backend/chat_service.py, modify stream_response to include the three MCP INTEGRATION points from the guide.
4.5.5. In frontend/src/components/ChatView.tsx, add a shadcn/ui Checkbox for "Enable Agentic Tools".
4.5.6. Pass the checkbox state to the useChatStreaming hook as mcpEnabled.
4.5.7. In ChatView.tsx, update message rendering to show a "thinking" style for tool_calls.
4.6. Stage 6: Layout & Packing Feature (Multimodal)
4.6.1. In frontend, install framer-motion.
4.6.2. In frontend/src/App.tsx, set up react-router-dom with routes / and /trips.
4.6.3. Create a NavBar.tsx component and add it to App.tsx.
4.6.4. Create MyTrips.tsx component for the /trips route. Add a shadcn/ui Card with a "Validate Packing" button.
4.6.5. In MyTrips.tsx, add a Dialog component that opens on button click.
4.6.6. Inside the Dialog, add <input type='file' accept='image/*'>.
4.6.7. In backend/chat_service.py, modify prepare_messages to handle image inputs (base64) as shown in the guide.
4.6.8. In MyTrips.tsx, create a file handler to convert the uploaded image to a base64 string.
4.6.9. In MyTrips.tsx, create a new useMutation to send the packing list and base64 image to /chat_streaming with a multimodal prompt.
4.6.10. Render the mutation response in the Dialog (Packed vs. Forgot lists).
4.7. Stage 7: AI Souvenir (Video Prize)
4.7.1. In backend/main.py, create a new GET endpoint /generate_video?prompt=....
4.7.2. In /generate_video, use requests to call the ScottyLabs Video Endpoint and return the video/mp4 response.
4.7.3. In frontend/src/components/ChatView.tsx (or the ItineraryPanel), add a "Generate AI Souvenir" Button.
4.7.4. On button click, call the /generate_video endpoint.
4.7.5. Store the returned video blob URL in state and render it in a <video> tag with controls.
4.7.6. In frontend/src/App.tsx, wrap route children in AnimatePresence for page transitions.
4.7.7. In frontend/src/components/ChatView.tsx, wrap messages in motion.div for fade-in animations.