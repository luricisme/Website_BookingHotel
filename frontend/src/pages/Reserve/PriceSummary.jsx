const PriceSummary = ({ sumPrice, bookingInfo, t, summaryInfo }) => {
    const originalPrice = bookingInfo?.sumPrice || sumPrice || 0;
    const totalPrice = summaryInfo.totalPrice || bookingInfo?.sumPrice || sumPrice || 0;
    const discountAmount = summaryInfo.discountAmount || originalPrice - totalPrice || 0;

    return (
        <div className="reserve-container">
            <h3>{t("reserve.summaryHeader")}</h3>

            <div className="separate mx-0 my-3"></div>

            <div className="d-flex justify-content-between">
                <span>{t("reserve.originalPrice")}</span>
                <span className="ms-3">{originalPrice.toLocaleString()} VND</span>
            </div>

            <div className="d-flex justify-content-between">
                <span>{t("reserve.discount")}</span>
                <span className="ms-3">{discountAmount.toLocaleString()} VND</span>
            </div>

            <div className="d-flex justify-content-between mt-5 fs-4  fw-bold">
                <span>{t("reserve.totalPrice")}</span>
                <span className="ms-3">{totalPrice.toLocaleString()} VND</span>
            </div>
        </div>
    );
};
export default PriceSummary;
