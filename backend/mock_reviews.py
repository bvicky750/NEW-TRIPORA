import random
from typing import List
from schemas import ReviewSchema

class MockReviewGenerator:
    """Generate realistic mock reviews for travel places"""
    
    FIRST_NAMES = [
        "Rajesh", "Priya", "Amit", "Deepika", "Rohan", "Anjali", 
        "Vikram", "Neha", "Arjun", "Pooja", "Karan", "Sonali",
        "Aditya", "Meera", "Sanjay", "Divya", "Nikhil", "Shreya",
        "Marco", "Emma", "Liam", "Sofia", "James", "Olivia",
        "Chen", "Yuki", "Alex", "Isabella", "David", "Mia"
    ]
    
    LAST_NAMES = [
        "Singh", "Sharma", "Patel", "Kumar", "Verma", "Gupta",
        "Brown", "Johnson", "Williams", "Garcia", "Martinez", "Wong",
        "Müller", "Schmidt", "Ferrari", "Rossi", "Kim", "Park"
    ]
    
    REVIEWS_TEMPLATES = {
        "5": [
            "Absolutely amazing experience! Highly recommend.",
            "Best adventure of my life. Worth every penny!",
            "Incredible! Everything was perfect. Coming back soon.",
            "Fantastic experience. The team was very professional.",
            "Outstanding! Exceeded all my expectations.",
            "Simply unforgettable. 10/10 would recommend.",
            "The most amazing experience ever. Thank you!",
            "Perfect in every way. Can't ask for more.",
            "Best decision ever. Already planning my next trip!",
            "Wow! This is a must-do. Incredible value for money."
        ],
        "4": [
            "Really enjoyed it. Great place to visit.",
            "Very good experience. Highly recommended.",
            "Great adventure! Would definitely return.",
            "Loved every moment. Well worth it.",
            "Fantastic place! Really enjoyed our time.",
            "Very impressive and well organized.",
            "Great experience overall. Minor issues but still amazing.",
            "Wonderful! Definitely worth the visit.",
            "Really impressed! Great service and location.",
            "Very enjoyable. Would come back again."
        ],
        "3": [
            "It was okay. Some parts were great, others not so much.",
            "Good experience but had some minor issues.",
            "Average. Expected a bit more for the price.",
            "Nice place but could be better.",
            "Decent visit. Nothing extraordinary but good.",
            "Fine experience. Decent value.",
            "It was alright. Some ups and downs.",
            "Pretty good, but not exceptional.",
            "Okay experience. Room for improvement.",
            "Worth visiting but has its limitations."
        ],
        "2": [
            "Not great. Could be much better.",
            "Disappointing. Expected more.",
            "Below average. Not worth the cost.",
            "Poor experience overall.",
            "Quite disappointing.",
            "Not recommended. Very average.",
            "Waste of time and money.",
            "Really not up to expectations.",
            "Quite bad. Wouldn't go again.",
            "Not impressed at all."
        ],
        "1": [
            "Terrible experience. Do not recommend.",
            "Awful. Complete waste of time.",
            "Very poor service and facilities.",
            "Worst experience ever.",
            "Terrible! Save your money.",
            "Absolutely dreadful.",
            "Not worth it at all.",
            "Horrible experience throughout.",
            "Avoid at all costs.",
            "Total disaster. Very disappointed."
        ]
    }
    
    @staticmethod
    def generate_reviews(place_name: str, num_reviews: int = 5) -> List[ReviewSchema]:
        """
        Generate realistic mock reviews for a place
        
        Args:
            place_name: Name of the place for context
            num_reviews: Number of reviews to generate (default 5)
        
        Returns:
            List of ReviewSchema objects
        """
        reviews = []
        ratings = []
        
        # Generate a distribution of ratings (more 5-star, some 4-star, fewer bad reviews)
        for _ in range(num_reviews):
            rand = random.random()
            if rand < 0.45:
                rating = 5
            elif rand < 0.75:
                rating = 4
            elif rand < 0.90:
                rating = 3
            elif rand < 0.97:
                rating = 2
            else:
                rating = 1
            ratings.append(rating)
        
        # Generate reviews
        for rating in ratings:
            first_name = random.choice(MockReviewGenerator.FIRST_NAMES)
            last_name = random.choice(MockReviewGenerator.LAST_NAMES)
            author = f"{first_name} {last_name}"
            
            review_template = random.choice(
                MockReviewGenerator.REVIEWS_TEMPLATES[str(rating)]
            )
            
            # Add some variation
            if random.random() > 0.7:
                variations = [
                    f" Visited with family.",
                    f" Went with friends.",
                    f" Solo traveler here.",
                    f" Worth every moment.",
                    f" Had a blast!"
                ]
                review_text = review_template + random.choice(variations)
            else:
                review_text = review_template
            
            review = ReviewSchema(
                author=author,
                rating=float(rating),
                text=review_text,
                time=random.choice([
                    "2 weeks ago",
                    "1 month ago",
                    "2 months ago",
                    "3 months ago",
                    "6 months ago"
                ])
            )
            reviews.append(review)
        
        return reviews
    
    @staticmethod
    def calculate_average_rating(reviews: List[ReviewSchema]) -> float:
        """Calculate average rating from reviews"""
        if not reviews:
            return 4.5
        total = sum(review.rating for review in reviews)
        return round(total / len(reviews), 1)
