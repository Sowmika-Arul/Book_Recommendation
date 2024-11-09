import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
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

    const [isEditing, setIsEditing] = useState(false); // State for toggling edit mode
    const [userId, setUserId] = useState(localStorage.getItem('userId') || ''); // Retrieve userId from localStorage
    const navigate = useNavigate(); // useNavigate hook for redirection

    // Check for userId in localStorage and redirect to login if it's not present
    useEffect(() => {
        if (!userId) {
            navigate('/'); // Redirect to login if no userId
        } else {
            // Fetch profile data if userId exists
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
    }, [userId, navigate]); // Only run once on mount or when userId changes

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

    const handleSaveChanges = () => {
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
            setIsEditing(false); // Exit edit mode after successful submission
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
    <form>
        <h1>Profile Details</h1>
        <input
            type="text"
            name="name"
            placeholder="Name"
            value={profile.name}
            onChange={handleChange}
            disabled={!isEditing}
        />
        <input
            type="email"
            name="email"
            placeholder="Email"
            value={profile.email}
            onChange={handleChange}
            disabled={!isEditing}
        />
        <input
            type="text"
            name="bio"
            placeholder="Bio"
            value={profile.bio}
            onChange={handleChange}
            disabled={!isEditing}
        />
        <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            disabled={!isEditing}
        />
        
        <h2>Favorite Details</h2>
        <div className="favorites-container">
            {/* Favorite Books */}
            <div className="favorites-item">
                <h3><i className="fa fa-book"></i> Favorite Books</h3>
                {isEditing ? (
                    <input
                        type="text"
                        name="favoriteBooks"
                        placeholder="Favorite Books (comma separated)"
                        value={profile.favoriteBooks.join(', ')}
                        onChange={handleChange}
                    />
                ) : (
                    <p>{profile.favoriteBooks.join(', ') || "No favorite books added."}</p>
                )}
            </div>

            {/* Favorite Genres */}
            <div className="favorites-item">
                <h3><i className="fa fa-tags"></i> Favorite Genres</h3>
                {isEditing ? (
                    <input
                        type="text"
                        name="favoriteGenres"
                        placeholder="Favorite Genres (comma separated)"
                        value={profile.favoriteGenres.join(', ')}
                        onChange={handleChange}
                    />
                ) : (
                    <p>{profile.favoriteGenres.join(', ') || "No favorite genres added."}</p>
                )}
            </div>

            {/* Favorite Authors */}
            <div className="favorites-item">
                <h3><i className="fa fa-pencil-alt"></i> Favorite Authors</h3>
                {isEditing ? (
                    <input
                        type="text"
                        name="favoriteAuthors"
                        placeholder="Favorite Authors (comma separated)"
                        value={profile.favoriteAuthors.join(', ')}
                        onChange={handleChange}
                    />
                ) : (
                    <p>{profile.favoriteAuthors.join(', ') || "No favorite authors added."}</p>
                )}
            </div>

            {/* Themes */}
            <div className="favorites-item">
                <h3><i className="fa fa-lightbulb"></i> Themes</h3>
                {isEditing ? (
                    <input
                        type="text"
                        name="themes"
                        placeholder="Themes (comma separated)"
                        value={profile.themes.join(', ')}
                        onChange={handleChange}
                    />
                ) : (
                    <p>{profile.themes.join(', ') || "No themes added."}</p>
                )}
            </div>
        </div>

        {/* Edit or Save Button */}
        {!isEditing ? (
            <button onClick={() => setIsEditing(true)} style={{marginTop: '10px'}}>Edit</button>
        ) : (
            <button type="button" onClick={handleSaveChanges}>Save Changes</button>
        )}
    </form>
</div>
  
        </div>
    );
};

export default Profile;
