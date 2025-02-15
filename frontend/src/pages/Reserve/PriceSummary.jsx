const PriceSummary = ({ sumPrice, bookingInfo, t }) => {
    return (
        <div className="reserve-container">
            <h3>{t("reserve.summaryHeader")}</h3>

            <div className="separate mx-0 my-3"></div>

            <div className="d-flex justify-content-between">
                <span>{t("reserve.originalPrice")}</span>
                <span className="ms-3">
                    {bookingInfo?.sumPrice?.toLocaleString() || sumPrice?.toLocaleString()} VND
                </span>
            </div>

            <div className="d-flex justify-content-between">
                <span>{t("reserve.discount")}</span>
                <span className="ms-3">0 VND</span>
            </div>

            <div className="d-flex justify-content-between mt-5 fs-4  fw-bold">
                <span>{t("reserve.totalPrice")}</span>
                <span className="ms-3">
                    {bookingInfo?.sumPrice?.toLocaleString() || sumPrice?.toLocaleString()} VND
                </span>
            </div>
        </div>
    );
};
export default PriceSummary;
