import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";

const AdminHotelDetails = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const [hotelDetails, setHotelDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotelDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/hotels/${id}`);
                if (response && response.status === 200) {
                    setHotelDetails(response.data);
                    console.log(response.data);
                } else {
                    alert(`Error fetching hotel details: ${response.message}`);
                }
            } catch (error) {
                console.error("Error fetching hotel details:", error);
                alert("An error occurred while fetching hotel details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchHotelDetails();
        }
    }, [id]);

    return (
        <div>
            {loading ? (
                <p>Loading hotel details...</p>
            ) : hotelDetails ? (
                <div>
                    <h2>{hotelDetails.name}</h2>
                    <p>{hotelDetails.description}</p>
                    <p>Location: {hotelDetails.location}</p>
                    <p>Rating: {hotelDetails.rating}</p>
                </div>
            ) : (
                <p>Hotel not found</p>
            )}
        </div>
    );
};

export default AdminHotelDetails;
