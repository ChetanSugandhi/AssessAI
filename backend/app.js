require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const ejs = require("ejs");
const session = require("express-session");
const flash = require("connect-flash");


const quizRoutes = require("./routes/quizRoutes");

const Student = require("./Models/student");
const Teacher = require("./models/Teacher");
const ClassroomCreate = require("./Models/classroomCreate");
const ClassroomJoin = require("./Models/classroomJoin");
const Topic = require("./Models/topic");
const Question = require("./Models/question");


const sessionOption = {
    secret: "secretCode",
    resave: false,
    saveUninitialized: true
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(session(sessionOption));
app.use(flash());


// connectivity backend frontend
app.use(cors({
    origin: "http://localhost:5173",       // frontend URL ( React )
    credentials: true
}));


// mongodb connection 
main()
    .then(() => {
        console.log("Mongo DB Connection Successfully..");
    })
    .catch((err) => {
        console.log("Mongo DB not Connected..");
    })

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}


// middleware
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("Success");
    next();
})


app.get("/", (req, res) => {
    res.send("Backend Root path");
})
app.use("/quiz", quizRoutes)

app.get("/test/:id", (req, res) => {
    let { id } = req.params;
    res.send(`received id from frontend is : ${id}`);
})



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
            teacherId
        });

        newClassroom.save().then(async (savedClassroom) => {
            const teacher = await Teacher.findById(teacherId);
            if (teacher) {
                teacher.createdClassrooms.push(savedClassroom._id);
                await teacher.save();
            }

            res.status(201).json({ message: "Classroom created successfully", classroom: savedClassroom });
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
        const existingEntry = await ClassroomJoin.findOne({ studentId, classroomCode });
        if (existingEntry) {
            return res.status(400).json({ message: "You have already joined this classroom" });
        }

        const newClassroomJoin = new ClassroomJoin({
            studentId,
            subject: classroom.subject,
            classroomCode
        });

        await newClassroomJoin.save();

        // Update Student Schema: Push Classroom ID to joinedClassrooms
        const student = await Student.findById(studentId);
        if (student) {
            student.joinedClassrooms.push(classroom._id);
            await student.save();
        }

        res.status(201).json({ message: "Successfully joined the classroom", classroom: newClassroomJoin });
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
        const classroom = await ClassroomCreate.findOne({ _id: classroomId, teacherId });
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found or unauthorized" });
        }

        // Naya topic create karein
        const newTopic = new Topic({
            classroomId,
            title,
            description
        });

        // Topic save karein database mein
        await newTopic.save();

        // ✅ Topic ko classroom ke "topics" array mein add karein
        ClassroomCreate.topics.push(newTopic._id);
        await ClassroomCreate.save();

        res.status(201).json({ message: "Topic added successfully", topic: newTopic });

    } catch (error) {
        res.status(500).json({ message: "Error adding topic", error: error.message });
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
        const questionsToInsert = questions.map(q => ({
            topicId,
            questionType: q.questionType,
            questionText: q.questionText,
            options: q.questionType === "MCQ" ? q.options : [],
            correctAnswer: q.correctAnswer,
        }));

        // Insert multiple questions at once
        const savedQuestions = await Question.insertMany(questionsToInsert);

        res.status(201).json({ message: "Questions added successfully", questions: savedQuestions });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});




const Port = process.env.PORT || 9999;

app.listen(Port, (req, res) => {
    console.log(`Backend is running on port ${Port}`);
})