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

const Student = require("./Models/student");
const Teacher = require("./Models/teacher");
const ClassroomCreate = require("./Models/classroomCreate");
const ClassroomJoin = require("./Models/classroomJoin");
const Topic = require("./Models/topic");
const Question = require("./Models/question");

const authRoutes = require("./routes/authRoutes");
const classroomRoutes = require("./routes/classroomRoutes");
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

        req.session.userId = req.user._id || req.user.id; // Store user ID in session
        req.session.role = req.user.role; 

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
app.use("/api/gemini", geminiRoutes);

app.get("/test/:id", (req, res) => {
    let { id } = req.params;
    res.send(`received id from frontend is : ${id}`);
});


app.get("/sessionId", (req, res) => {
    console.log(req.session.userId)
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

// route to join the classroom (By students)
app.post("/join", async (req, res) => {
    try {
        const studentId = req.user._id;

        const { classroomCode } = req.body;

        // Find the classroom using the provided code
        const classroom = await ClassroomCreate.findOne({ classroomCode });
        if (!classroom) {
            return res.status(404).json({ message: "Invalid classroom code" });
        }

        // Check if the student has already joined this classroom
        const existingEntry = await ClassroomJoin.findOne({
            studentId,
            classroomCode,
        });
        if (existingEntry) {
            return res
                .status(400)
                .json({ message: "You have already joined this classroom" });
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
        if (!ClassroomCreate.joinedStudents.includes(studentId)) {
            ClassroomCreate.joinedStudents.push(studentId);
            await classroom.save();
        }


        res.status(201).json({
            message: "Successfully joined the classroom",
            classroom: newClassroomJoin,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ 1. Add Topic to a Classroom (Teacher Must be Logged In)
app.post("/classroom/:classroomId/topic", async (req, res) => {
    try {
        // Teacher ki login ID (req.user._id se aayegi)
        const teacherId = req.user._id;
        const { title, description } = req.body;
        const { classroomId } = req.params;

        // Classroom check karega ki woh teacher ka hai ya nahi
        const classroom = await ClassroomCreate.findOne({
            _id: classroomId,
            teacherId,
        });
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
        ClassroomCreate.topics.push(newTopic._id);
        await ClassroomCreate.save();

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
