import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoImg from '../../../assets/logo_hrms.svg'
import login1Img from '../../../assets/login1Img.png'
import login2Img from '../../../assets/login21Img.png'
import { login } from "../../../Redux/Actions/loginActions";
import "./Login.scss";
import { Eye, EyeClosed } from "lucide-react";

// react-icons se eye icon

const Login = ({ }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading } = useSelector((state) => state.login);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        const loginData = { email, password };

        dispatch(login(loginData)).then((res) => {
            if (res?.access_token) {
                toast.success(res?.message || "Login Successfully", {
                    position: "top-right",
                    autoClose: 3000,
                });

                // setIsLoggedIn(true);
                navigate("/", { replace: true });

            } else {
                toast.error(res?.message, {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        });
    };

    return (
        <div className="login-page">
            {/* Left Side (Form) */}
            <div className="login-form-section">
                <div className="logo">
                    <span className="logo-icon"><img src={logoImg} /></span>
                    <span className="logo-text">HRMS</span>
                </div>

                <h2 className="login-title">Log In To Your Account</h2>

                <form onSubmit={handleLogin} className="login-form">
                    <label>User name or email address*</label>
                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password*</label>
                    <div className="password-input">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeClosed /> : <Eye />}
                        </span>
                    </div>

                    {/* Simple button with loader */}
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? (
                            <span className="loader"></span>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
            </div>

            {/* Right Side (Banner) */}
            <div className="login-banner">
                <div className="banner-content">
                    <img
                        src={login1Img}
                        alt="dashboard preview"
                        className="banner-image-1"
                    />
                    <img
                        src={login2Img}
                        alt="dashboard preview"
                        className="banner-image-2"
                    />
                    <p className="banner-text">
                        Streamline your HR tasks and boost team engagement with our innovative management platform.
                    </p>
                    <span className="banner-link">Sign In Now</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
