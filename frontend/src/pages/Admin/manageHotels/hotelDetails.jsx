// HotelDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "~/utils/axiosCustomize";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, FreeMode } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "./manageHotels.css"

function HotelDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    console.log(id);

    useEffect(() => {
        const fetchHotelDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/hotels/${id}`);
                setHotel(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching hotel details:", error);
                alert("Failed to load hotel details");
            } finally {
                setLoading(false);
            }
        };

        fetchHotelDetails();
    }, [id]);

    if (loading) {
        return <div className="p-5">Loading...</div>;
    }

    if (!hotel) {
        return <div className="p-5">Hotel not found</div>;
    }

    return (
        <div className="p-5 m-5">
            <div className="mb-4">
                <button
                    onClick={() => navigate('/admin/manage-hotels')}
                    className="btn btn-primary fs-4 px-4 mb-4"
                >
                    ← Back to Hotels List
                </button>
                <h1 className="text-3xl font-bold">{hotel.name}</h1>
            </div>

            {/* Image Gallery */}
            <div className="mb-6">

            </div>

            {/* Hotel Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="space-y-2">
                        <p className={"fs-2"}><strong>ID:</strong> {hotel.id}</p>
                        <p className={"fs-2"}><strong>Star Rating:</strong> {hotel.star} ★</p>
                        <p className={"fs-2"}><strong>Address:</strong> {hotel.address}</p>
                    </div>
                </div>

                <div>
                    <p className="fs-2 font-bold mb-3"><strong>Description:</strong></p>
                    <p className="fs-2">{hotel.description}</p>
                </div>
            </div>

            {/* Room Types */}
            <div className="mt-6">
                <p className="fs-2 font-bold mb-3"><strong>Room Types</strong></p>
                <div className={"my-3 row"}>
                    {hotel.room_types.map((room) => (
                        <div key={room.id} className="col-3 me-5 mt-3 border rounded-4 px-5 py-4 shadow-sm"
                             style={{ backgroundColor: "#f9f9f9", width: "fit-content" }}>
                            <h3 className="font-bold mb-2">
                                {room.type} Person Room
                            </h3>
                            <div className="space-y-1">
                                <p><strong>Regular Price:</strong> ${room.price}</p>
                                <p><strong>Weekend Price:</strong> ${room.weekend_price}</p>
                                <p><strong>Flexible Price:</strong> ${room.flexible_price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HotelDetails;