require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const ejs = require("ejs");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("./config/passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local");
const isLoggedIn = require("./authenticateMiddleware.js");
const auth = require("./middleware/auth");

const Student = require("./Models/student");
const Teacher = require("./Models/teacher");
const ClassroomCreate = require("./Models/classroomCreate");
const ClassroomJoin = require("./Models/classroomJoin");
const Topic = require("./Models/topic");
const Question = require("./Models/question");
const StudentFeedback = require("./Models/studentFeedback.js");

const authRoutes = require("./routes/authRoutes");
const classroomRoutes = require("./routes/classroomRoutes");
const contentRoutes = require("./routes/contentRoutes");
const geminiRoutes = require("./routes/geminiRoutes");
// const UniqueCodeTeacher = "#Education";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(flash());
app.use(express.json());



app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: true, // Ensure session is saved on every request
    saveUninitialized: true, // Save new sessions even if unmodified
    store: MongoStore.create({ mongoUrl: "mongodb://localhost:27017/sessiondb" }), // Store session in MongoDB
    cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    }
}));



app.use(passport.initialize());
app.use(passport.session());

// passport.use("student", new LocalStrategy(Student.authenticate()));
// passport.use("teacher", new LocalStrategy(Teacher.authenticate()));

// connectivity backend frontend
app.use(
    cors({
        origin: "http://localhost:5173", // frontend URL ( React )
        credentials: true,
    }),
);

// mongodb connection
main()
    .then(() => {
        console.log("Mongo DB Connection Successfully..");
    })
    .catch((err) => {
        console.log("Mongo DB not Connected..");
    });

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}


// connect flash middleware
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.deleteMsg = req.flash("delete");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


// Store role and teacher code in session before authentication
//app.post("/role-data", (req, res) => {
//    const { role, code } = req.body;
//
//    if (!role) {
//        return res.status(400).send("Role is required.");
//    }
//
//    req.session.role = role;
//    if (role === "teacher") {
//        req.session.teacherCode = code || ""; // Store teacher code if provided
//        console.log(req.session.role);
//        console.log(req.session.teacherCode);
//    }
//
//    res.send("Role stored successfully.");
//});


// 🔹 Step 1: Set Role in Session (Before Google Auth)
app.post("/set-role/student", (req, res) => {
    req.session.role = "student";
    console.log("🔹 Role set in session:", req.session.role, " | Session ID:", req.session.id);
    console.log("🔹 Full Session Data:", req.session); // Debug full session

    res.json({ success: true, role: "student" });
});

app.post("/set-role/teacher", (req, res) => {
    const { teacherCode } = req.body;

    if (teacherCode !== process.env.UNIQUE_CODE_TEACHER) {
        console.log("❌ Invalid teacher code attempt");
        return res.status(403).json({ success: false, message: "Invalid teacher code" });
    }

    req.session.role = "teacher";
    req.session.teacherCode = teacherCode;
    console.log("🔹 Role set in session:", req.session.role, " | Session ID:", req.session.id);
    console.log("🔹 Full Session Data:", req.session); // Debug full session

    res.json({ success: true, role: "teacher" });
});

// 🔹 Step 2: Google Authentication Route
app.get("/auth/google", (req, res, next) => {
    console.log("🔹 Session data before Google Auth:", req.session);
    console.log("🔹 Session ID before Google Auth:", req.session.id);

    if (!req.session.role) {
        console.log("❌ No role found in session, redirecting to home");
        return res.redirect("/"); // Redirect if role is not set
    }

    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

// 🔹 Step 3: Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:7777/auth/google/callback",
            passReqToCallback: true,
            scope: ["profile", "email"],
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const name = profile.displayName;
                const role = req.session.role;
                const enteredCode = req.session.teacherCode;

                if (!role) {
                    return done(null, false, { message: "Role not set before authentication" });
                }

                let user;

                if (role === "teacher") {
                    if (enteredCode !== process.env.UNIQUE_CODE_TEACHER) {
                        return done(null, false, { message: "Invalid teacher code" });
                    }

                    user = await Teacher.findOne({ email });
                    if (!user) {
                        user = new Teacher({ name, email, username: name });
                        await user.save();
                    }
                } else if (role === "student") {
                    user = await Student.findOne({ email });
                    if (!user) {
                        user = new Student({ name, email, username: name });
                        await user.save();
                    }
                } else {
                    return done(null, false, { message: "Invalid role" });
                }

                console.log("✅ User found/created - ID:", user._id, "Role:", role);

                return done(null, { id: user._id.toString(), role }); // Explicitly pass user ID as a string
            } catch (error) {
                return done(error, false);
            }
        }
    )
);

// 🔹 Step 4: Serialize & Deserialize User
passport.serializeUser((user, done) => {
    console.log("🔹 Serializing User - ID:", user.id, "Role:", user.role);
    done(null, { id: user.id, role: user.role });
});
passport.deserializeUser(async (obj, done) => {
    try {
        let user;
        if (obj.role === "teacher") {
            user = await Teacher.findById(obj.id);
        } else {
            user = await Student.findById(obj.id);
        }

        if (!user) {
            return done(null, false);
        }

        console.log("🔹 Deserializing User - ID:", user._id, "Role:", obj.role);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});


// 🔹 Step 5: Google OAuth Callback
app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/unauthorized" }),
    (req, res) => {
        console.log("✅ User logged in - ID:", req.user._id || req.user.id);
        console.log("🔹 Role:", req.user.role);
        console.log("📧 Email:", req.user.email);

        req.session.userId = req.user._id || req.user.id; // Store user ID in session
        req.session.role = req.user.role;
        req.session.email = req.user.email; // Store email in session

        if (req.user.role === "teacher") {
            return res.redirect("http://localhost:5173/teacher-dashboard");
        } else {
            return res.redirect("http://localhost:5173/student-dashboard");
        }
    }
);



// 🔹 Step 6: Logout Route
app.get("/logout", (req, res) => {
    req.logout(() => {
        req.session.destroy();
        res.redirect("/");
    });
});

// Unauthorized Page
app.get("/unauthorized", (req, res) => {
    res.status(403).send(`
      <h2>You are not authorized to access this page.</h2>
      <h4><a href="http://localhost:5173/">Go to Home Page</a></h4>
    `);
});




app.get("/", (req, res) => {
    res.send("Backend Root path");
});

app.use("/api/auth", authRoutes);
app.use("/api/classroom", classroomRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/gemini", geminiRoutes);

app.use("/uploads", express.static("uploads"));


app.get("/sessionId", (req, res) => {
    console.log(req.session.userId);
    console.log(req.session.email);
    res.send("send id", req.session.userId);

})


// maually check authentication
app.get("/auth/check", (req, res) => {
    try {

        // Check if the user is authenticated
        if (req.session.username) {
            return res.json({ redirectTo: "/student-dashboard" });
        } else {
            return res.json({ redirectTo: "/authform" });
        }
    } catch (error) {
        console.error("Authentication Check Error:", error);
        return res.status(500).json({ redirectTo: "/authform" });
    }
});


app.post("/create", auth, async (req, res) => {
    try {
        console.log("Is authenticated:", req.isAuthenticated());
        console.log("User object:", req.user);

        // Ensure the user is authenticated and is a teacher
        if (!req.session.userId) {
            return res.status(401).json({ message: "Unauthorized: Please log in." });
        }

        const teacherId = req.session.userId;

        // Check if the user is actually a teacher
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res
                .status(403)
                .json({ message: "Only teachers can create classrooms." });
        }

        const { name, subject, classroomCode, description } = req.body;

        const newClassroom = new ClassroomCreate({
            name,
            subject,
            classroomCode,
            description,
            teacherId,
        });

        const savedClassroom = await newClassroom.save();

        // Store classroom in the teacher's createdClassrooms array
        teacher.createdClassrooms.push(savedClassroom._id);
        await teacher.save();

        res
            .status(201)
            .json({
                message: "Classroom created successfully",
                classroom: savedClassroom,
            });
    } catch (error) {
        console.error("Classroom creation error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// route to join the classroom (By students)
app.post("/join", auth, async (req, res) => {
    try {
        console.log("📥 Received request:", req.body); // Debug: Check request body

        const studentId = req.session.userId;
        console.log("🆔 Student ID:", studentId); // Debug: Check session user

        const { classroomCode } = req.body;
        console.log("🔢 Classroom Code:", classroomCode); // Debug: Check received data

        if (!studentId) {
            return res.status(401).json({ message: "Unauthorized: No student ID found in session." });
        }

        // Find the classroom using the provided code
        const classroom = await ClassroomCreate.findOne({ classroomCode });
        if (!classroom) {
            return res.status(404).json({ message: "Invalid classroom code" });
        }

        // Check if the student has already joined this classroom
        const existingEntry = await ClassroomJoin.findOne({ studentId, classroomCode });
        if (existingEntry) {
            return res.status(400).json({ message: "You have already joined this classroom" });
        }

        const newClassroomJoin = new ClassroomJoin({
            studentId,
            subject: classroom.subject,
            classroomCode,
        });

        await newClassroomJoin.save();

        // Update Student Schema: Push Classroom ID to `joinedClassrooms`
        const student = await Student.findById(studentId);
        if (student) {
            student.joinedClassrooms.push(classroom._id);
            await student.save();
        }

        // ✅ Update Classroom Schema: Push Student ID to `joinedStudents`
        if (!classroom.joinedStudents.includes(studentId)) { // Fixing incorrect access
            classroom.joinedStudents.push(studentId);
            await classroom.save();
        }

        res.status(201).json({ message: "Successfully joined the classroom", classroom: newClassroomJoin });
    } catch (error) {
        console.error("❌ Server error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// to fetch all classroom join detail of every student
app.get("/student-dashboard", async (req, res) => {
    try {
        // Ensure user is authenticated
        if (!req.session.userId) {
            return res.status(401).json({ message: "Unauthorized! Please log in." });
        }

        console.log("Fetching details for User ID:", req.session.userId);

        // Fetch student data from database
        const student = await Student.findById(req.session.userId);
        if (!student) {
            return res.status(404).json({ message: "Student not found!" });
        }

        console.log("Student Found:", student.username);
        console.log("Joined Classrooms IDs:", student.joinedClassrooms);

        // If student has no joined classrooms, return empty array
        if (!student.joinedClassrooms.length) {
            return res.json({ joinedClassrooms: [] });
        }

        // Fetch classroom details along with teacher info and topics
        const classrooms = await ClassroomCreate.find({ _id: { $in: student.joinedClassrooms } })
            .populate("teacherId", "name email") // Fetch teacher name & email
            .populate({
                path: "topics",
                select: "title description createdAt",
                options: { sort: { createdAt: -1 }, limit: 2 } // Fetch recent 2 topics
            });

        // Fetch feedback for the student
        const feedbacks = await StudentFeedback.find({ studentId: student._id })
            .populate("classroomId", "name subject") // Fetch classroom name & subject
            .populate("assignmentId", "title description") // Fetch assignment details
            .populate("teacherId", "name email"); // Fetch teacher details

        // Format classroom response
        const formattedClassrooms = classrooms.map(classroom => ({
            className: classroom.name,
            subject: classroom.subject,
            description: classroom.description,
            teacher: classroom.teacherId ? {
                name: classroom.teacherId.name,
                email: classroom.teacherId.email
            } : "Unknown",
            topics: classroom.topics || []
        }));

        // Format feedback response
        const formattedFeedbacks = feedbacks.map(feedback => ({
            classroom: feedback.classroomId ? {
                name: feedback.classroomId.name,
                subject: feedback.classroomId.subject
            } : "Unknown",
            assignment: feedback.assignmentId ? {
                title: feedback.assignmentId.title,
                description: feedback.assignmentId.description
            } : "Unknown",
            teacher: feedback.teacherId ? {
                name: feedback.teacherId.name,
                email: feedback.teacherId.email
            } : "Unknown",
            aiFeedback: feedback.aiFeedback || "No AI feedback provided",
            teacherFeedback: feedback.teacherFeedback || "No teacher feedback provided",
            finalFeedback: feedback.finalFeedback,
            grade: feedback.grade
        }));

        console.log("Final Response Data:", { joinedClassrooms: formattedClassrooms, feedbacks: formattedFeedbacks });
        res.json({ joinedClassrooms: formattedClassrooms, feedbacks: formattedFeedbacks });

    } catch (error) {
        console.error("Error fetching student dashboard:", error);
        res.status(500).json({ message: "Server error, try again later!" });
    }
});




// to fetch all classroom create detail of every teacher
app.get("/teacher-dashboard", auth, async (req, res) => {
    try {
        // Ensure user is authenticated
        if (!req.session.userId) {
            return res.status(401).json({ message: "Unauthorized! Please log in." });
        }

        console.log("Fetching details for Teacher ID:", req.session.userId);

        // Fetch teacher data from database
        const teacher = await Teacher.findById(req.session.userId);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found!" });
        }

        console.log("Teacher Found:", teacher.username);
        console.log("Created Classrooms IDs:", teacher.createdClassrooms);

        // Check if teacher has created any classrooms
        if (!teacher.createdClassrooms || teacher.createdClassrooms.length === 0) {
            return res.json({ createdClassrooms: [] });
        }

        // Fetch classroom details and populate necessary fields
        const classrooms = await ClassroomCreate.find({ _id: { $in: teacher.createdClassrooms } })
            .populate("topics", "title description createdAt") // Fetch topics
            .populate("joinedStudents", "_id") // Fetch students (only count)
            // .populate("learningAssessments", "status") // Fetch learning assessment status (if exists)
            .exec();

        // Format classroom data
        const formattedClassrooms = classrooms.map(classroom => ({
            className: classroom.name,
            subject: classroom.subject,
            classCode: classroom.classroomCode,
            studentCount: classroom.joinedStudents.length,
            topicCount: classroom.topics.length,
            learningAssessmentStatus: classroom.learningAssessments?.status || "Not Available",
            recentTopics: classroom.topics.slice(-3).map(topic => ({
                title: topic.title,
                description: topic.description,
                createdAt: topic.createdAt
            }))
        }));

        console.log("Final Response Data:", formattedClassrooms);
        res.json({ createdClassrooms: formattedClassrooms });

    } catch (error) {
        console.error("Error fetching teacher dashboard:", error);
        res.status(500).json({ message: "Server error, try again later!" });
    }
});




// classcode se details
app.get("/classroom/:classcode", async (req, res) => {
    try {
        const { classcode } = req.params;

        console.log("Fetching details for Classroom Code:", classcode);

        // Fetch classroom details using classroomCode
        const classroom = await ClassroomCreate.findOne({ classroomCode: classcode })
            .populate("teacherId", "name") // Fetch teacher name
            .populate({
                path: "topics",
                select: "title description createdAt attemptedDate score", // Fetch topic details
            })
            // .populate("classFeedback") // Fetch class feedback (assuming it's a referenced model)
            .exec();

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found!" });
        }

        console.log("Classroom Found:", classroom.name);

        // Format the response
        const responseData = {
            className: classroom.name,
            classJoinedDate: classroom.createdAt, // Use createdAt as joined date
            teacherName: classroom.teacherId.name,
            subject: classroom.subject,
            classDescription: classroom.description,
            assignments: classroom.topics.map(topic => ({
                topicName: topic.title,
                topicDescription: topic.description,
                topicCreatedDate: topic.createdAt,
                topicAttemptedDate: topic.attemptedDate || "Not Attempted",
                score: topic.score || "Not Available"
            })),
            classFeedback: classroom.classFeedback || "No feedback available"
        };

        console.log("Final Response Data:", responseData);
        res.json(responseData);

    } catch (error) {
        console.error("Error fetching classroom details:", error);
        res.status(500).json({ message: "Server error, try again later!" });
    }
});


// teacher class 
app.get("/teacher-class/:classcode", async (req, res) => {
    try {
        const { classcode } = req.params;

        console.log("Fetching full details for Classroom Code:", classcode);

        // Fetch classroom details using classroomCode
        const classroom = await ClassroomCreate.findOne({ classroomCode: classcode })
            .populate("teacherId", "name email username") // Fetch teacher details
            .populate({
                path: "topics",
                select: "title description createdAt attemptedDate score", // Fetch topic details
            })
            .populate({
                path: "joinedStudents",
                select: "name email username joinedAt", // Fetch student details
            })
            .exec();

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found!" });
        }

        console.log("Classroom Found:", classroom.name);

        // Format the response
        const responseData = {
            className: classroom.name,
            subject: classroom.subject,
            classDescription: classroom.description,
            classCreatedDate: classroom.createdAt,
            teacher: {
                name: classroom.teacherId.name,
                email: classroom.teacherId.email,
                username: classroom.teacherId.username,
            },
            students: classroom.joinedStudents.map(student => ({
                name: student.name,
                email: student.email,
                username: student.username,
            })),
            topics: classroom.topics.map(topic => ({
                topicName: topic.title,
                topicDescription: topic.description,
                topicCreatedDate: topic.createdAt,
                topicAttemptedDate: topic.attemptedDate || "Not Attempted",
                score: topic.score || "Not Available"
            }))
        };

        console.log("Final Response Data:", responseData);
        res.json(responseData);

    } catch (error) {
        console.error("Error fetching teacher class details:", error);
        res.status(500).json({ message: "Server error, try again later!" });
    }
});



// ✅ Route: Add feedback to a student in a class
app.post("/classroom/:classcode/student/:studentId/feedback", async (req, res) => {
    try {
        const { classcode, studentId } = req.params;
        const { feedbackMessage } = req.body;
        const teacherId = req.session.userId; // Ensure userId exists

        console.log("Session Data:", req.session); // 🔍 Debugging session data
        if (!teacherId) {
            return res.status(403).json({ message: "Unauthorized! Teacher ID missing." });
        }

        // 1️⃣ Find the classroom using class code
        const classroom = await ClassroomCreate.findOne({ classroomCode: classcode });
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found!" });
        }

        console.log("Classroom Found:", classroom);

        // 2️⃣ Ensure student is part of this class (Convert studentId to ObjectId for proper comparison)
        const studentObjectId = new mongoose.Types.ObjectId(studentId);
        const isStudentInClass = classroom.joinedStudents.some(id => id.equals(studentObjectId));

        if (!isStudentInClass) {
            return res.status(404).json({ message: "Student not found in this class!" });
        }

        // 3️⃣ Find the student and ensure feedback array exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found!" });
        }

        console.log("Student Found:", student);

        // Ensure feedback array exists
        if (!student.feedback) {
            student.feedback = [];
        }

        // 4️⃣ Add feedback
        student.feedback.push({
            teacherId,
            classroomId: classroom._id,
            message: feedbackMessage,
            date: new Date()
        });

        await student.save();

        res.status(200).json({ message: "Feedback added successfully!" });

    } catch (error) {
        console.error("❌ Error adding feedback:", error);
        res.status(500).json({ message: "Server error, try again later!" });
    }
});


// ✅ GET route to fetch feedback for a student in a classroom
app.get("/classroom/:classcode/student/:studentId/feedback", async (req, res) => {
    try {
        const { classcode, studentId } = req.params;

        // 1️⃣ Find the classroom
        const classroom = await ClassroomCreate.findOne({ classroomCode: classcode });
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found!" });
        }

        // 2️⃣ Ensure student is part of this class
        if (!classroom.joinedStudents.includes(studentId)) {
            return res.status(404).json({ message: "Student not found in this class!" });
        }

        // 3️⃣ Find student and filter feedback for this class
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found!" });
        }

        const feedbackForClass = student.feedback.filter(
            (fb) => fb.classroomId.toString() === classroom._id.toString()
        );

        res.status(200).json({
            studentId: student._id,
            studentName: student.name,
            feedback: feedbackForClass
        });

    } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).json({ message: "Server error, try again later!" });
    }
});



// delete student from class by teacher
app.delete("/classroom/:classcode/student/:studentId", async (req, res) => {
    try {
        const { classcode, studentId } = req.params;
        const teacherId = req.session?.userId; // Get logged-in teacher's ID

        console.log("Session Data:", req.session); // 🔍 Debugging session data

        if (!teacherId) {
            return res.status(403).json({ message: "Unauthorized! Teacher ID missing." });
        }

        // 1️⃣ Find the classroom by classcode
        const classroom = await ClassroomCreate.findOne({ classroomCode: classcode });
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found!" });
        }

        console.log("Classroom Found:", classroom);

        // 2️⃣ Check if the teacher owns this class
        if (classroom.teacherId.toString() !== teacherId) {
            return res.status(403).json({ message: "Unauthorized! You do not own this class." });
        }

        // 3️⃣ Convert studentId to ObjectId for proper comparison
        const studentObjectId = new mongoose.Types.ObjectId(studentId);

        // 4️⃣ Check if student is part of this class
        const studentIndex = classroom.joinedStudents.findIndex(id => id.equals(studentObjectId));
        if (studentIndex === -1) {
            return res.status(404).json({ message: "Student not found in this class!" });
        }

        // 5️⃣ Remove student from `joinedStudents` array
        classroom.joinedStudents.splice(studentIndex, 1);
        await classroom.save();

        console.log("Updated Classroom:", classroom);

        // 6️⃣ Remove class from `joinedClassrooms` in Student schema
        const student = await Student.findById(studentId);
        if (student) {
            student.joinedClassrooms = student.joinedClassrooms.filter(
                classId => !classId.equals(classroom._id)
            );
            await student.save();
        }

        res.status(200).json({ message: "Student removed from class successfully!" });

    } catch (error) {
        console.error("❌ Error removing student:", error);
        res.status(500).json({ message: "Server error, try again later!" });
    }
});

// ✅ 1. Add Topic to a Classroom (Teacher Must be Logged In)
app.post("/classroom/:classroomId/topic", auth, async (req, res) => {
    try {
        // Teacher ki login ID (req.user._id se aayegi)
        const teacherId = req.session.userId;
        const { title, description, classcode } = req.body;

        // Classroom check karega ki woh teacher ka hai ya nahi
        const classroom = await ClassroomCreate.findOne({
            classroomCode: classcode,
            teacherId,
        });
        const classroomId = classroom?._id;
        if (!classroom) {
            return res
                .status(404)
                .json({ message: "Classroom not found or unauthorized" });
        }
        

        // Naya topic create karein
        const newTopic = new Topic({
            classroomId,
            title,
            description,
        });

        // Topic save karein database mein
        await newTopic.save();

        // ✅ Topic ko classroom ke "topics" array mein add karein
classroom.topics.push(newTopic._id);
await classroom.save();

        res
            .status(201)
            .json({ message: "Topic added successfully", topic: newTopic });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error adding topic", error: error.message });
    }
});

// Route to add multiple AI-generated questions to a topic
app.post("/topics/:topicId/questions", async (req, res) => {
    try {
        const { topicId } = req.params; // Get topic ID from URL
        const { questions } = req.body; // Expecting an array of questions

        // Check if the topic exists
        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ message: "Topic not found" });
        }

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ message: "Invalid questions array" });
        }

        // Format questions for bulk insertion
        const questionsToInsert = questions.map((q) => ({
            topicId,
            questionType: q.questionType,
            questionText: q.questionText,
            options: q.questionType === "MCQ" ? q.options : [],
            correctAnswer: q.correctAnswer,
        }));

        // Insert multiple questions at once
        const savedQuestions = await Question.insertMany(questionsToInsert);

        res.status(201).json({
            message: "Questions added successfully",
            questions: savedQuestions,
        });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
});

const Port = process.env.PORT || 3000;

app.listen(Port, (req, res) => {
    console.log(`Backend is running on port ${Port}`);
});
