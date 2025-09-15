const mongoose = require("mongoose");
const User = require("./models/user.model"); // Adjust the path as necessary

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/Orphan-Management-System", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    const userId = "67f7d428b920c6dd453a125d"; // Jane Smith's ID
    const user = await User.findById(userId);

    if (user) {
      console.log("Verification Code:", user.verificationCode);
    } else {
      console.log("User not found");
    }

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
