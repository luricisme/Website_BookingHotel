const PaymentInfo = ({ t, images, setPaymentMethod }) => {
    return (
        <>
            <h2>{t("reserve.paymentHeader")}</h2>

            <div className="mt-5">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            id="momoMethod"
                            value="momo"
                            onChange={(event) => setPaymentMethod(event.target.value)}
                        />
                        <label className="form-check-label ms-5" htmlFor="momoMethod">
                            Momo
                        </label>
                    </div>

                    <img width={80} src={images.momoIcon} alt="" />
                </div>

                <div className="separate"></div>

                <div className="d-flex align-items-center justify-content-between">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            id="cashMethod"
                            value="cash"
                            onChange={(event) => setPaymentMethod(event.target.value)}
                        />
                        <label className="form-check-label ms-5" htmlFor="cashMethod">
                            {t("reserve.cash")}
                        </label>
                    </div>

                    <img width={80} src={images.cashIcon} alt="" />
                </div>
            </div>
        </>
    );
};
export default PaymentInfo;
