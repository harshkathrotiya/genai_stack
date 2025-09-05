#!/usr/bin/env python3
"""
Test script to verify AI functionality and response times
"""

import requests
import json
import time

def test_api_health():
    """Test API health endpoint"""
    print("🔍 Testing API Health...")
    try:
        response = requests.get("http://localhost:8000/api/health", timeout=5)
        if response.status_code == 200:
            print("✅ API Health: OK")
            return True
        else:
            print(f"❌ API Health: Failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API Health: Error - {e}")
        return False

def test_workflow_creation():
    """Test workflow creation"""
    print("\n🔍 Testing Workflow Creation...")
    workflow_data = {
        "name": "Speed Test Workflow",
        "description": "Testing AI response speed",
        "nodes": [
            {
                "id": "user-query-1",
                "type": "user-query",
                "position": {"x": 100, "y": 100},
                "data": {
                    "label": "User Query",
                    "componentType": "user-query",
                    "config": {"placeholder": "Ask me anything...", "required": True}
                }
            },
            {
                "id": "llm-engine-1", 
                "type": "llm-engine",
                "position": {"x": 300, "y": 100},
                "data": {
                    "label": "LLM Engine",
                    "componentType": "llm-engine",
                    "config": {
                        "model": "gpt-3.5-turbo",
                        "temperature": 0.1,
                        "maxTokens": 200,
                        "systemPrompt": "You are a helpful AI assistant. Be very concise in your responses.",
                        "webSearch": False
                    }
                }
            },
            {
                "id": "output-1",
                "type": "output", 
                "position": {"x": 500, "y": 100},
                "data": {
                    "label": "Output",
                    "componentType": "output",
                    "config": {"displayFormat": "chat", "showTimestamp": True}
                }
            }
        ],
        "edges": [
            {"id": "edge-1", "source": "user-query-1", "target": "llm-engine-1"},
            {"id": "edge-2", "source": "llm-engine-1", "target": "output-1"}
        ]
    }
    
    try:
        response = requests.post(
            "http://localhost:8000/api/workflows/", 
            json=workflow_data,
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            workflow_id = data["data"]["workflow_id"]
            print(f"✅ Workflow Created: ID {workflow_id}")
            return workflow_id
        else:
            print(f"❌ Workflow Creation Failed: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"❌ Workflow Creation Error: {e}")
        return None

def test_workflow_validation(workflow_id):
    """Test workflow validation"""
    print(f"\n🔍 Testing Workflow Validation for ID {workflow_id}...")
    try:
        response = requests.post(
            f"http://localhost:8000/api/workflows/{workflow_id}/validate",
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if data["data"]["is_valid"]:
                print("✅ Workflow Validation: PASSED")
                return True
            else:
                print("❌ Workflow Validation: FAILED")
                return False
        else:
            print(f"❌ Validation Request Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Validation Error: {e}")
        return False

def test_chat_response_speed(workflow_id):
    """Test chat response speed"""
    print(f"\n🔍 Testing Chat Response Speed for Workflow ID {workflow_id}...")
    
    test_messages = [
        "Hi there!",
        "What is 2+2?",
        "Tell me a short joke"
    ]
    
    for i, message in enumerate(test_messages, 1):
        print(f"\n📝 Test {i}: '{message}'")
        
        start_time = time.time()
        try:
            response = requests.post(
                f"http://localhost:8000/api/workflows/{workflow_id}/chat",
                json={"message": message},
                timeout=60  # 1 minute timeout
            )
            end_time = time.time()
            response_time = end_time - start_time
            
            if response.status_code == 200:
                data = response.json()
                if data["success"]:
                    ai_response = data["data"]["response"]
                    print(f"✅ Response Time: {response_time:.2f}s")
                    print(f"🤖 AI: {ai_response[:100]}{'...' if len(ai_response) > 100 else ''}")
                    
                    if response_time > 30:
                        print("⚠️  WARNING: Response time is very slow (>30s)")
                    elif response_time > 15:
                        print("⚠️  WARNING: Response time is slow (>15s)")
                    
                else:
                    print(f"❌ Chat Failed: {data.get('error', 'Unknown error')}")
                    print(f"Response time: {response_time:.2f}s")
            else:
                print(f"❌ Request Failed: {response.status_code}")
                print(f"Response time: {response_time:.2f}s")
                print(response.text)
                
        except requests.exceptions.Timeout:
            print("❌ TIMEOUT: Request took longer than 60 seconds")
        except Exception as e:
            end_time = time.time()
            response_time = end_time - start_time
            print(f"❌ Error: {e}")
            print(f"Time elapsed: {response_time:.2f}s")
        
        time.sleep(1)  # Small delay between tests

def main():
    print("🚀 GenAI Stack Performance Test")
    print("=" * 50)
    
    # Test API health
    if not test_api_health():
        print("❌ API health check failed. Exiting.")
        return
    
    # Test workflow creation
    workflow_id = test_workflow_creation()
    if not workflow_id:
        print("❌ Workflow creation failed. Exiting.")
        return
    
    # Test workflow validation
    if not test_workflow_validation(workflow_id):
        print("❌ Workflow validation failed. Exiting.")
        return
    
    # Test chat response speed
    test_chat_response_speed(workflow_id)
    
    print("\n" + "=" * 50)
    print("🎉 Performance test completed!")
    print("\nRecommendations:")
    print("- If responses are consistently slow (>15s), check your internet connection")
    print("- If you get timeout errors, verify your OpenAI API key and quota")
    print("- For faster responses, use gpt-3.5-turbo instead of gpt-4")
    print("- Reduce max_tokens for shorter, faster responses")

if __name__ == "__main__":
    main()