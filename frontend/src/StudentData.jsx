import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentData = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJoinedClassrooms = async () => {
            try {
                const response = await axios.get("http://localhost:7777/student-dashboard", { withCredentials: true });
                setClassrooms(response.data.joinedClassrooms);
            } catch (error) {
                console.error("Error fetching classrooms:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJoinedClassrooms();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">📚 My Classrooms</h1>
            {loading ? (
                <p>Loading...</p>
            ) : classrooms.length > 0 ? (
                <ul className="space-y-4">
                    {classrooms.map((classroom) => (
                        <li key={classroom._id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold">{classroom.name}</h2>
                            <p className="text-sm text-gray-400">{classroom.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No classrooms joined yet.</p>
            )}
        </div>
    );
};

export default StudentData;
