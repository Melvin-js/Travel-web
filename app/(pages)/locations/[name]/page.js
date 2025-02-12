'use client'

import { useEffect, useState } from 'react';
import { use } from 'react';
import Papa from 'papaparse';
import { Star, Heart, Plus, ArrowRight } from 'lucide-react';
import styles from './LocationDetail.module.css';

// Main LocationDetail Component
const LocationDetail = ({ params }) => {
  // Use React.use to unwrap the params Promise
  const resolvedParams = use(params);
  const { name } = resolvedParams;
  const decodedName = decodeURIComponent(name);
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        const res = await fetch('/locationData/dataset.csv');
        if (!res.ok) throw new Error('Failed to fetch data');
        const csvText = await res.text();
        
        Papa.parse(csvText, {
          complete: (result) => {
            const data = result.data.find(
              (location) => decodeURIComponent(location.Name) === decodedName
            );
            if (!data) throw new Error('Location not found');
            setLocationData(data);
            setError(null);
          },
          header: true,
        });
      } catch (err) {
        setError(err.message);
        setLocationData(null);
      }
    };

    if (decodedName) fetchLocationDetails();
  }, [decodedName]);

  // RatingBars Component
  const RatingBars = () => {
    const ratings = [
      { stars: 5, percentage: 85 },
      { stars: 4, percentage: 60 },
      { stars: 3, percentage: 40 },
      { stars: 2, percentage: 30 },
      { stars: 1, percentage: 15 },
    ];

    const renderStars = (count) => {
      return [...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={16}
          className={`${styles.star} ${
            index < count ? styles.starFilled : ''
          }`}
        />
      ));
    };

    return (
      <div className={styles.ratingBars}>
        {ratings.map((rating) => (
          <div key={rating.stars} className={styles.ratingBar}>
            <div className={styles.stars}>
              {renderStars(rating.stars)}
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{ width: `${rating.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // AddComment Component
  const AddComment = () => {
    const [comment, setComment] = useState("");
    const [userRating, setUserRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log({ comment, userRating });
    };

    const renderStars = (count) => {
      return [...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={16}
          className={`${styles.star} ${
            index < (hoveredRating || userRating) ? styles.starFilled : ''
          }`}
          onClick={() => setUserRating(index + 1)}
          onMouseEnter={() => setHoveredRating(index + 1)}
          onMouseLeave={() => setHoveredRating(0)}
        />
      ));
    };

    return (
      <div className={styles.addComment}>
        <h4 className={styles.commentTitle}>Add a comment</h4>
        <form onSubmit={handleSubmit}>
          <textarea
            className={styles.textarea}
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className={styles.commentActions}>
            <div className={styles.ratingStars}>
              {renderStars(hoveredRating || userRating)}
            </div>
            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Review Component
  const Review = () => {
    const renderStars = (count) => {
      return [...Array(count)].map((_, index) => (
        <Star
          key={index}
          size={16}
          className={styles.starFilled}
        />
      ));
    };

    return (
      <div className={styles.review}>
        <img
          src="/images/profile.jpg"
          alt="User avatar"
          className={styles.avatar}
        />
        <div className={styles.reviewContent}>
          <div className={styles.reviewHeader}>
            <h4>Hashmi Sudheer</h4>
            <span>July 5 2025</span>
          </div>
          <div className={styles.reviewStars}>
            {renderStars(5)}
          </div>
          <p>
            A great travel app should feel like a personal tour guide right in your pocket—seamless,
            intuitive, and packed with smart recommendations tailored to your preferences.
          </p>
          <button className={styles.helpfulButton}>
            Helpful
          </button>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className={styles.errorMessage}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!locationData) {
    return <p className={styles.loading}>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.locationContent}>
        <div className={styles.mainContentWrapper}>
          {/* Main Image Section */}
          <div className={styles.imageSection}>
            <img 
              src={locationData.url || "/api/placeholder/400/300"} 
              alt={locationData.Name}
              className={styles.mainImage}
            />
          </div>

          {/* Location Details Section */}
          <div className={styles.detailsSection}>
            <h1 className={styles.title}>{locationData.Name}</h1>
            <p className={styles.location}>{locationData.Location}</p>
            <p className={styles.description}>
              {locationData.Description || 
                "A picturesque hill station in Kerala, India, known for its sprawling tea plantations, misty mountains, and lush greenery."}
            </p>
            <p className={styles.category}>{locationData.Category || "Nature"}</p>
            <div className={styles.actionButtons}>
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`${styles.iconButton} ${isLiked ? styles.liked : ''}`}
              >
                <Heart className={isLiked ? styles.heartFilled : ''} />
              </button>
              <button className={styles.iconButton}>
                <Plus />
              </button>
              <button className={styles.generateButton}>
                Generate itinerary
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className={styles.reviewsSection}>
          <h3 className={styles.reviewsTitle}>Reviews</h3>
          <div className={styles.reviewsContent}>
            <RatingBars />
            <AddComment />
          </div>
          <Review />
        </div>
      </div>
    </div>
  );
};

export default LocationDetail;