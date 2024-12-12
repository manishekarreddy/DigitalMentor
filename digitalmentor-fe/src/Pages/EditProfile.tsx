import React, { useState, useEffect } from 'react';
import httpService from '../Services/HttpService';

// Define the structure of the user data
interface UserProfile {
    international: string;
    email: string;
    username: string;
}

const EditProfile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch user profile data
    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const response = await httpService.get<UserProfile>('/api/users');
                setProfile(response.data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch user profile.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        try {
            const { international, email, username } = profile;
            const query = `?international=${international === 'true'}`;
            await httpService.put(`/api/users/edit${query}`, { email, username });
        } catch (err: any) {
            setError(err.message || 'Failed to update profile.');
        }
    };

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (profile) {
            setProfile({ ...profile, [name]: value });
        }
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!profile) {
        return <p>No profile data available.</p>;
    }

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={profile.username}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="international">International</label>
                    <select
                        id="international"
                        name="international"
                        value={profile.international}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        required
                    >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px' }}>
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditProfile;
