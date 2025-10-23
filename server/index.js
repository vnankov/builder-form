import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/fields", (req, res) => {
    console.log("Received field data:");
    console.log(req.body);

    // Respond with a success message
    res.json({ message: "Field data received successfully!", data: req.body });
});

// Start server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
