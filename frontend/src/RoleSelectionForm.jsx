import { useState } from "react";
import axios from "axios";

const RoleSelectionForm = () => {
    const [role, setRole] = useState("");
    const [code, setCode] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Set default code for students
        const finalCode = role === "student" ? "111" : code;

        const formData = {
            role,
            code: finalCode,
        };

        try {
            const response = await axios.post("http://localhost:7777/role-data", formData, { withCredentials: true });

            console.log("Response:", response.data);
            // alert("Form submitted successfully!");

            // Redirect user based on role
            if (role === "student") {
                window.location.href = "http://localhost:7777/auth/google";
            } else if (role === "teacher") {
                window.location.href = "http://localhost:7777/auth/google";
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error submitting form!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-80">
                <h2 className="text-xl font-bold mb-4">Select Role</h2>

                {/* Role Dropdown */}
                <label className="block mb-2">Role:</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                    required
                >
                    <option value="">Select Role</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>

                {/* Code Input (only for Teacher) */}
                {role === "teacher" && (
                    <>
                        <label className="block mb-2">Enter Code:</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                            required
                        />
                    </>
                )}

                {/* Submit Button */}
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Login with Google
                </button>
            </form>
        </div>
    );
};

export default RoleSelectionForm;
