import React, { useState } from "react";
import icons from "../../assets/icon";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./ReviewSection.css";

function ReviewsSection({ reviews }) {
    const [selectedComment, setSelectedComment] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (comment) => {
        setSelectedComment(comment);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedComment("");
    };

    return (
        <div className="reviews-section">
            {reviews.length > 1 ? (
                <>
                    {/* Nút điều hướng */}
                    <div
                        className="swiper-button-prev"
                        style={{
                            width: "100px",
                            position: "unset",
                            marginTop: "100px",
                            marginRight: "20px",
                        }}
                    >
                        <img src={icons.chevronLeftIcon} alt="Previous" />
                    </div>
                    {/* Slider */}
                    <Swiper
                        slidesPerView={2} // Hiển thị 2 review mỗi lần
                        spaceBetween={30} // Khoảng cách giữa các review
                        navigation={{
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev",
                        }} // Kết nối với các nút
                        modules={[Navigation]}
                        className="reviews-slider"
                    >
                        {reviews.map((review) => (
                            <SwiperSlide
                                key={review.id}
                                className="d-flex justify-content-center"
                            >
                                <div className="review-card row">
                                    <div className="profile-pic col-3">
                                        <img
                                            src={review.avatar}
                                            alt="Profile"
                                            className="avatar-image"
                                        />
                                    </div>
                                    <div className="review-info col-8">
                                        <div className="name mb-2 fs-2 fw-bold">{review.name}</div>
                                        <div className="stars">
                                            {Array.from({ length: 5 }).map((_, index) => {
                                                const isFullStar = review.rate >= index + 1;
                                                return (
                                                    <img
                                                        key={index}
                                                        src={
                                                            isFullStar
                                                                ? icons.starYellowIcon
                                                                : icons.starEmptyIcon
                                                        }
                                                        alt={isFullStar ? "Star" : "Empty Star"}
                                                        className="star-icon"
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="comment">
                                        {review.comment.length > 250 ? (
                                            <>
                                                {review.comment.slice(0, 250)}...
                                                <button
                                                    className="read-more-btn"
                                                    onClick={() =>
                                                        handleOpenModal([
                                                            review.comment,
                                                            review.name,
                                                            review.rate,
                                                            review.avatar,
                                                        ])
                                                    }
                                                >
                                                    Xem thêm
                                                </button>
                                            </>
                                        ) : (
                                            review.comment
                                        )}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div
                        className="swiper-button-next"
                        style={{
                            width: "100px",
                            position: "unset",
                            marginTop: "100px",
                            marginLeft: "20px",
                        }}
                    >
                        <img src={icons.chevronRightIcon} alt="Next" />
                    </div>
                </>
            ) : reviews.length === 1 ? (
                <div className="review-card row">
                    <div className="profile-pic col-3">
                        <img
                            src={reviews[0].avatar}
                            alt="Profile"
                            className="avatar-image"
                        />
                    </div>
                    <div className="review-info col-8">
                        <div className="name mb-2 fs-2 fw-bold">{reviews[0].name}</div>
                        <div className="stars">
                            {Array.from({ length: 5 }).map((_, index) => {
                                const isFullStar = reviews[0].rate >= index + 1;
                                return (
                                    <img
                                        key={index}
                                        src={
                                            isFullStar
                                                ? icons.starYellowIcon
                                                : icons.starEmptyIcon
                                        }
                                        alt={isFullStar ? "Star" : "Empty Star"}
                                        className="star-icon"
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <div className="comment">
                        {reviews[0].comment.length > 250 ? (
                            <>
                                {reviews[0].comment.slice(0, 250)}...
                                <button
                                    className="read-more-btn"
                                    onClick={() =>
                                        handleOpenModal([
                                            reviews[0].comment,
                                            reviews[0].name,
                                            reviews[0].rate,
                                            reviews[0].avatar,
                                        ])
                                    }
                                >
                                    Xem thêm
                                </button>
                            </>
                        ) : (
                            reviews[0].comment
                        )}
                    </div>
                </div>
            ) : (
                <p>No reviews available.</p>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div
                        className="review-modal-content"
                        onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan ra overlay
                    >
                        <button className="close-modal-btn" onClick={handleCloseModal}>
                            &times;
                        </button>
                        <div
                            className="review-card row"
                            style={{ width: "600px", padding: "10px" }}
                        >
                            <div className="profile-pic col-2 mb-3">
                                <img
                                    src={selectedComment[3]}
                                    alt="Profile"
                                    className="avatar-image"
                                />
                            </div>
                            <div className="review-info col-8">
                                <div className="name mb-2 fs-2 fw-bold">{selectedComment[1]}</div>
                                <div className="stars">
                                    {Array.from({ length: 5 }).map((_, index) => {
                                        const isFullStar = selectedComment[2] >= index + 1;
                                        return (
                                            <img
                                                key={index}
                                                src={
                                                    isFullStar
                                                        ? icons.starYellowIcon
                                                        : icons.starEmptyIcon
                                                }
                                                alt={isFullStar ? "Star" : "Empty Star"}
                                                className="star-icon"
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="comment">{selectedComment[0]}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReviewsSection;
