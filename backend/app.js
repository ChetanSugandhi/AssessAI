require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const ejs = require("ejs");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const Student = require("./Models/student");
const Teacher = require("./Models/teacher");
const ClassroomCreate = require("./Models/classroomCreate");
const ClassroomJoin = require("./Models/classroomJoin");
const Topic = require("./Models/topic");
const Question = require("./Models/question");

const geminiRoutes = require("./routes/geminiRoutes");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOption = {
    secret: "secretCode",
    resave: false,
    saveUninitialized: true,
};

app.use(express.json());
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// 1️⃣ Define Strategies for Both Student & Teacher
passport.use("student", new LocalStrategy(Student.authenticate()));
passport.use("teacher", new LocalStrategy(Teacher.authenticate()));

// 2️⃣ Custom Serialize User
passport.serializeUser((user, done) => {
    done(null, { id: user._id, role: user.role || "student" }); // Ensure `_id` is used
});

// 3️⃣ Custom Deserialize User
passport.deserializeUser(async (obj, done) => {
    try {
        const Model = obj.role === "teacher" ? Teacher : Student; // Dynamically select model
        const user = await Model.findById(obj.id);

        if (!user) return done(null, false); // Handle case where user is not found

        done(null, user);
    } catch (err) {
        done(err);
    }
});

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

app.get("/", (req, res) => {
    res.send("Backend Root path");
});

// for experimentation
app.use("/gemini", geminiRoutes);

app.get("/test/:id", (req, res) => {
    let { id } = req.params;
    res.send(`received id from frontend is : ${id}`);
});


// to check authentication process for students.
app.get("/auth/check", async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.json({ authenticated: false, message: "Not Authenticated" });
        }

        // Assuming you have a Student schema/model
        const student = await Student.findById(req.user._id);
        if (student) {
            return res.json({ authenticated: true, message: "Yes, Authenticated", user: student });
        } else {
            return res.json({ authenticated: false, message: "Not Authenticated" });
        }
    } catch (error) {
        console.error("Authentication Check Error:", error);
        return res.status(500).json({ authenticated: false, message: "Internal Server Error" });
    }
});



// get request on signup
app.get("/student-signup", (req, res) => {
    res.send("Send signup form here");
});

// post request on signup
app.post("/student-signup", async (req, res) => {
    try {
        let { name, email, username, password } = req.body;
        email = email.toLowerCase().trim();

        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ message: "Student already exists" });
        }

        const newStudent = new Student({
            username: username,
            name: name,
            email: email,
        });

        const saveStudent = await Student.register(newStudent, password);
        console.log("Saved student:", saveStudent);

        res.status(201).json({ message: "Signup successful!", user: saveStudent });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// get request on login
app.get("/student-login", (req, res) => {
    res.send("Send student login form here..."); // username and email will be provided...
});

// ye check krega student login h ya nhi... username and email ke through
app.post("/student-login", async (req, res, next) => {
    const { username, password } = req.body;

    try {
        // Check if student exists
        const student = await Student.findOne({ username });

        if (!student) {
            return res.status(400).json({ success: false, message: "Student does not exist. Please sign up first." });
        }

        // Authenticate using Passport
        passport.authenticate("student", (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                return res.status(400).json({ success: false, message: "Invalid username or password." });
            }

            // If authentication is successful, log in the user
            req.logIn(user, (err) => {
                if (err) return next(err);
                return res.json({ success: true, message: "Login successful!", redirect: "/student-dashboard" });
            });
        })(req, res, next);
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});


// get request on signup
app.get("/teacher-signup", (req, res) => {
    res.send("Send Teacher signup form here");
});

// post request on signup
app.post("/teacher-signup", async (req, res) => {
    let { name, email, username, password } = req.body;
    email = email.toLowerCase().trim();

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
        return res.send("Teacher already exist");
    }

    const newTeacher = new Teacher({
        username: username,
        name: name,
        email: email,
    });

    let saveTeacher = await Teacher.register(newTeacher, password);
    console.log("Saved teacher is " + saveTeacher);
});

// get request on login
app.get("/teacher-login", (req, res) => {
    res.send("Send teacher login form here..."); // username and email will be provided...
});

// ye check krega student login h ya nhi... username and email ke through
app.post(
    "/teacher-login",
    passport.authenticate("teacher", {
        successRedirect: "/dashboard",
        failureRedirect: "/teacher-login",
        failureFlash: true,
    }),
);

// Route to create a new classroom (by teachers)
app.post("/create", (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    try {
        const teacherId = req.user._id;
        const { name, subject, classroomCode } = req.body;

        const newClassroom = new ClassroomCreate({
            name,
            subject,
            classroomCode,
            teacherId,
        });

        newClassroom.save().then(async (savedClassroom) => {
            const teacher = await Teacher.findById(teacherId);
            if (teacher) {
                teacher.createdClassrooms.push(savedClassroom._id);
                await teacher.save();
            }

            res.status(201).json({
                message: "Classroom created successfully",
                classroom: savedClassroom,
            });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
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
