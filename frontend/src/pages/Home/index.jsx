import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import "./Home.scss";
import SearchBar from "../../components/SearchBar";
import HotelCard from "../../components/HotelCard/HotelCard";
import { useNavigate } from "react-router-dom";
import { getRecommendHotels } from "~/services/apiService";
import { useSelector } from "react-redux";

const MockData = [
    {
        id: 1,
        url: "https://kinsley.bslthemes.com/wp-content/uploads/2021/08/img-banner-2-scaled-1-1920x1315.jpg",
    },
    {
        id: 2,
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: 3,
        url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: 4,
        url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
];

const Home = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const MockDestination = [
        {
            id: 1,
            title: t("homepage.hcm"),
            value: "Ho Chi Minh",
            url: "https://plus.unsplash.com/premium_photo-1663050967225-1735152ab894?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            id: 2,
            title: t("homepage.hanoi"),
            value: "Ha Noi",
            url: "https://plus.unsplash.com/premium_photo-1691960159290-6f4ace6e6c4c?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            id: 3,
            title: t("homepage.danang"),
            value: "Da Nang",
            url: "https://images.unsplash.com/photo-1670993077545-bfeeea1e0b5f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            id: 4,
            title: t("homepage.vungtau"),
            value: "Vung Tau",
            url: "https://images.unsplash.com/photo-1707827547063-1fff65d22682?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            id: 5,
            title: t("homepage.dalat"),
            value: "Da Lat",
            url: "https://images.unsplash.com/photo-1678099006439-dba9e4d3f9f5?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
    ];

    const userInfo = useSelector((state) => state.account.userInfo);

    const [recommendHotels, setRecommendHotels] = useState([]);
    const [images, setImages] = useState(MockData);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const lastIndex = images.length - 1;
        if (index < 0) {
            setIndex(lastIndex);
        }
        if (index > lastIndex) {
            setIndex(0);
        }
    }, [index, images]);

    useEffect(() => {
        let slider = setInterval(() => {
            setIndex(index + 1);
        }, 10000);
        return () => clearInterval(slider);
    }, [index]);

    const listRef = useRef(null);
    const itemPerView = 3;

    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    const handleScroll = () => {
        if (!listRef.current) return;

        setIsAtStart(listRef.current.scrollLeft === 0);

        const isAtEnd =
            Math.ceil(listRef.current.scrollLeft + listRef.current.clientWidth) >=
            listRef.current.scrollWidth;
        setIsAtEnd(isAtEnd);
    };

    useEffect(() => {
        if (recommendHotels.length <= itemPerView) {
            setIsAtStart(true);
            setIsAtEnd(true);
            return;
        }

        const list = listRef.current;
        if (!list) return;

        list.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => {
            list.removeEventListener("scroll", handleScroll);
        };
    }, [recommendHotels.length]);

    const [scrollInProgress, setScrollInProgress] = useState(false);

    const handlePrev = () => {
        if (!listRef.current || scrollInProgress) return;

        setScrollInProgress(true);
        const gap = parseInt(getComputedStyle(listRef.current).gap);
        const itemWidth = (listRef.current.offsetWidth - gap * (itemPerView - 1)) / itemPerView;
        const scrollAmount = itemWidth + gap;

        listRef.current.scrollBy({
            left: -scrollAmount,
            behavior: "smooth",
        });

        setTimeout(() => setScrollInProgress(false), 500);
    };

    const handleNext = () => {
        if (!listRef.current || scrollInProgress) return;

        setScrollInProgress(true);
        const gap = parseInt(getComputedStyle(listRef.current).gap);
        const itemWidth = (listRef.current.offsetWidth - gap * (itemPerView - 1)) / itemPerView;
        const scrollAmount = itemWidth + gap;

        listRef.current.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
        });

        setTimeout(() => setScrollInProgress(false), 500);
    };

    useEffect(() => {
        const fetchRecommendHotels = async () => {
            try {
                const response = await getRecommendHotels(userInfo.id);

                if (response.status_code === 200 && response.data) {
                    setRecommendHotels(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchRecommendHotels();
    }, []);

    return (
        <section className="homepage">
            <div className="homepage__top">
                <div className="homepage__slider">
                    {images &&
                        images.length > 0 &&
                        images.map((image, imageIndex) => {
                            let position = "nextSlide";
                            if (imageIndex === index) {
                                position = "activeSlide";
                            }
                            if (
                                imageIndex === index - 1 ||
                                (index === 0 && imageIndex === images.length - 1)
                            ) {
                                position = "lastSlide";
                            }

                            return (
                                <div
                                    key={`image-${imageIndex}`}
                                    className={`homepage__slider-image-wrap ${position}`}
                                >
                                    <img
                                        className="homepage__slider-image"
                                        src={image.url}
                                        alt={`image-${imageIndex}`}
                                    />
                                </div>
                            );
                        })}
                    <div className="homepage__slider-overlay"></div>

                    <div className="homepage__slider-nav">
                        {images &&
                            images.length > 0 &&
                            images.map((image, i) => (
                                <span
                                    key={i}
                                    className={`homepage__slider-nav-item ${
                                        index === i ? "homepage__slider-nav-item--active" : ""
                                    }`}
                                    onClick={() => setIndex(i)}
                                ></span>
                            ))}
                    </div>

                    <h1 className="homepage__title">
                        No matter where you’re going to, we’ll take you there
                    </h1>
                </div>
                <div className="homepage__search-bar">
                    <SearchBar border-radius={12} />
                </div>
            </div>

            <div className="homepage__top-destination">
                <h2 className="homepage__top-destination-title">{t("homepage.topDestinations")}</h2>

                <div className="homepage__top-destination-list">
                    {MockDestination &&
                        MockDestination.length > 0 &&
                        MockDestination.map((destination, index) => {
                            return (
                                <a
                                    href="#!"
                                    key={destination.id}
                                    className="destination-item"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate(`/after-search`, {
                                            state: {
                                                destination: destination.value,
                                                startDate: "2025-01-01",
                                                endDate: "2025-01-02",
                                            },
                                        });
                                    }}
                                >
                                    <div className="destination-item__image-wrap">
                                        <img
                                            className="destination-item__image"
                                            src={destination.url}
                                            alt={destination.title}
                                        />
                                    </div>
                                    <h3 className="destination-item__title">{destination.title}</h3>
                                </a>
                            );
                        })}
                </div>
            </div>

            {recommendHotels.length > 0 && (
                <div className="homepage__recommend">
                    <h2 className="homepage__recommend-title">{t("homepage.recommendedForYou")}</h2>

                    <div className="homepage__recommend-list-wrap">
                        <div className="homepage__recommend-list" ref={listRef}>
                            {recommendHotels &&
                                recommendHotels.length > 0 &&
                                recommendHotels.map((hotel, index) => {
                                    return (
                                        <div
                                            key={`recommend-${hotel.id}`}
                                            className="homepage__recommend-item"
                                        >
                                            <HotelCard {...hotel} />
                                        </div>
                                    );
                                })}
                        </div>
                        <div className="homepage__recommend-list-actions">
                            <button
                                className={`homepage__recommend-btn ${isAtStart ? "hide" : ""}`}
                                onClick={() => handlePrev()}
                            >
                                <svg
                                    className="homepage__recommend-btn-icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 320 512"
                                >
                                    <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                                </svg>
                            </button>
                            <button
                                className={`homepage__recommend-btn ${isAtEnd ? "hide" : ""}`}
                                onClick={() => handleNext()}
                            >
                                <svg
                                    className="homepage__recommend-btn-icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 320 512"
                                >
                                    <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Home;
