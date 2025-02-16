import { useTranslation } from "react-i18next";

const UserInfo = ({ formik }) => {
    const { t } = useTranslation();

    return (
        <>
            <h2>{t("reserve.detailHeader")}</h2>

            <form className="mt-5" onSubmit={formik.handleSubmit}>
                <div className="row row-cols-1 row-cols-lg-2">
                    <div className="col">
                        <div className="mb-4">
                            <label htmlFor="reserveFirstNameInput" className="form-label">
                                {t("reserve.name")}: <span className="red-dot">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                disabled
                                className={`form-control form-control-lg fs-4  ${
                                    formik.errors.name && formik.touched.name ? "is-invalid" : ""
                                }`}
                                id="reserveFirstNameInput"
                                placeholder="Enter your name"
                            />
                            <div className="invalid-feedback">{formik.errors.name}</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="mb-4">
                            <label htmlFor="reserveLastNameInput" className="form-label">
                                {t("reserve.identityNumber")}: <span className="red-dot">*</span>
                            </label>
                            <input
                                type="text"
                                name="cccd"
                                value={formik.values.cccd}
                                onChange={formik.handleChange}
                                disabled
                                className={`form-control form-control-lg fs-4  ${
                                    formik.errors.cccd && formik.touched.cccd ? "is-invalid" : ""
                                }`}
                                id="reserveLastNameInput"
                                placeholder="Enter your cccd"
                            />
                            <div className="invalid-feedback">{formik.errors.cccd}</div>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="reserveEmailInput" className="form-label">
                        {t("reserve.email")}: <span className="red-dot">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        disabled
                        className={`form-control form-control-lg fs-4  ${
                            formik.errors.email && formik.touched.email ? "is-invalid" : ""
                        }`}
                        id="reserveEmailInput"
                        placeholder="Enter your email"
                    />
                    <div className="invalid-feedback">{formik.errors.email}</div>
                </div>

                <div className="row row-cols-1 row-cols-lg-2">
                    <div className="col">
                        <div className="mb-4">
                            <label htmlFor="reservePhoneInput" className="form-label">
                                {t("reserve.phone")}: <span className="red-dot">*</span>
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={formik.values.phone}
                                disabled
                                onChange={formik.handleChange}
                                className={`form-control form-control-lg fs-4  ${
                                    formik.errors.phone && formik.touched.phone ? "is-invalid" : ""
                                }`}
                                id="reservePhoneInput"
                                placeholder="Enter your phone number"
                            />
                            <div className="invalid-feedback">{formik.errors.phone}</div>
                        </div>
                    </div>
                </div>

                <div className="separate"></div>

                <div className="mb-5">
                    <label className="form-label" htmlFor="reserveSpecialRequestTextarea">
                        {t("reserve.specialRequests")}:
                    </label>
                    <textarea
                        className="form-control fs-4 "
                        placeholder="Enter your special request"
                        id="reserveSpecialRequestTextarea"
                        value={formik.values.specialRequest}
                        onChange={formik.handleChange}
                        name="specialRequest"
                    ></textarea>
                </div>
            </form>
        </>
    );
};
export default UserInfo;
