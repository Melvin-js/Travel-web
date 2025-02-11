'use client'

import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { use } from 'react';
import styles from './LocationDetail.module.css';
import { Star, Heart, Plus, ArrowRight } from 'lucide-react';

const LocationDetail = ({ params }) => {
  const { name } = use(params);
  const decodedName = decodeURIComponent(name);

  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  const ratings = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 60 },
    { stars: 3, percentage: 40 },
    { stars: 2, percentage: 30 },
    { stars: 1, percentage: 15 },
  ];

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        const res = await fetch('/locationData/dataset.csv');
        if (!res.ok) {
          throw new Error('Failed to fetch data from CSV file.');
        }

        const csvText = await res.text();

        Papa.parse(csvText, {
          complete: (result) => {
            const data = result.data.find((location) => decodeURIComponent(location.Name) === decodedName);
            if (!data) {
              throw new Error('Location not found in dataset.');
            }
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

    if (decodedName) {
      fetchLocationDetails();
    }
  }, [decodedName]);

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
      {/* Location Details Section */}
      <div className={styles.locationContent}>
        <div className={styles.mainContent}>
          <div className={styles.imageContainer}>
            <img 
              src={locationData.url || "/api/placeholder/400/300"} 
              alt={locationData.Name} 
              className={styles.mainImage}
            />
          </div>
          <div className={styles.details}>
            <h1 className={styles.title}>{locationData.Name}</h1>
            <p className={styles.location}>{locationData.Location}</p>
            <p className={styles.description}>{locationData.Description}</p>
            <p className={styles.category}>
              <strong>Category:</strong> {locationData.Category}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <div className={styles.socialButtons}>
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={styles.actionButton}
            >
              <Heart className={isLiked ? styles.liked : ''} />
            </button>
            <button className={styles.actionButton}>
              <Plus />
            </button>
          </div>
          <button className={styles.generateButton}>
            Generate itinerary
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Reviews Section */}
        <div className={styles.reviews}>
          <h3 className={styles.reviewsTitle}>Reviews</h3>
          <div className={styles.ratingBars}>
            {ratings.map((rating) => (
              <div key={rating.stars} className={styles.ratingBar}>
                <div className={styles.stars}>
                  {Array.from({ length: rating.stars }).map((_, i) => (
                    <Star key={i} className={styles.star} />
                  ))}
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
          <div className={styles.review}>
            <img
              src="/api/placeholder/40/40"
              alt="User avatar"
              className={styles.avatar}
            />
            <div className={styles.reviewContent}>
              <div className={styles.reviewHeader}>
                <h4>Hashmi Sudheer</h4>
                <span>July 5 2025</span>
              </div>
              <div className={styles.reviewStars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={styles.star} />
                ))}
              </div>
              <p>A great travel app should feel like a personal tour guide right in your pocket—seamless, intuitive, and packed with smart recommendations tailored to your preferences.</p>
              <button className={styles.helpfulButton}>Helpful</button>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default LocationDetail;