import requests
import sys

BASE_URL = "http://127.0.0.1:8000"
tests_passed = 0
tests_failed = 0

def run_test(test_name, func):
    """Helper function to run a test and print results."""
    global tests_passed, tests_failed
    try:
        func()
        print(f"✅  PASS: {test_name}")
        tests_passed += 1
    except Exception as e:
        print(f"❌  FAIL: {test_name}\n     Error: {e}")
        tests_failed += 1

# --- Test Definitions ---

def test_server_connection():
    """Checks if the server is running at all."""
    try:
        requests.get(BASE_URL, timeout=2)
    except requests.ConnectionError:
        raise Exception("Server is not running at http://127.0.0.1:8000. Please run 'uvicorn main:app --reload' in the 'backend' folder.")

def test_root_get_endpoint():
    """Checks the GET / endpoint."""
    response = requests.get(f"{BASE_URL}/")
    if response.status_code != 200:
        raise Exception(f"Status code was {response.status_code}, expected 200.")
    
    expected_json = {"hello": "world"}
    if response.json() != expected_json:
        raise Exception(f"Response JSON was {response.json()}, expected {expected_json}.")

def test_chat_post_endpoint():
    """Checks the POST /chat_streaming endpoint."""
    response = requests.post(f"{BASE_URL}/chat_streaming")
    if response.status_code != 200:
        raise Exception(f"Status code was {response.status_code}, expected 200.")
    
    expected_json = {"response": "This is a test from the backend"}
    if response.json() != expected_json:
        raise Exception(f"Response JSON was {response.json()}, expected {expected_json}.")

def test_cors_headers():
    """Checks if CORS headers are set correctly for the chat endpoint."""
    # An OPTIONS request is what the browser sends first to check CORS.
    # It should be sent to the endpoint the frontend will actually call, like /chat_streaming.
    response = requests.options(f"{BASE_URL}/chat_streaming")
    if response.status_code != 200:
        raise Exception(f"CORS preflight (OPTIONS) request to '/chat_streaming' failed with status {response.status_code}. Expected 200.")
    
    header = response.headers.get("access-control-allow-origin")
    if header not in ("http://localhost:5173", "*"):
         raise Exception(f"CORS header 'access-control-allow-origin' was '{header}', expected 'http://localhost:5173' or '*'.")

# --- Run Tests ---

print("--- Running Stage 1 Backend Tests ---")
print(f"Targeting: {BASE_URL}\n")

run_test("Server Connection", test_server_connection)

# Only run other tests if connection was successful
if tests_passed > 0:
    run_test("GET / Endpoint", test_root_get_endpoint)
    run_test("POST /chat_streaming Endpoint", test_chat_post_endpoint)
    run_test("CORS Headers (OPTIONS /chat_streaming)", test_cors_headers)

print("\n--- Test Summary ---")
print(f"PASSED: {tests_passed}")
print(f"FAILED: {tests_failed}")

if tests_failed > 0:
    print("\nStage 1 setup is NOT complete. Please check errors above.")
    sys.exit(1)
else:
    print("\n🎉  All Stage 1 tests passed! You are ready for Stage 2.")
    sys.exit(0)