import { useRef } from "react";
import { formatCheckInOutDate, formatDate } from "~/utils/datetime";

const HotelInfo = ({
    hotelDetail,
    bookingInfo,
    checkInDate,
    checkOutDate,
    roomType2,
    roomType4,
    rooms,
    sumPrice,
    type2Price,
    type4Price,
    userId,
    numberOfRoom2,
    numberOfRoom4,
    tempInfo,
    hotelId,
    icons,
    navigate,
    t,
}) => {
    const roomsInfoRef = useRef();

    const handleToggleIcon = (event) => {
        event.target.style.transform = `rotate(${
            event.target.style.transform === "rotate(-180deg)" ? "0deg" : "-180deg"
        })`;

        console.log(roomsInfoRef.current.className);

        roomsInfoRef.current.className =
            roomsInfoRef.current.className === "collapse" ? "collapse show" : "collapse";
    };

    return (
        <div className="reserve-container">
            <h3>{t("reserve.bookingHeader")}</h3>

            <div className="separate my-4 mx-0"></div>

            {/* Hotel info */}
            <div>
                <div className="d-flex align-items-center gap-4 mb-1">
                    <span className="fw-lighter">{t("reserve.hotel")}</span>
                    <div className="d-flex gap-1">
                        {[...Array(hotelDetail?.star || bookingInfo?.hotel?.star || 0)].map(
                            (_, index) => (
                                <img
                                    style={{ width: 20 }}
                                    key={index}
                                    src={icons.yellowStarIcon}
                                    alt="star"
                                    className="hotel-card__star-icon"
                                />
                            )
                        )}
                    </div>
                </div>
                <h2>{hotelDetail?.name || bookingInfo?.hotel?.name}</h2>
                <p className="fw-light mt-3">
                    {hotelDetail?.address || bookingInfo?.hotel?.address}
                </p>
            </div>
            {/* Detail */}
            <div>
                <div className="d-flex mt-4">
                    <div>
                        <span>Check-in</span>
                        <h4 className="mt-2 fs-3 fw-bold">
                            {formatCheckInOutDate(
                                checkInDate || tempInfo?.checkInDate || bookingInfo?.checkInDate,
                                localStorage.getItem("i18nextLng")
                            )}
                        </h4>
                    </div>

                    <div className="separate--vertical"></div>

                    <div>
                        <span>Check-out</span>
                        <h4 className="mt-2 fs-3 fw-bold">
                            {formatCheckInOutDate(
                                checkOutDate || tempInfo?.checkOutDate || bookingInfo?.checkOutDate,
                                localStorage.getItem("i18nextLng")
                            )}
                        </h4>
                    </div>
                </div>
            </div>

            <div className="separate mx-0 mt-5 mb-4"></div>
            {/* Room */}
            <div>
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <span className="fs-4  fw-medium">{t("reserve.yourChoice")}</span>
                        <p className="fs-3 fw-bold">
                            {numberOfRoom2 + numberOfRoom4 ||
                                bookingInfo?.roomType2 + bookingInfo?.roomType4}{" "}
                            {t("reserve.rooms")}
                        </p>
                    </div>

                    <button>
                        <img
                            style={{
                                width: 20,
                                transition: "transform 0.5s",
                            }}
                            src={icons.chevronDownIcon}
                            alt="chevron-down"
                            onClick={(event) => handleToggleIcon(event)}
                        />
                    </button>
                </div>

                <div className="collapse" ref={(ref) => (roomsInfoRef.current = ref)}>
                    <p className="fw-medium">
                        {bookingInfo?.roomType2 || numberOfRoom2} x {t("reserve.double")}
                    </p>
                    <p className="fw-medium">
                        {bookingInfo?.roomType4 || numberOfRoom4} x {t("reserve.quadruple")}
                    </p>
                </div>
            </div>
            <a
                href="#!"
                onClick={(e) => {
                    e.preventDefault();
                    navigate(`/hotel/${hotelId}`, {
                        state: {
                            checkInDate: formatDate(checkInDate, "yyyy-mm-dd"),
                            checkOutDate: formatDate(checkOutDate, "yyyy-mm-dd"),
                            roomType2,
                            roomType4,
                            rooms,
                            sumPrice,
                            type2Price,
                            type4Price,
                            userId,
                            numberOfRoom2,
                            numberOfRoom4,
                        },
                    });
                }}
            >
                <span className="reserve-page__change">{t("reserve.changeYourChoice")}</span>
            </a>
        </div>
    );
};
export default HotelInfo;
