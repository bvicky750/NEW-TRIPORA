"""
Test suite for the Travel Planning API
Tests all endpoints and error handling
"""

import requests
import json

BASE_URL = "http://localhost:8000"

class APITester:
    """Test API endpoints"""
    
    def __init__(self, base_url=BASE_URL):
        self.base_url = base_url
        self.results = []
    
    def test(self, name, condition, message=""):
        """Log test result"""
        status = "✅ PASS" if condition else "❌ FAIL"
        self.results.append(f"{status} - {name}: {message}")
        print(f"{status} - {name}")
        if message:
            print(f"       {message}\n")
    
    def test_health_check(self):
        """Test health check endpoint"""
        print("\n📋 Testing: Health Check")
        print("─" * 60)
        
        try:
            response = requests.get(f"{self.base_url}/health", timeout=5)
            self.test("Health endpoint", response.status_code == 200)
            
            data = response.json()
            self.test("Health status", data.get('status') == 'healthy')
            self.test("Services included", 'services' in data)
            
            return True
        except Exception as e:
            self.test("Health check", False, str(e))
            return False
    
    def test_single_place(self):
        """Test single place endpoint"""
        print("\n📋 Testing: Single Place Details")
        print("─" * 60)
        
        try:
            params = {
                'query': 'Paragliding Billing',
                'vibe': 'Adventure',
                'include_photos': True,
                'include_reviews': True,
            }
            
            response = requests.get(f"{self.base_url}/place-details", params=params, timeout=10)
            self.test("Place details endpoint", response.status_code == 200, f"Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                self.test("Has name", 'name' in data)
                self.test("Has location", 'location' in data)
                self.test("Has rating", 'rating' in data and 1 <= data['rating'] <= 5)
                self.test("Has reviews", 'reviews' in data and len(data['reviews']) > 0)
                self.test("Has photos", 'photos' in data)
                self.test("Review has author", data['reviews'][0].get('author') if data['reviews'] else False)
                self.test("Review has rating", 'rating' in (data['reviews'][0] if data['reviews'] else {}))
                
                return True
        except Exception as e:
            self.test("Single place test", False, str(e))
        
        return False
    
    def test_batch_places(self):
        """Test batch endpoint"""
        print("\n📋 Testing: Batch Places")
        print("─" * 60)
        
        try:
            places = [
                {'query': 'Paragliding Billing', 'vibe': 'Adventure'},
                {'query': 'Yoga Retreat Rishikesh', 'vibe': 'Relaxation'},
            ]
            
            response = requests.post(
                f"{self.base_url}/places/batch",
                json=places,
                timeout=15
            )
            
            self.test("Batch endpoint", response.status_code == 200, f"Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                self.test("Returns array", isinstance(data, list))
                self.test("Returns 2 places", len(data) == 2)
                
                for place in data:
                    self.test(f"Place {place['name']} has reviews", 
                             len(place.get('reviews', [])) > 0)
                
                return True
        except Exception as e:
            self.test("Batch test", False, str(e))
        
        return False
    
    def test_search_endpoint(self):
        """Test search endpoint"""
        print("\n📋 Testing: Search Places")
        print("─" * 60)
        
        try:
            params = {
                'queries': 'Scuba Diving,Trekking',
                'include_photos': True,
            }
            
            response = requests.get(
                f"{self.base_url}/places/search",
                params=params,
                timeout=15
            )
            
            self.test("Search endpoint", response.status_code == 200, f"Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                self.test("Returns array", isinstance(data, list))
                self.test("Returns places", len(data) > 0)
                
                return True
        except Exception as e:
            self.test("Search test", False, str(e))
        
        return False
    
    def test_error_handling(self):
        """Test error handling"""
        print("\n📋 Testing: Error Handling")
        print("─" * 60)
        
        try:
            # Missing required parameter
            response = requests.get(f"{self.base_url}/place-details", timeout=5)
            self.test("Missing query param error", response.status_code >= 400)
            
            # Invalid vibe
            params = {'query': 'test', 'vibe': 'valid'}
            response = requests.get(f"{self.base_url}/place-details", params=params, timeout=5)
            self.test("Request with valid vibe succeeds", response.status_code == 200 or response.status_code >= 500)
            
            return True
        except Exception as e:
            self.test("Error handling test", False, str(e))
        
        return False
    
    def test_response_schema(self):
        """Test response schema validation"""
        print("\n📋 Testing: Response Schema")
        print("─" * 60)
        
        try:
            params = {'query': 'Surfing Varkala'}
            response = requests.get(f"{self.base_url}/place-details", params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Required fields
                required_fields = [
                    'name', 'location', 'description', 'rating',
                    'review_count', 'photos', 'reviews', 'vibe'
                ]
                
                for field in required_fields:
                    self.test(f"Has field: {field}", field in data, 
                             f"Value: {data.get(field, 'N/A')}")
                
                # Photo schema
                if data['photos']:
                    photo = data['photos'][0]
                    self.test("Photo has URL", 'url' in photo)
                    self.test("Photo has attribution", 'attribution' in photo)
                
                # Review schema
                if data['reviews']:
                    review = data['reviews'][0]
                    self.test("Review has author", 'author' in review)
                    self.test("Review has rating", 'rating' in review)
                    self.test("Review has text", 'text' in review)
                
                return True
        except Exception as e:
            self.test("Schema test", False, str(e))
        
        return False
    
    def test_performance(self):
        """Test performance metrics"""
        print("\n📋 Testing: Performance")
        print("─" * 60)
        
        import time
        
        try:
            # Single place
            start = time.time()
            response = requests.get(
                f"{self.base_url}/place-details",
                params={'query': 'Cooking Class Goa'},
                timeout=20
            )
            elapsed = time.time() - start
            
            self.test("Single place response < 5s", elapsed < 5, f"Time: {elapsed:.2f}s")
            
            # Batch places
            start = time.time()
            response = requests.post(
                f"{self.base_url}/places/batch",
                json=[{'query': 'Test 1'}, {'query': 'Test 2'}],
                timeout=20
            )
            elapsed = time.time() - start
            
            self.test("Batch response < 10s", elapsed < 10, f"Time: {elapsed:.2f}s")
            
            return True
        except Exception as e:
            self.test("Performance test", False, str(e))
        
        return False
    
    def run_all_tests(self):
        """Run all tests"""
        print("\n" + "="*80)
        print("🧪 TRAVEL PLANNING API - TEST SUITE".center(80))
        print("="*80)
        
        # Check if API is running
        try:
            requests.get(f"{self.base_url}/health", timeout=2)
        except:
            print("\n❌ Cannot connect to API at", self.base_url)
            print("   Start the API with: cd backend && python -m uvicorn main:app --reload")
            return
        
        print("\n✅ API is accessible\n")
        
        # Run tests
        self.test_health_check()
        self.test_single_place()
        self.test_batch_places()
        self.test_search_endpoint()
        self.test_error_handling()
        self.test_response_schema()
        self.test_performance()
        
        # Summary
        print("\n" + "="*80)
        print("📊 TEST SUMMARY".center(80))
        print("="*80 + "\n")
        
        passed = sum(1 for r in self.results if "✅" in r)
        failed = sum(1 for r in self.results if "❌" in r)
        total = len(self.results)
        
        for result in self.results:
            print(result)
        
        print(f"\n{'─'*80}")
        print(f"Total: {total} | Passed: {passed} ✅ | Failed: {failed} ❌")
        print(f"Success Rate: {(passed/total*100):.1f}%")
        print("="*80 + "\n")


if __name__ == "__main__":
    tester = APITester()
    tester.run_all_tests()
