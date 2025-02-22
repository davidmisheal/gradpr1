import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function ViewMore() {
  const { id } = useParams(); // Get the place ID from the URL
  const [place, setPlace] = useState(null);
  const [image, setImage] = useState(null);
  const [tours, setTours] = useState([]); // Initialize as an empty array
  const [showTours, setShowTours] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadImage = async () => {
      try {
        if (place && place.img) {
          const imgModule = await import(`../imgs/${place.img}`);
          setImage(imgModule.default);
        }
      } catch (error) {
        console.error('Error loading image:', error);
      }
    };

    loadImage();
  }, [place]);

  useEffect(() => {
    const fetchPlaceById = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/place/${id}`);
        setPlace(response.data);
        console.log('Fetched place:', response.data);
      } catch (error) {
        console.error('Error fetching place:', error);
      }
    };

    fetchPlaceById();
  }, [id]);

  const handleAddToTrip = () => {
    navigate('/mytrips', { state: place });
  };

  const handlePickTourGuide = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/tours');
      const toursData = response.data.data.data || [];

      // Check if place.location exists and is a string
      if (!place || !place.location || typeof place.location !== 'string') {
        console.error('Invalid place location:', place.location);
        return;
      }

      const placeLocationLower = place.location.toLowerCase();

      const filteredTours = toursData.filter(tour => {
        // Check if tour.location exists and is a string
        if (!tour.location || typeof tour.location !== 'string') {
          console.error('Invalid tour location:', tour.location);
          return false;
        }
        return tour.location.toLowerCase() === placeLocationLower;
      });

      setTours(filteredTours); // Set the filtered tours to state
      setShowTours(true); // Show the tours
      setIsVisible(true); // Make the tour guide list visible
      console.log('Filtered tours:', filteredTours);
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };

  if (!place) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Nav />
      <div className="viewmore">
        <div className="viewmore-first visible">
          <div className="viewmore-first-img">
            <img src={image} alt={place.name} />
          </div>
          <div className="viewmore-first-overlay">
            <span>
              <h2>{place.name}</h2>
              <p>{place.location}</p>
            </span>
            <span className="viewmore-first-overlay-counters">
              <i className="fa-solid fa-location-dot fa-xl"></i> <p>1000</p> | <i className="fa-solid fa-heart fa-xl"></i> <p>20000</p>
            </span>
          </div>
        </div>
        <div className="viewmore-second">
          <div className="viewmore-second-left visible">
            <h2>Description</h2>
            <p className="viewmore-second-desc">
              {place.description}
            </p>
            <p className="viewmore-second-desc">
              {place.description2}
            </p><p className="viewmore-second-desc">
              {place.description3}
            </p>
          </div>
          <div className="viewmore-second-right visible">
            <div>
              <img src={require('../imgs/khan-el-khalili1.jpg')} alt="Khan El Khalili" />
            </div>
            <div>
              <img src={require('../imgs/Khan-El-Khalili2.jpg')} alt="Khan El Khalili" />
            </div><div>
              <img src={require('../imgs/khan3.jpg')} alt="Khan El Khalili" />
            </div>
          </div>
        </div>
        <div className="viewmore-third visible">
          <h3> Price : {place.price}</h3>
          <span>
            <button className="button-28" role="button" onClick={handleAddToTrip}>Add</button>
            <button className="button-28" role="button" onClick={handlePickTourGuide}>Pick a TourGuide</button>
          </span>
        </div>
        {showTours && (
          <div className={`tour-guide-list ${isVisible ? 'scale-in' : ''}`}>
            <h3>Select a Tour Guide</h3>
            <div className="filtertour-body">
              {tours.length > 0 ? (
                tours.map((tour) => (
                  <React.Fragment key={tour._id}>
                    <hr />
                    <div className="filtertour-element">
                      <div>
                        <h4>{tour.name}</h4>
                        <p className="requests-email">{tour.email}</p>
                        <p className="requests-price">Price: <strong>{tour.price} L.E</strong></p>
                      </div>
                      <div>
                        <h5>Location:</h5>
                        <p className="requests-status">{tour.location}</p>
                      </div>
                      <div className="requests-button">
                        <button>Book</button>
                      </div>
                    </div>
                  </React.Fragment>
                ))
              ) : (
                <p>No tours available</p>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer name='footer-main' />
    </>
  );
}
