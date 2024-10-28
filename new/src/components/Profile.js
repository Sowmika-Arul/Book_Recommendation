// Profile.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        photo: '',
        bio: '',
        favoriteBooks: [],
        favoriteGenres: [],
        favoriteAuthors: [],
        themes: [],
        followers: 0,
        following: 0,
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
                        bio: data.bio || '',
                        favoriteBooks: data.favoriteBooks || [],
                        favoriteGenres: data.favoriteGenres || [],
                        favoriteAuthors: data.favoriteAuthors || [],
                        themes: data.themes || [],
                        followers: data.followers || 0,
                        following: data.following || 0,
                    });
                })
                .catch(error => {
                    console.error('Error fetching profile:', error);
                });
        }
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
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
                    photo: reader.result,
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
            body: JSON.stringify({ userId, ...profile }),
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            alert('Profile updated!');
            setProfile(data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Failed to update profile: ${error.message}`);
        });
    };

    return (
        <div className="profile-container">
            <div className="profile-left">
                <div className="profile-image-container">
                    {profile.photo ? (
                        <img src={profile.photo} alt="Profile" className="profile-pic" />
                    ) : (
                        <img src="https://via.placeholder.com/150" alt="Default" className="profile-pic" />
                    )}
                </div>
                <h2>{profile.name}</h2>
                <p><center>{profile.email}</center></p>
                <p className="bio">{profile.bio}</p>
                <div className="follower-info">
                    <p><strong>Followers:</strong> {profile.followers}</p>
                    <p><strong>Following:</strong> {profile.following}</p>
                </div><br></br>
                <center><Link to="/recommendations">
                    <button type="button">View Recommendations</button>
                </Link></center>
            </div>

            <div className="profile-right">
                <form onSubmit={handleSubmit}>
                    <h1>Profile Details</h1>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={profile.name}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={profile.email}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="bio"
                        placeholder="Bio"
                        value={profile.bio}
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
                        value={profile.favoriteBooks.join(', ')}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="favoriteGenres"
                        placeholder="Favorite Genres (comma separated)"
                        value={profile.favoriteGenres.join(', ')}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="favoriteAuthors"
                        placeholder="Favorite Authors (comma separated)"
                        value={profile.favoriteAuthors.join(', ')}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="themes"
                        placeholder="Themes (comma separated)"
                        value={profile.themes.join(', ')}
                        onChange={handleChange}
                    />
                    <button type="submit">Update Profile</button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
