require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB
// mongoose
//     .connect("mongodb://127.0.0.1:27017/workerDB")
//     .then(() => {
//         console.log("MongoDB connected successfully");
//     })
//     .catch((error) => {
//         console.error("MongoDB connection error:", error);
//     });
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => {
//         console.log("MongoDB connected successfully");
//     })
//     .catch((error) => {
//         console.log("MongoDB connection error:", error);
//     });

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("MongoDB connected successfully");
        console.log("Database name:", mongoose.connection.name);
        console.log("MongoDB host:", mongoose.connection.host);

        const collections =
            await mongoose.connection.db.listCollections().toArray();

        console.log(
            "Collections:",
            collections.map(c => c.name)
        );

        const count = await mongoose.connection.db
            .collection("workers")
            .countDocuments();

        console.log("Workers document count:", count);
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });

// Schema
const workerSchema = new mongoose.Schema(
    {
        driverName: String,
        totalEarnings: Number,
        porterPercentage: Number,
        earnings: Number,
        salaryType: String,
        workerIncome: Number,
        ownerIncome: Number,
        date: String
    },
    {
        timestamps: true
    }
);

const Worker = mongoose.model("Worker", workerSchema);


// ==========================
// SAVE DATA
// ==========================

app.post("/api/workers", async (req, res) => {
    try {

        console.log("Received data:", req.body);

        const worker = new Worker(req.body);

        const savedWorker = await worker.save();

        console.log("Worker saved successfully");

        res.status(201).json({
            success: true,
            message: "Worker data stored successfully",
            data: savedWorker
        });

    } catch (error) {

        console.error("Save error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to store worker data",
            error: error.message
        });
    }
});


// ==========================
// SEARCH DATA
// ==========================

app.get("/api/workers/search", async (req, res) => {

    try {

        const { name, fromDate, toDate } = req.query;

        console.log("SEARCH REQUEST");
        console.log("Name:", name);
        console.log("From:", fromDate);
        console.log("To:", toDate);

        if (!name || !fromDate || !toDate) {

            return res.status(400).json({
                success: false,
                message: "Name, from date and to date are required"
            });
        }

        const workers = await Worker.find({

            driverName: {
                $regex: `^${name}$`,
                $options: "i"
            },

            date: {
                $gte: fromDate,
                $lte: toDate
            }

        }).sort({ date: 1 });

        console.log("Found workers:", workers.length);

        res.json({
            success: true,
            count: workers.length,
            data: workers
        });

    } catch (error) {

        console.error("Search error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to search worker data",
            error: error.message
        });
    }
});


// ==========================
// GET ALL DATA
// ==========================

app.get("/api/workers", async (req, res) => {

    try {

        const workers = await Worker.find().sort({ date: 1 });

        res.json({
            success: true,
            data: workers
        });

    } catch (error) {

        console.error("Fetch error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch workers"
        });
    }
});


// ==========================
// START SERVER
// ==========================
app.get("/test", (req, res) => {
    res.send("THIS SERVER IS WORKING");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("--------------------------------");
    console.log("Server running successfully");
    console.log("http://localhost:3000");
    console.log("--------------------------------");

});

app.get("/test", (req, res) => {
    res.send("THIS SERVER IS WORKING");
});





// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require("path");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve your HTML/CSS/JS files
// app.use(express.static(__dirname));

// // MongoDB connection
// mongoose
//     .connect("mongodb://localhost:27017/workerDB")
//     .then(() => {
//         console.log("MongoDB connected successfully");
//     })
//     .catch((error) => {
//         console.error("MongoDB connection error:", error);
//     });

// // Worker Schema
// const workerSchema = new mongoose.Schema(
//     {
//         driverName: {
//             type: String,
//             required: true
//         },

//         totalEarnings: {
//             type: Number,
//             required: true
//         },

//         porterPercentage: {
//             type: Number,
//             required: true
//         },

//         earnings: {
//             type: Number,
//             required: true
//         },

//         salaryType: {
//             type: String,
//             required: true
//         },

//         workerIncome: {
//             type: Number,
//             required: true
//         },

//         ownerIncome: {
//             type: Number,
//             required: true
//         },

//         date: {
//             type: String,
//             required: true
//         }
//     },
//     {
//         timestamps: true
//     }
// );

// // Model
// const Worker = mongoose.model("Worker", workerSchema);

// // POST - Store worker data
// app.post("/api/workers", async (req, res) => {
//     try {
//         console.log("Received data:", req.body);

//         const worker = new Worker({
//             driverName: req.body.driverName,
//             totalEarnings: req.body.totalEarnings,
//             porterPercentage: req.body.porterPercentage,
//             earnings: req.body.earnings,
//             salaryType: req.body.salaryType,
//             workerIncome: req.body.workerIncome,
//             ownerIncome: req.body.ownerIncome,
//             date: req.body.date
//         });

//         const savedWorker = await worker.save();

//         console.log("Worker saved:", savedWorker);

//         res.status(201).json({
//             success: true,
//             message: "Worker data stored successfully",
//             data: savedWorker
//         });

//     } catch (error) {
//         console.error("Error saving worker:", error);

//         res.status(500).json({
//             success: false,
//             message: "Failed to store worker data",
//             error: error.message
//         });
//     }
// });



// // GET - Get all workers
// app.get("/api/workers", async (req, res) => {
//     try {
//         const workers = await Worker.find().sort({ createdAt: -1 });

//         res.json({
//             success: true,
//             data: workers
//         });

//     } catch (error) {
//         console.error(error);

//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch workers"
//         });
//     }
// });

// app.get("/api/workers/search", async (req, res) => {
//     try {
//         const { name, fromDate, toDate } = req.query;

//         console.log("Search request:", {
//             name,
//             fromDate,
//             toDate
//         });

//         const workers = await Worker.find({
//             driverName: {
//                 $regex: `^${name}$`,
//                 $options: "i"
//             },
//             date: {
//                 $gte: fromDate,
//                 $lte: toDate
//             }
//         }).sort({ date: 1 });

//         console.log("Search result:", workers);

//         res.status(200).json({
//             success: true,
//             data: workers
//         });

//     } catch (error) {
//         console.error("Search error:", error);

//         res.status(500).json({
//             success: false,
//             message: "Failed to search worker data",
//             error: error.message
//         });
//     }
// });

// // Start server
// const PORT = 3000;

// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });