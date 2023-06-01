import React, { useState } from "react";
import Error from "components/shared/Error";
import { useRegisterMutation } from "features/auth/authApi";
import { userLoggedIn } from "features/auth/authSlice";
import { size } from "lodash";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toastAlert } from "utils/AppHelpers";

const StudentRegistration = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const [mutationData, setMutationData] = useState({});
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (type, value) => {
    setMutationData((prevData) => ({ ...prevData, [type]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = { ...mutationData, role: "student" };
    delete updatedData.confirmPassword;

    if (mutationData?.password !== mutationData.confirmPassword) {
      setError("Password does not match");
    } else if (size(updatedData)) {
      setError("");
      register(updatedData)
        .unwrap()
        .then((payload) => {
          const { accessToken, user } = payload;
          const result = {
            accessToken,
            user,
          };

          if (size(result)) {
            localStorage.setItem("auth", JSON.stringify(result));
            dispatch(userLoggedIn(result));
          }
          navigate("/course-player");
        })
        .catch((err) => {
          toastAlert("error", err?.data || err?.error);
        });
    }
  };

  return (
    <section className="py-6 bg-primary h-screen grid place-items-center">
      <div className="mx-auto max-w-md px-5 lg:px-0">
        <div>
          <img
            className="h-12 mx-auto"
            src="/assets/image/learningportal.svg"
            alt="logo"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-100">
            Create Your New Account
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="name"
                autoComplete="name"
                required
                className="login-input rounded-t-md"
                placeholder="Student name"
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="login-input "
                placeholder="Email address"
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="login-input"
                placeholder="Password"
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="confirm-password"
                required
                className="login-input rounded-b-md"
                placeholder="Confirm password"
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              {isLoading ? "Authenticating..." : " Create Account"}
            </button>
          </div>

          {/* error message */}
          {error && <Error message={error} />}

          <p className="text-sm text-center mt-3">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/")}
              className="link-span font-medium text-violet-600 hover:text-violet-500"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </section>
  );
};

export default StudentRegistration;
