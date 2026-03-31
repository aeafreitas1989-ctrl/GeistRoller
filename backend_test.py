#!/usr/bin/env python3
"""
Comprehensive backend testing for Geist: The Sin-Eaters AI Storyteller
Tests all API endpoints and functionality
"""

import requests
import sys
import json
from datetime import datetime
from pathlib import Path

class GeistAPITester:
    def __init__(self):
        # Use the frontend URL for testing since that's what users access
        with open('/app/frontend/.env', 'r') as f:
            env_content = f.read()
            for line in env_content.split('\n'):
                if line.startswith('REACT_APP_BACKEND_URL='):
                    self.base_url = line.split('=', 1)[1].strip() + "/api"
                    break
        
        print(f"🔗 Testing backend at: {self.base_url}")
        
        self.session_id = None
        self.character_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status=200, data=None, timeout=30):
        """Run a single API test with proper error handling"""
        url = f"{self.base_url}{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   {method} {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=timeout)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=timeout)

            # Check status code
            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ PASS - Status: {response.status_code}")
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                print(f"❌ FAIL - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "error": response.text[:500]
                })
                return False, {}

        except requests.exceptions.ConnectionError as e:
            print(f"❌ FAIL - Connection Error: Backend may not be running")
            self.failed_tests.append({"test": name, "error": "Connection failed - backend down?"})
            return False, {}
        except requests.exceptions.Timeout as e:
            print(f"❌ FAIL - Timeout: Request took longer than {timeout}s")
            self.failed_tests.append({"test": name, "error": f"Timeout after {timeout}s"})
            return False, {}
        except Exception as e:
            print(f"❌ FAIL - Error: {str(e)}")
            self.failed_tests.append({"test": name, "error": str(e)})
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        success, response = self.run_test("Root Endpoint", "GET", "/")
        if success:
            print(f"   Message: {response.get('message', 'N/A')}")
        return success

    def test_create_session(self):
        """Test session creation"""
        success, response = self.run_test(
            "Create Session", 
            "POST", 
            "/sessions", 
            expected_status=200,
            data={"title": "Test Session"}
        )
        if success and 'id' in response:
            self.session_id = response['id']
            print(f"   Session ID: {self.session_id}")
        return success

    def test_get_sessions(self):
        """Test getting all sessions"""
        success, response = self.run_test("Get Sessions", "GET", "/sessions")
        if success:
            print(f"   Found {len(response)} sessions")
        return success

    def test_get_session_by_id(self):
        """Test getting specific session"""
        if not self.session_id:
            print("❌ FAIL - No session ID available from previous test")
            return False
        
        success, response = self.run_test(
            "Get Session by ID", 
            "GET", 
            f"/sessions/{self.session_id}"
        )
        if success:
            print(f"   Session title: {response.get('title', 'N/A')}")
        return success

    def test_send_message(self):
        """Test sending a message and getting AI response"""
        if not self.session_id:
            print("❌ FAIL - No session ID available")
            return False
        
        success, response = self.run_test(
            "Send Message to AI", 
            "POST", 
            f"/sessions/{self.session_id}/messages",
            data={"content": "Set the scene for a new chronicle in the city of the dead."},
            timeout=60  # AI responses can take longer
        )
        if success:
            print(f"   AI responded: {response.get('content', '')[:100]}...")
        return success

    def test_get_messages(self):
        """Test getting messages from session"""
        if not self.session_id:
            print("❌ FAIL - No session ID available")
            return False
        
        success, response = self.run_test(
            "Get Session Messages", 
            "GET", 
            f"/sessions/{self.session_id}/messages"
        )
        if success:
            print(f"   Found {len(response)} messages")
        return success

    def test_create_character(self):
        """Test character creation"""
        success, response = self.run_test(
            "Create Character",
            "POST",
            "/characters",
            data={"name": "Test Sin-Eater"}
        )
        if success and 'id' in response:
            self.character_id = response['id']
            print(f"   Character ID: {self.character_id}")
            print(f"   Default synergy: {response.get('synergy')}")
        return success

    def test_get_characters(self):
        """Test getting all characters"""
        success, response = self.run_test("Get Characters", "GET", "/characters")
        if success:
            print(f"   Found {len(response)} characters")
        return success

    def test_update_character(self):
        """Test updating character attributes"""
        if not self.character_id:
            print("❌ FAIL - No character ID available")
            return False
        
        update_data = {
            "name": "Updated Sin-Eater",
            "synergy": 5,
            "psyche": 2,
            "plasm": 8,
            "attributes": {"intelligence": 3, "strength": 2}
        }
        
        success, response = self.run_test(
            "Update Character",
            "PUT",
            f"/characters/{self.character_id}",
            data=update_data
        )
        if success:
            print(f"   Updated name: {response.get('name')}")
            print(f"   Updated synergy: {response.get('synergy')}")
        return success

    def test_dice_roll_normal(self):
        """Test normal dice rolling"""
        success, response = self.run_test(
            "Roll Normal Dice",
            "POST",
            "/dice/roll",
            data={"pool": 5, "again": 10, "rote": False, "chance": False}
        )
        if success:
            print(f"   Dice: {response.get('dice', [])}")
            print(f"   Successes: {response.get('successes', 0)}")
            print(f"   Description: {response.get('description', '')}")
        return success

    def test_dice_roll_chance(self):
        """Test chance die rolling"""
        success, response = self.run_test(
            "Roll Chance Die",
            "POST",
            "/dice/roll",
            data={"pool": 1, "chance": True}
        )
        if success:
            print(f"   Dice: {response.get('dice', [])}")
            print(f"   Successes: {response.get('successes', 0)}")
            print(f"   Dramatic failure: {response.get('is_dramatic_failure', False)}")
        return success

    def test_delete_session(self):
        """Test session deletion"""
        if not self.session_id:
            print("❌ FAIL - No session ID available")
            return False
        
        success, response = self.run_test(
            "Delete Session",
            "DELETE",
            f"/sessions/{self.session_id}"
        )
        if success:
            print(f"   Message: {response.get('message', 'N/A')}")
        return success

    def test_add_condition(self):
        """Test adding conditions to character (Cards feature)"""
        if not self.character_id:
            print("❌ FAIL - No character ID available")
            return False
        
        condition_data = {
            "conditions": [
                {
                    "name": "Shaken",
                    "type": "condition",
                    "description": "-2 to Resolve or Composure rolls. Caused by fear or supernatural terror.",
                    "resolution": "Regain Willpower from Virtue/Vice, or confront the source."
                }
            ]
        }
        
        success, response = self.run_test(
            "Add Condition to Character",
            "PUT",
            f"/characters/{self.character_id}",
            data=condition_data
        )
        if success:
            conditions = response.get('conditions', [])
            print(f"   Conditions added: {len(conditions)}")
            if conditions:
                print(f"   First condition: {conditions[0].get('name')}")
        return success

    def test_add_haunts(self):
        """Test adding haunt ratings to character (Cards feature)"""
        if not self.character_id:
            print("❌ FAIL - No character ID available")
            return False
        
        haunt_data = {
            "haunts": {
                "The Boneyard": 3,
                "The Caul": 2,
                "The Curse": 1
            }
        }
        
        success, response = self.run_test(
            "Add Haunts to Character",
            "PUT",
            f"/characters/{self.character_id}",
            data=haunt_data
        )
        if success:
            haunts = response.get('haunts', {})
            print(f"   Haunts set: {len(haunts)}")
            print(f"   Boneyard rating: {haunts.get('The Boneyard', 0)}")
        return success

    def test_add_keys(self):
        """Test adding keys to character (Cards feature)"""
        if not self.character_id:
            print("❌ FAIL - No character ID available")
            return False
        
        keys_data = {
            "keys": ["Beasts", "Cold Wind", "Grave-Dirt"]
        }
        
        success, response = self.run_test(
            "Add Keys to Character",
            "PUT",
            f"/characters/{self.character_id}",
            data=keys_data
        )
        if success:
            keys = response.get('keys', [])
            print(f"   Keys added: {len(keys)}")
            print(f"   Keys: {', '.join(keys)}")
        return success

    def test_update_multiple_cards(self):
        """Test updating conditions, haunts, and keys together"""
        if not self.character_id:
            print("❌ FAIL - No character ID available")
            return False
        
        cards_data = {
            "conditions": [
                {
                    "name": "Spooked",
                    "type": "condition", 
                    "description": "Something supernatural has rattled you.",
                    "resolution": "Succeed on a Composure roll in a safe environment."
                },
                {
                    "name": "Custom Condition",
                    "type": "custom",
                    "description": "A test custom condition",
                    "resolution": ""
                }
            ],
            "haunts": {
                "The Oracle": 4,
                "The Shroud": 2
            },
            "keys": ["Pyre-Flame", "Stillness"]
        }
        
        success, response = self.run_test(
            "Update All Cards Data",
            "PUT",
            f"/characters/{self.character_id}",
            data=cards_data
        )
        if success:
            conditions = response.get('conditions', [])
            haunts = response.get('haunts', {})
            keys = response.get('keys', [])
            print(f"   Conditions: {len(conditions)}")
            print(f"   Haunts: {len(haunts)}")
            print(f"   Keys: {len(keys)}")
        return success

    def test_delete_character(self):
        """Test character deletion"""
        if not self.character_id:
            print("❌ FAIL - No character ID available")
            return False
        
        success, response = self.run_test(
            "Delete Character",
            "DELETE",
            f"/characters/{self.character_id}"
        )
        if success:
            print(f"   Message: {response.get('message', 'N/A')}")
        return success

    def run_all_tests(self):
        """Run all backend tests in sequence"""
        print("🚀 Starting Geist AI Storyteller Backend Tests")
        print("=" * 60)
        
        # Test sequence
        tests = [
            self.test_root_endpoint,
            self.test_create_session,
            self.test_get_sessions,
            self.test_get_session_by_id,
            self.test_send_message,  # This tests AI integration
            self.test_get_messages,
            self.test_create_character,
            self.test_get_characters,
            self.test_update_character,
            # Cards feature tests
            self.test_add_condition,
            self.test_add_haunts, 
            self.test_add_keys,
            self.test_update_multiple_cards,
            # Other tests
            self.test_dice_roll_normal,
            self.test_dice_roll_chance,
            self.test_delete_session,
            self.test_delete_character,
        ]
        
        for test_func in tests:
            try:
                test_func()
            except Exception as e:
                print(f"❌ FAIL - {test_func.__name__}: {str(e)}")
                self.failed_tests.append({
                    "test": test_func.__name__,
                    "error": str(e)
                })
        
        # Print final results
        print("\n" + "=" * 60)
        print(f"📊 Backend Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.failed_tests:
            print(f"\n❌ Failed tests ({len(self.failed_tests)}):")
            for failed in self.failed_tests:
                print(f"   • {failed['test']}: {failed.get('error', 'Unknown error')}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = GeistAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())