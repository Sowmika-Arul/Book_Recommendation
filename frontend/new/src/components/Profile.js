import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        photo: '',
        favoriteBooks: [],
        favoriteGenres: [],
        favoriteAuthors: [],
        themes: [],
    });

    const [userId, setUserId] = useState(localStorage.getItem('userId') || '');

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:5057/api/profile/${userId}`)
                .then(res => res.json())
                .then(data => {
                    setProfile({
                        name: data.name || '',
                        email: data.email || '',
                        photo: data.photo || '',
                        favoriteBooks: data.favoriteBooks || [],
                        favoriteGenres: data.favoriteGenres || [],
                        favoriteAuthors: data.favoriteAuthors || [],
                        themes: data.themes || [],
                    });
                })
                .catch(error => {
                    console.error('Error fetching profile:', error);
                });
        }
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Update the state based on the input field name
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: name === 'favoriteBooks' || name === 'favoriteGenres' || name === 'favoriteAuthors' || name === 'themes'
                ? value.split(',').map(item => item.trim())
                : value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prevProfile => ({
                    ...prevProfile,
                    photo: reader.result, // Set the new photo URL
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:5057/api/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, ...profile }), // Send the updated profile
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            alert('Profile updated!');
            setProfile(data); // Update the local state with the new profile data
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Failed to update profile: ${error.message}`);
        });
    };

    return (
        <div className="profile-container">
            {/* Left Side: Profile Picture, Name, Email */}
            <div className="profile-left">
                <div className="profile-image-container">
                    {profile.photo ? (
                        <img src={profile.photo} alt="Profile" className="profile-pic" />
                    ) : (
                        <img src="https://via.placeholder.com/150" alt="Default" className="profile-pic" />
                    )}
                </div>
                <h2>{profile.name}</h2>
                <p>{profile.email}</p>
            </div>

            {/* Right Side: Form for Name, Email, Favorite Details and Profile Picture */}
            <div className="profile-right">
                <form onSubmit={handleSubmit}>
                    <h1>Profile Details</h1>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={profile.name} // Bind the name input to the profile state
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={profile.email} // Bind the email input to the profile state
                        onChange={handleChange}
                    />
                    <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <h2>Favorite Details</h2>
                    <input
                        type="text"
                        name="favoriteBooks"
                        placeholder="Favorite Books (comma separated)"
                        value={profile.favoriteBooks.join(', ')} // Display current favorite books
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="favoriteGenres"
                        placeholder="Favorite Genres (comma separated)"
                        value={profile.favoriteGenres.join(', ')} // Display current favorite genres
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="favoriteAuthors"
                        placeholder="Favorite Authors (comma separated)"
                        value={profile.favoriteAuthors.join(', ')} // Display current favorite authors
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="themes"
                        placeholder="Themes (comma separated)"
                        value={profile.themes.join(', ')} // Display current themes
                        onChange={handleChange}
                    />
                    <button type="submit">Update Profile</button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
