import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { userLogin } from "~/services/apiService";
import { useDispatch } from "react-redux";
import { doLogin } from "~/redux/action/accountAction";
import { toast } from "react-toastify";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            email,
            password,
        };

        // Gọi API login
        // const res = await userLogin(data);
        const res = await dispatch(doLogin(email, password));

        console.log(">>> login res", res);

        if (res && res.EC === 0) {
            toast.success("Login successfully!");
            navigate("/");
        } else {
            toast.error(`Login failed: ${res?.EM}`);
        }
        // Nếu email và mật khẩu hợp lệ, chuyển hướng tới Dashboard
    };

    return (
        <div className="d-flex justify-content-center align-items-center body">
            <div
                className="login-container shadow-lg"
                style={{ backgroundColor: "#fff", padding: "40px", color: "#000", height: "100%" }}
            >
                <h1 className="text-center login-title mb-3">LOGIN</h1>
                <form onSubmit={handleSubmit} className="d-flex flex-column py-3">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email address
                        </label>
                        <input
                            type="email"
                            className="form-control py-3 fs-4 mb-3"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control py-3 fs-4"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center">
                            {/* <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                className="me-2 mt-1"
                            />
                            <label htmlFor="rememberMe">Save password</label> */}
                        </div>
                        <a id="forgetPassword" href="/forgot-password">
                            Forget password?
                        </a>
                    </div>
                    <input type="submit" className="login mb-0 py-2 mt-3" value="OK" />
                </form>
                <p className="text-center mt-5 mb-0">
                    Don't have an account? <a href="/register">Register</a>
                </p>
            </div>
        </div>
    );
}

export default Login;
