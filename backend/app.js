require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const ejs = require("ejs");
const session = require("express-session");
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

const sessionOption = {
    secret: "secretCode",
    resave: false,
    saveUninitialized: true,
    cookie: {       // 1 day expiry
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }

};

app.use(flash());
app.use(express.json());
app.use(session(sessionOption));

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

// Google Authentication Route (Single for Both Student & Teacher)
app.get("/auth/google", (req, res, next) => {
    if (!req.session.role) {
        return res.redirect("/"); // Redirect if role is not set
    }

    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:7777/auth/google/callback",
            scope: ["profile", "email"],
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const name = profile.displayName;
                const role = req.session.role;
                const enteredCode = req.session.teacherCode;

                console.log("OAuth Callback - Role:", role);
                console.log("OAuth Callback - Teacher Code:", enteredCode);

                if (!role) {
                    return done(null, false, { message: "Role not set before authentication" });
                }

                if (role === "teacher") {
                    if (enteredCode !== process.env.UNIQUE_CODE_TEACHER) {
                        return done(null, false, { message: "Invalid teacher code" });
                    }

                    let teacher = await Teacher.findOne({ email });

                    if (!teacher) {
                        teacher = new Teacher({ name, email, username: name });
                        await teacher.save();
                    }
                    return done(null, { ...teacher.toObject(), role: "teacher" });
                } else if (role === "student") {
                    let student = await Student.findOne({ email });

                    if (!student) {
                        student = new Student({ name, email, username: name });
                        await student.save();
                    }
                    return done(null, { ...student.toObject(), role: "student" });
                } else {
                    return done(null, false, { message: "Invalid role" });
                }
            } catch (error) {
                return done(error, false);
            }
        }
    )
);



// Serialize & Deserialize User
passport.serializeUser((user, done) => {
    done(null, { id: user.id, role: user.role || "student" });
});

passport.deserializeUser(async (obj, done) => {
    try {
        if (obj.role === "teacher") {
            const teacher = await Teacher.findById(obj.id);
            done(null, teacher);
        } else {
            const student = await Student.findById(obj.id);
            done(null, student);
        }
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Callback
app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/unauthorized" }), // Redirect to a custom page if unauthorized
    (req, res) => {
        const role = req.user?.role; // Role is now stored in req.user

        if (role === "teacher") {
            return res.redirect("http://localhost:5173/teacher-dashboard");
        } else {
            return res.redirect("http://localhost:5173/student-dashboard");
        }
    }
);


// Logout Route
app.get("/logout", (req, res) => {
    req.logout(() => {
        req.session.destroy();
        res.redirect("/");
    });
});


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
