import React, { useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import Swal from "sweetalert2";
import handleLogin from "./Post_Login";
import { handle_google_Login } from "../Google_auth/handle_google_Login";
import ReCAPTCHA from "react-google-recaptcha";
import Google_auth_data from "../../../google-auth.json";

function Login_Popup() {
    const Navigate = useNavigate();
    const recaptchaRef = useRef(); // Use ref for reCAPTCHA

    // Handle Google OAuth2 failure
    const handleFailure = (error) => {
        console.error("Google Login Error:", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong while logging in with Google. Please try again.",
        });
    };

    // Handle form submission with reCAPTCHA
    const handleSubmit = async (values, { setSubmitting }) => {
        const recaptchaValue = recaptchaRef.current?.getValue();
        if (!recaptchaValue) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please complete the reCAPTCHA.",
            });
            setSubmitting(false);
            return;
        }
        values.recaptcha = recaptchaValue;
        await handleLogin(values, { setSubmitting });
    };

    return (
        <div className="flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg flex flex-col items-center p-6">
                <div className="w-full text-black_text">
                    <div className="pb-4">
                        <div className="text-3xl font-semibold">Log in</div>
                        <div>Sign in to get started.</div>
                    </div>

                    {/* Google Login Button */}
                    <div className="w-fit mx-auto mb-4">
                        <GoogleLogin
                            onSuccess={(response) =>
                                handle_google_Login(response, Navigate)
                            }
                            onError={handleFailure}
                            text="continue_with"
                        />
                    </div>

                    {/* Email and Password Login Form */}
                    <Formik
                        initialValues={{
                            userType: "user",
                            email: "",
                            password: "",
                        }}
                        validate={(values) => {
                            const errors = {};
                            if (!values.email) {
                                errors.email = "Email is required";
                            } else if (
                                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                                    values.email
                                )
                            ) {
                                errors.email = "Invalid email address";
                            }
                            if (!values.password) {
                                errors.password = "Password is required";
                            } else if (values.password.length < 8) {
                                errors.password =
                                    "Password must be at least 8 characters long";
                            }
                            return errors;
                        }}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="flex flex-col text-sm md:text-lg gap-4 text-black_text">
                                <div>
                                    <div className="font-semibold text-sm pb-1">
                                        Email
                                    </div>
                                    <Field
                                        placeholder="example@gmail.com"
                                        type="email"
                                        name="email"
                                        disabled={isSubmitting}
                                        className="border border-gray_white px-4 py-2 rounded-lg text-sm w-full"
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>

                                <div>
                                    <div className="font-semibold text-sm pb-1">
                                        Password
                                    </div>
                                    <Field
                                        placeholder="•••••••••••••••••••"
                                        type="password"
                                        name="password"
                                        disabled={isSubmitting}
                                        className="border border-gray_white px-4 py-2 rounded-lg text-sm w-full"
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>

                                {/* reCAPTCHA */}
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={Google_auth_data.CAPATCHA_SITE_KEY}
                                />

                                {isSubmitting ? (
                                    <span className="small-loader my-5 m-auto"></span>
                                ) : (
                                    <button
                                        type="submit"
                                        className="bg-perpol_v py-2 mt-4 rounded-2xl text-white font-semibold"
                                        disabled={isSubmitting}
                                    >
                                        Get Started
                                    </button>
                                )}
                            </Form>
                        )}
                    </Formik>

                    {/* Sign Up Link */}
                    <div className="pt-6 text-sm font-semibold text-gray_v text-center">
                        Don’t have an account?{" "}
                        <Link
                            to="/Register"
                            className="underline text-perpol_v"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login_Popup;
