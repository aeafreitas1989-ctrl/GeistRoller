"""
Backend API tests for TTRPG Character Sheet App
Tests the dice roll endpoint used by the Spellcasting Popup
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestDiceRollAPI:
    """Tests for POST /api/dice/roll endpoint"""
    
    def test_basic_dice_roll(self):
        """Test basic dice roll with standard pool"""
        response = requests.post(f"{BASE_URL}/api/dice/roll", json={
            "pool": 5,
            "again": 10,
            "rote": False,
            "chance": False
        })
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "dice" in data
        assert "successes" in data
        assert "is_exceptional" in data
        assert "is_dramatic_failure" in data
        assert "description" in data
        
        # Verify dice count matches pool
        assert len(data["dice"]) >= 5  # May have more due to 10-again
        
        # Verify all dice values are valid (1-10)
        for die in data["dice"]:
            assert 1 <= die <= 10
        
        print(f"✓ Basic roll: {data['dice']} = {data['successes']} successes")
    
    def test_chance_die_roll(self):
        """Test chance die roll (single die, only 10 succeeds)"""
        response = requests.post(f"{BASE_URL}/api/dice/roll", json={
            "pool": 1,
            "again": 10,
            "rote": False,
            "chance": True
        })
        assert response.status_code == 200
        data = response.json()
        
        # Chance die should roll exactly 1 die
        assert len(data["dice"]) >= 1
        
        # Verify response structure
        assert "successes" in data
        assert "is_dramatic_failure" in data
        
        print(f"✓ Chance die: {data['dice']} = {data['successes']} successes")
    
    def test_rote_quality_roll(self):
        """Test rote quality roll (reroll failures once)"""
        response = requests.post(f"{BASE_URL}/api/dice/roll", json={
            "pool": 3,
            "again": 10,
            "rote": True,
            "chance": False
        })
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "dice" in data
        assert "successes" in data
        
        print(f"✓ Rote roll: {data['dice']} = {data['successes']} successes")
    
    def test_8_again_roll(self):
        """Test 8-again exploding dice"""
        response = requests.post(f"{BASE_URL}/api/dice/roll", json={
            "pool": 5,
            "again": 8,
            "rote": False,
            "chance": False
        })
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "dice" in data
        assert "successes" in data
        
        print(f"✓ 8-again roll: {data['dice']} = {data['successes']} successes")
    
    def test_9_again_roll(self):
        """Test 9-again exploding dice"""
        response = requests.post(f"{BASE_URL}/api/dice/roll", json={
            "pool": 5,
            "again": 9,
            "rote": False,
            "chance": False
        })
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "dice" in data
        assert "successes" in data
        
        print(f"✓ 9-again roll: {data['dice']} = {data['successes']} successes")
    
    def test_paradox_roll_single_die(self):
        """Test Paradox roll with 1 die (typical for low Gnosis)"""
        response = requests.post(f"{BASE_URL}/api/dice/roll", json={
            "pool": 1,
            "again": 10,
            "rote": False,
            "chance": False
        })
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "dice" in data
        assert "successes" in data
        
        print(f"✓ Paradox roll (1 die): {data['dice']} = {data['successes']} successes")
    
    def test_large_dice_pool(self):
        """Test large dice pool (e.g., high Gnosis + Arcana + Yantras)"""
        response = requests.post(f"{BASE_URL}/api/dice/roll", json={
            "pool": 15,
            "again": 10,
            "rote": False,
            "chance": False
        })
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "dice" in data
        assert len(data["dice"]) >= 15
        
        print(f"✓ Large pool roll (15 dice): {len(data['dice'])} dice rolled, {data['successes']} successes")
    
    def test_invalid_pool_zero(self):
        """Test that pool of 0 is handled (should use chance die or return error)"""
        response = requests.post(f"{BASE_URL}/api/dice/roll", json={
            "pool": 0,
            "again": 10,
            "rote": False,
            "chance": False
        })
        # Either 200 with chance die behavior or 400 error is acceptable
        assert response.status_code in [200, 400]
        
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Zero pool handled: {data}")
        else:
            print(f"✓ Zero pool rejected with 400")


class TestCharactersAPI:
    """Tests for character-related endpoints"""
    
    def test_get_characters(self):
        """Test GET /api/characters returns list of characters"""
        response = requests.get(f"{BASE_URL}/api/characters")
        assert response.status_code == 200
        data = response.json()
        
        # Should return a list
        assert isinstance(data, list)
        
        # Should have at least one character
        assert len(data) > 0
        
        # Verify character structure
        for char in data[:3]:  # Check first 3
            assert "id" in char
            assert "name" in char
            assert "character_type" in char
            print(f"✓ Character: {char['name']} ({char['character_type']})")
    
    def test_get_mage_character(self):
        """Test that Mage characters have required fields"""
        response = requests.get(f"{BASE_URL}/api/characters")
        assert response.status_code == 200
        data = response.json()
        
        # Find a Mage character
        mage = next((c for c in data if c.get('character_type') == 'mage'), None)
        
        if mage:
            # Verify Mage-specific fields
            assert "gnosis" in mage or "attributes" in mage
            print(f"✓ Mage character found: {mage['name']}")
        else:
            print("⚠ No Mage character found in database")
    
    def test_get_sineater_character(self):
        """Test that Sin-Eater characters have required fields"""
        response = requests.get(f"{BASE_URL}/api/characters")
        assert response.status_code == 200
        data = response.json()
        
        # Find a Sin-Eater character
        sineater = next((c for c in data if c.get('character_type') == 'sin-eater'), None)
        
        if sineater:
            # Verify Sin-Eater-specific fields
            assert "synergy" in sineater or "attributes" in sineater
            print(f"✓ Sin-Eater character found: {sineater['name']}")
        else:
            print("⚠ No Sin-Eater character found in database")


class TestHealthEndpoint:
    """Test health check endpoint"""
    
    def test_health_check(self):
        """Test that the API is healthy"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        
        assert data.get("status") == "healthy"
        print(f"✓ Health check passed: {data}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
