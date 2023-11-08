const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const User = require("./Models/User");
const Post = require("./Models/Post");

mongoose
  .connect(
    "mongodb+srv://mkdjspython12:NumaniNumani12@niothread.cwmanuh.mongodb.net/threadclone",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log("Server Is Running On The Port", port);
});

app.get("/", (req, res) => {
  res.send("Working");
});

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const ExistingUser = await User.findOne({ email });

    if (ExistingUser) {
      return res
        .status(400)
        .json({ message: "Email Already Exist Try New Email!" });
    }

    const newUser = new User({ username, email, password });

    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    await newUser.save();

    sendverificationEmail(newUser.email, newUser.verificationToken);

    res.status(200).json({
      message: "Registration Finished Please Check Your Mail For Verfication",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

const sendverificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mkdjspython12@gmail.com",
      pass: "qhov tqkh edkw uyue",
    },
  });

  const mailOptions = {
    from: "threads.com",
    to: email,
    subject: "Email Verfication",
    text: `Please click the following link to verify your email http://192.168.43.191:5000/verify/${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error.toString());
  }
};

app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ message: "Invalid Token!!" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Email verification is failed" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

const secretKey = generateSecretKey();

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found!!" });
    }

    if (user.password !== password) {
      return res.status(404).json({ message: "Invalid password " });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

app.get("/user/:userId", async (req, res) => {
  try {
    const loggedUserId = req.params.userId;

    User.find({ _id: { $ne: loggedUserId } })
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json("error");
      });
  } catch (error) {
    res.status(500).json({ message: "Error getting the users" });
  }
});

app.post("/follow", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { followers: currentUserId },
    });

    res.status(200).json({ message: "Followed" });
  } catch (error) {
    res.status(500).json({ message: "Error While Following" });
  }
});

app.post("/users/unfollow", async (req, res) => {
  const { loggedUserId, targetUserId } = req.body;

  try {
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: loggedUserId },
    });

    res.status(200).json({ message: "Unfollowed" });
  } catch (error) {
    res.status(500).json({ message: "Error While Following" });
  }
});

app.get("/currentUser/:userId", async (req, res) => {
  const id = req.params.userId;
  console.log(id);

  try {
    await User.find({ _id: id })
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((error) => {
        res.status(404).json({ message: error });
      });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/create-post", async (req, res) => {
  try {
    const { content, userId } = req.body;

    const newPostData = {
      user: userId,
    };

    if (content) {
      newPostData.content = content;
    }

    const newpost = new Post(newPostData);

    await newpost.save();

    res.status(200).json({ message: "Post Saved" });
  } catch (error) {
    res.status(500).json({ message: "Post failed" });
  }
});

app.put("/post/:postId/:userId/like", async (req, res) => {
  try {
    const PostId = req.params.postId;
    const UserId = req.params.userId;

    const post = await Post.findById(PostId).populate("users", "username");

    const updatedPost = await Post.findByIdAndDelete(
      PostId,
      { $addToSet: { likes: UserId } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Page not found" });
    }

    updatedPost.user = post.user;
    res.json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occurred while liking" });
  }
});

app.put("/post/:postId/:userId/unlike", async (req, res) => {
  try {
    const PostId = req.params.postId;
    const UserId = req.params.userId;

    const post = await Post.findById(PostId).populate("user", "name");

    const updatedPost = await Post.findByIdAndUpdate(
      PostId,
      { $pull: { likes: UserId } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Page not found" });
    }

    updatedPost.user = post.user;
    res.json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occurred while liking" });
  }
});

app.get("/get-post", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "an error occurred while getting the posts" });
  }
});
