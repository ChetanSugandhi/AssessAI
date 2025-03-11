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
const isLoggedIn = require("./authenticateMiddleware.js");

const Student = require("./Models/student");
const Teacher = require("./Models/teacher");
const ClassroomCreate = require("./Models/classroomCreate");
const ClassroomJoin = require("./Models/classroomJoin");
const Topic = require("./Models/topic");
const Question = require("./Models/question");

const geminiRoutes = require("./routes/geminiRoutes");
const UniqueCodeTeacher = "#Education";

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

passport.use("student", new LocalStrategy(Student.authenticate()));
passport.use("teacher", new LocalStrategy(Teacher.authenticate()));

passport.serializeUser((user, done) => done(null, { id: user._id, role: user.role }));  
passport.deserializeUser(async (obj, done) => {
    const user = await (obj.role === "teacher" ? Teacher.findById(obj.id) : Student.findById(obj.id));
    done(null, user);
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
app.post(
    "/student-login",
    passport.authenticate("student", {
        failureFlash: true,
    }),
    (req, res) => {
        req.session.username = req.user.username; // Store username in session
        console.log(req.session.username);
        res.json({ success: true, message: "Login successful!", redirect: "/student-dashboard" });
    }
);



// get request on signup
app.get("/teacher-signup", (req, res) => {
    res.send("Send Teacher signup form here");
});

// post request on signup
app.post("/teacher-signup", async (req, res) => {
    try {
        let { name, email, username, password, teacherCode } = req.body;
        email = email.toLowerCase().trim();

        // Check if teacherCode is correct
        if (teacherCode !== UniqueCodeTeacher) {
            console.log("Unauthorized signup attempt.");
            return res.status(403).send("You are not authorized...");
        }

        // Check if teacher already exists
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(400).send("Teacher already exists");
        }

        // Create new teacher instance (without password)
        const newTeacher = new Teacher({ username, name, email });

        // Register the teacher (passport-local-mongoose handles password hashing)
        let savedTeacher = await Teacher.register(newTeacher, password);
        console.log("Saved teacher:", savedTeacher);

        return res.status(201).send("Signup successful!");
    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).send("Error signing up.");
    }
});

// get request on login
app.get("/teacher-login", (req, res) => {
    res.send("Send teacher login form here..."); // username and email will be provided...
});

// ye check krega student login h ya nhi... username and email ke through Post request on login
app.post(
    "/teacher-login",
    passport.authenticate("teacher", {
        failureFlash: true,
    }),
    (req, res) => {
        req.session.username = req.user.username; // Store username in session
        console.log(req.session.username);
        res.json({ success: true, message: "Login successful!", redirect: "/student-dashboard" });
    }
);
// Route to create a new classroom (by teachers)
// Route to create a new classroom (by teachers)
app.post("/create", isLoggedIn, async (req, res) => {
    try {
        console.log("Session ID:", req.sessionID);
        console.log("Is authenticated:", req.isAuthenticated());
        console.log("User object:", req.user);

        // Ensure the user is authenticated and is a teacher
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized: Please log in." });
        }

        const teacherId = req.user._id;

        // Check if the user is actually a teacher
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(403).json({ message: "Only teachers can create classrooms." });
        }

        const { name, subject, classroomCode, description } = req.body;

        const newClassroom = new ClassroomCreate({ 
            name, 
            subject, 
            classroomCode, 
            description, 
            teacherId 
        });

        const savedClassroom = await newClassroom.save();

        // Store classroom in the teacher's createdClassrooms array
        teacher.createdClassrooms.push(savedClassroom._id);
        await teacher.save();

        res.status(201).json({ message: "Classroom created successfully", classroom: savedClassroom });
    } catch (error) {
        console.error("Classroom creation error:", error);
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
