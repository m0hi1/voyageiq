import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegisterImg from '../assets/images/Signup2.png';
import { Link, useNavigate } from 'react-router-dom';
import BASE_URL from '../utils/config';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    photo: '', // This field is in state but not in the form; ensure this is intended.
    role: 'user',
  });

  const handleInput = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // It's good practice to await response.json() to get the body content
      const result = await response.json();

      if (response.ok) {
        toast.success(
          result.message ||
            'Account created successfully! Please proceed to login.'
        );
        navigate('/login');
      } else {
        toast.error(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      toast.error(
        'An error occurred. Please check your connection or try again later.'
      );
      console.error('Registration error:', err); // Log for debugging
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Sign Up Photo Section */}
        <div className="hidden md:block rounded-lg overflow-hidden">
          <img
            src={RegisterImg}
            alt="Illustration of people collaborating on a project" // More descriptive alt text
            className="w-full h-full object-cover"
          />
        </div>

        {/* Sign Up Form Section */}
        <div className="flex flex-col justify-center">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
              Create Your Account
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Join our community and start your journey!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="e.g., cooluser123"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-BaseColor focus:border-transparent placeholder-slate-400 transition-shadow duration-150 ease-in-out shadow-sm hover:shadow-md"
                value={formData.username}
                onChange={handleInput}
                required
                aria-label="Username"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-BaseColor focus:border-transparent placeholder-slate-400 transition-shadow duration-150 ease-in-out shadow-sm hover:shadow-md"
                value={formData.email}
                onChange={handleInput}
                required
                aria-label="Email Address"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-BaseColor focus:border-transparent placeholder-slate-400 transition-shadow duration-150 ease-in-out shadow-sm hover:shadow-md"
                value={formData.password}
                onChange={handleInput}
                required
                aria-label="Password"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 mt-2 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-BaseColor hover:bg-BHoverColor focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-BaseColor transition-all duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Registering...
                  </span>
                ) : (
                  'Register'
                )}
              </button>
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-500">Or continue with</p>
                <button
                  type="button"
                  onClick={() =>
                    window.alert(
                      'Google authentication is currently under development. Please check back later.'
                    )
                  }
                  className="w-full mt-2 py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-BaseColor transition-all duration-150 ease-in-out flex items-center justify-center"
                >
                  {/* You can add a Google icon here */}
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56,12.25C22.56,11.47 22.49,10.72 22.36,10H12V14.26H17.94C17.71,15.63 16.95,16.82 15.82,17.56V20.18H19.45C21.45,18.37 22.56,15.54 22.56,12.25Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12,23C14.97,23 17.45,22.04 19.45,20.18L15.82,17.56C14.83,18.22 13.53,18.62 12,18.62C9.31,18.62 7.02,16.88 6.19,14.54H2.44V17.21C4.44,20.69 7.96,23 12,23Z"
                      fill="#34A853"
                    />
                    <path
                      d="M6.19,14.54C5.96,13.82 5.82,13.06 5.82,12.25C5.82,11.44 5.96,10.68 6.19,9.96V7.29H2.44C1.5,8.99 1,10.56 1,12.25C1,13.94 1.5,15.51 2.44,17.21L6.19,14.54Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12,5.88C13.68,5.88 15.11,6.46 16.21,7.48L19.52,4.39C17.45,2.59 14.97,1.5 12,1.5C7.96,1.5 4.44,3.81 2.44,7.29L6.19,9.96C7.02,7.62 9.31,5.88 12,5.88Z"
                      fill="#EA4335"
                    />
                  </svg>
                  Login with Google (In Development)
                </button>
              </div>
              <p className="mt-6 text-sm text-center text-slate-600">
                Already have an account?{' '}
                <Link
                  className="font-medium text-BaseColor hover:text-BHoverColor hover:underline transition-colors duration-150"
                  to="/login"
                >
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
