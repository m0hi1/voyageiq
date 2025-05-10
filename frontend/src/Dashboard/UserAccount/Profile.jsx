import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom"; // useNavigate can be removed if not redirecting
import BASE_URL from "../../utils/config";
import { AuthContext } from '../../contexts/AuthContext';
// useFetch might not be strictly needed here if AuthContext.user is always current.
// If it's for fetching the absolute latest version, ensure it's handled correctly.
// For now, we'll rely on AuthContext.user for form population.
// import useFetch from '../../hooks/useFetch';

const Profile = () => {
  // const navigate = useNavigate(); // Removed for now
  const { user, token, dispatch } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    photo: '', // Photo update functionality is not fully implemented yet
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        photo: user.photo || '', // Assuming photo URL is part of user object
      });
    }
  }, [user]);

  // If useFetch was intended to load initial data for the profile, it would look like this:
  // const { apiData: profileData, error: fetchError, loading: fetchLoading } = useFetch(
  //   user?._id ? `${BASE_URL}/users/${user._id}` : null
  // );
  // useEffect(() => {
  //   if (profileData) {
  //     setFormData({
  //       username: profileData.username || '',
  //       email: profileData.email || '',
  //       photo: profileData.photo || '',
  //     });
  //   }
  // }, [profileData]);
  // if (fetchError) {
  //   toast.error(fetchError);
  // }


  const handleInput = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Photo upload handling would go here - for future implementation
  // const handleFileChange = e => {
  //   const file = e.target.files[0];
  //   // Handle file preview and prepare for upload
  //   // setFormData({ ...formData, photo: file }); // This would need to be handled as FormData for upload
  // };

  const submitHandler = async e => {
    e.preventDefault();
    if (!user?._id) {
      toast.error("User not found. Cannot update profile.");
      return;
    }
    setIsLoading(true);

    try {
      // Create a payload with only fields that are meant to be updated.
      // Exclude 'photo' if it's not being handled as a file upload yet or if it's empty.
      const updatePayload = {
        username: formData.username,
        email: formData.email,
      };
      // if (formData.photo instanceof File) { /* Add logic for file upload */ }
      // else if (formData.photo) { updatePayload.photo = formData.photo; }


      const response = await fetch(`${BASE_URL}/users/${user._id}`, { // Corrected URL
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload), // Send only updatable fields
      });
      const result = await response.json();

      if (response.ok) {
        dispatch({
          type: 'UPDATE_USER',
          payload: {
            user: result.data, // Backend should return the updated user object in result.data
          },
        });
        toast.success(result.message || 'Profile updated successfully!');
        // navigate('/my-account/profile'); // Or stay, or navigate to a general dashboard
      } else {
        toast.error(result.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error('Server not responding or network error.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="py-8 text-center">
        <p>Loading user profile...</p>
        {/* Or redirect to login if no user and not loading */}
      </div>
    );
  }

  return (
    <div className="py-8 px-4 md:px-0">
      <h2 className="text-2xl font-semibold text-slate-700 mb-6">My Profile</h2>
      <form onSubmit={submitHandler} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-slate-600 mb-1">Username</label>
          <input
            type="text"
            placeholder="Your Name"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleInput}
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-BaseColor focus:border-transparent shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
          <input
            type="email"
            placeholder="Your Email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInput}
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-BaseColor focus:border-transparent shadow-sm"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="photo" className="block text-sm font-medium text-slate-600 mb-1">Profile Photo</label>
          <div className="flex items-center gap-4">
            {formData.photo && typeof formData.photo === 'string' && ( // Display existing photo if URL
              <figure className="w-16 h-16 rounded-full border-2 border-solid border-BaseColor flex items-center justify-center overflow-hidden">
                <img src={formData.photo.startsWith('http') ? formData.photo : `${BASE_URL}/${formData.photo}`} alt="Profile" className="w-full h-full object-cover" />
              </figure>
            )}
            {/* Input for photo upload - currently not functional for actual upload */}
            <div className="relative">
              <input
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-BaseColor file:text-white hover:file:bg-BHoverColor cursor-pointer"
                type="file"
                id="customFile"
                name="photoFile" // Changed name to avoid conflict if formData.photo is string URL
                accept=".png, .jpg, .jpeg"
                // onChange={handleFileChange} // Enable when file handling logic is added
                disabled // Disabled until file upload logic is implemented
              />
              <p className="text-xs text-slate-500 mt-1">Photo upload is not yet functional.</p>
            </div>
          </div>
        </div>

        <div>
          <button 
            type="submit"
            className="Searchbtn w-full rounded-md py-2.5 text-base font-medium disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
