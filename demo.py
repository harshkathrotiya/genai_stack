#!/usr/bin/env python3
"""
GenAI Stack Demo Script
Demonstrates the full workflow execution process
"""

import requests
import json
import time

# API base URL
BASE_URL = "http://localhost:8000"

def demo_workflow():
    """Demonstrate creating and executing a workflow"""
    
    print("🚀 GenAI Stack Demo")
    print("=" * 50)
    
    # Step 1: Create a workflow
    print("\n1. Creating a new workflow...")
    workflow_data = {
        "name": "Demo AI Workflow",
        "description": "A demonstration workflow with all components",
        "nodes": [
            {
                "id": "user-query-1",
                "type": "user-query",
                "position": {"x": 100, "y": 100},
                "data": {
                    "label": "User Query",
                    "componentType": "user-query",
                    "config": {
                        "placeholder": "Ask me anything...",
                        "required": True
                    }
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
                        "model": "gpt-4",
                        "temperature": 0.7,
                        "maxTokens": 1000,
                        "systemPrompt": "You are a helpful AI assistant.",
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
                    "config": {
                        "displayFormat": "chat",
                        "showTimestamp": True,
                        "allowFollowUp": True
                    }
                }
            }
        ],
        "edges": [
            {
                "id": "edge-1",
                "source": "user-query-1",
                "target": "llm-engine-1"
            },
            {
                "id": "edge-2", 
                "source": "llm-engine-1",
                "target": "output-1"
            }
        ]
    }
    
    response = requests.post(f"{BASE_URL}/api/workflows/", json=workflow_data)
    if response.status_code == 200:
        workflow_id = response.json()["data"]["workflow_id"]
        print(f"✅ Workflow created with ID: {workflow_id}")
    else:
        print(f"❌ Failed to create workflow: {response.text}")
        return
    
    # Step 2: Validate the workflow
    print("\n2. Validating workflow...")
    response = requests.post(f"{BASE_URL}/api/workflows/{workflow_id}/validate")
    if response.status_code == 200:
        validation_result = response.json()
        if validation_result["data"]["is_valid"]:
            print("✅ Workflow is valid!")
        else:
            print("❌ Workflow validation failed")
            return
    else:
        print(f"❌ Validation request failed: {response.text}")
        return
    
    # Step 3: Test chat with workflow
    print("\n3. Testing chat interface...")
    test_messages = [
        "Hello! How are you today?",
        "What can you help me with?",
        "Tell me a fun fact about AI"
    ]
    
    for message in test_messages:
        print(f"\n👤 User: {message}")
        
        response = requests.post(
            f"{BASE_URL}/api/workflows/{workflow_id}/chat",
            json={"message": message}
        )
        
        if response.status_code == 200:
            result = response.json()
            if result["success"]:
                ai_response = result["data"]["response"]
                print(f"🤖 AI: {ai_response}")
            else:
                print(f"❌ Chat failed: {result.get('error', 'Unknown error')}")
        else:
            print(f"❌ Request failed: {response.text}")
        
        time.sleep(1)  # Small delay between requests
    
    print("\n" + "=" * 50)
    print("🎉 Demo completed successfully!")
    print("\nNext steps:")
    print("1. Open http://localhost:5173 to use the visual interface")
    print("2. Add a Knowledge Base component and upload documents")
    print("3. Enable web search in the LLM Engine")
    print("4. Configure your API keys in the .env file")

if __name__ == "__main__":
    try:
        demo_workflow()
    except KeyboardInterrupt:
        print("\n\n👋 Demo interrupted by user")
    except Exception as e:
        print(f"\n❌ Demo failed with error: {e}")
        print("Make sure the backend server is running on http://localhost:8000")