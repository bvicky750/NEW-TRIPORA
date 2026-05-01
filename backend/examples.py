"""
Example Usage of the Travel Planning API
Demonstrates all features: places, images, and reviews
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def print_response(response, title):
    """Pretty print API response"""
    print(f"\n{'='*80}")
    print(f"📍 {title}")
    print(f"{'='*80}\n")
    print(json.dumps(response, indent=2, ensure_ascii=False))


def example_1_single_place():
    """Example 1: Get details for a single place"""
    print("\n" + "🎯 EXAMPLE 1: Get Single Place Details".center(80))
    
    params = {
        'query': 'Paragliding Billing',
        'vibe': 'Adventure',
        'emoji': '🪂',
        'include_photos': True,
        'include_reviews': True,
        'max_photos': 3,
        'max_reviews': 3
    }
    
    response = requests.get(f"{BASE_URL}/place-details", params=params)
    
    if response.status_code == 200:
        data = response.json()
        print_response(data, "Paragliding Place Details")
        
        # Print summary
        print("\n📊 SUMMARY:")
        print(f"  Place: {data['name']}")
        print(f"  Location: {data['location']}")
        print(f"  Rating: ⭐ {data['rating']}")
        print(f"  Reviews: {len(data['reviews'])} available")
        print(f"  Photos: {len(data['photos'])} available")
        print(f"  Vibe: {data['vibe']} {data['emoji']}")
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.json())


def example_2_multiple_places():
    """Example 2: Get details for multiple places (batch)"""
    print("\n" + "🎯 EXAMPLE 2: Get Multiple Places (Batch)".center(80))
    
    places = [
        {
            'query': 'Paragliding Billing',
            'vibe': 'Adventure',
            'emoji': '🪂',
            'include_photos': True,
            'include_reviews': True,
            'max_photos': 2,
            'max_reviews': 2
        },
        {
            'query': 'Yoga Retreat Rishikesh',
            'vibe': 'Relaxation',
            'emoji': '🧘',
            'include_photos': True,
            'include_reviews': True,
            'max_photos': 2,
            'max_reviews': 2
        },
        {
            'query': 'Safari Ranthambore',
            'vibe': 'Nature',
            'emoji': '🦁',
            'include_photos': True,
            'include_reviews': True,
            'max_photos': 2,
            'max_reviews': 2
        }
    ]
    
    response = requests.post(
        f"{BASE_URL}/places/batch",
        json=places
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n✅ Successfully fetched {len(data)} places:\n")
        
        for place in data:
            print(f"  • {place['emoji']} {place['name']}")
            print(f"    Location: {place['location']}")
            print(f"    Rating: ⭐ {place['rating']} ({place['review_count']} reviews)")
            print(f"    Photos: {len(place['photos'])} | Reviews: {len(place['reviews'])}")
            print()
    else:
        print(f"❌ Error: {response.status_code}")


def example_3_search_places():
    """Example 3: Search multiple places with comma-separated queries"""
    print("\n" + "🎯 EXAMPLE 3: Search Multiple Places".center(80))
    
    params = {
        'queries': 'Scuba Diving Andaman,Trekking Kedarnath,Beach Party Goa',
        'vibe': 'Adventure',
        'include_photos': True,
        'include_reviews': True,
        'max_photos': 2,
        'max_reviews': 2
    }
    
    response = requests.get(f"{BASE_URL}/places/search", params=params)
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n✅ Found {len(data)} places:\n")
        
        for place in data:
            print(f"  📍 {place['name']}")
            print(f"     Location: {place['location']}")
            print(f"     Description: {place['description'][:60]}...")
            print(f"     Rating: ⭐ {place['rating']}")
            print()
    else:
        print(f"❌ Error: {response.status_code}")


def example_4_review_analysis():
    """Example 4: Analyze reviews and ratings"""
    print("\n" + "🎯 EXAMPLE 4: Review Analysis".center(80))
    
    params = {
        'query': 'Houseboat Alleppey',
        'vibe': 'Relaxation',
        'emoji': '🛥️',
        'include_reviews': True,
        'max_reviews': 5
    }
    
    response = requests.get(f"{BASE_URL}/place-details", params=params)
    
    if response.status_code == 200:
        data = response.json()
        
        print(f"\n📊 {data['name']} - Review Analysis")
        print(f"{'─'*60}")
        print(f"Overall Rating: ⭐ {data['rating']}/5.0")
        print(f"Total Reviews: {len(data['reviews'])}")
        
        # Rating distribution
        rating_dist = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        for review in data['reviews']:
            rating_dist[int(review['rating'])] += 1
        
        print(f"\nRating Distribution:")
        for rating in range(5, 0, -1):
            count = rating_dist[rating]
            bar = '█' * count
            print(f"  {rating}⭐ ({count:2d}) {bar}")
        
        print(f"\nTop Reviews:")
        for i, review in enumerate(data['reviews'][:3], 1):
            print(f"\n  {i}. {review['author']} - ⭐ {review['rating']}")
            print(f"     \"{review['text']}\"")
            if review['time']:
                print(f"     {review['time']}")
    else:
        print(f"❌ Error: {response.status_code}")


def example_5_image_gallery():
    """Example 5: Get all images for a place"""
    print("\n" + "🎯 EXAMPLE 5: Image Gallery".center(80))
    
    params = {
        'query': 'Desert Camping Jaisalmer',
        'vibe': 'Nature',
        'include_photos': True,
        'max_photos': 5
    }
    
    response = requests.get(f"{BASE_URL}/place-details", params=params)
    
    if response.status_code == 200:
        data = response.json()
        
        print(f"\n📸 {data['name']} - Image Gallery")
        print(f"{'─'*60}")
        print(f"Total Images: {len(data['photos'])}\n")
        
        for i, photo in enumerate(data['photos'], 1):
            print(f"  Image {i}:")
            print(f"    URL: {photo['url']}")
            print(f"    Size: {photo['width']}x{photo['height']}")
            print(f"    Credit: {photo['attribution']}")
            print()
    else:
        print(f"❌ Error: {response.status_code}")


def example_6_health_check():
    """Example 6: Check API health and services"""
    print("\n" + "🎯 EXAMPLE 6: API Health Check".center(80))
    
    response = requests.get(f"{BASE_URL}/health")
    
    if response.status_code == 200:
        data = response.json()
        print_response(data, "API Health Status")
        
        print("✅ All Services Status:")
        for service, status in data['services'].items():
            symbol = "✓" if "operational" in status or "configured" in status else "✗"
            print(f"  {symbol} {service}: {status}")
    else:
        print(f"❌ Error: {response.status_code}")


def run_all_examples():
    """Run all examples"""
    print("\n" + "="*80)
    print("🌍 TRAVEL PLANNING API - COMPREHENSIVE EXAMPLES".center(80))
    print("="*80)
    
    try:
        # Check if API is running
        response = requests.get(f"{BASE_URL}/health", timeout=2)
        if response.status_code != 200:
            print("❌ API not responding. Make sure to run:")
            print("   cd backend && python -m uvicorn main:app --reload")
            return
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API at", BASE_URL)
        print("   Make sure to run: cd backend && python -m uvicorn main:app --reload")
        return
    
    print("\n✅ API is running! Starting examples...\n")
    
    try:
        example_6_health_check()
        example_1_single_place()
        example_2_multiple_places()
        example_3_search_places()
        example_4_review_analysis()
        example_5_image_gallery()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n" + "="*80)
    print("✅ All examples completed!".center(80))
    print("="*80 + "\n")


if __name__ == "__main__":
    run_all_examples()
