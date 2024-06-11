const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config")
// User Routes
router.post("/signup", async (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  await User.create({
    username: username,
    password: password,
  });
  res.json({
    message: "User created successfully",
  });
});

router.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(JWT_SECRET);

  const user = await User.find({
    username,
    password,
  });
  if (user) {
    const token = jwt.sign(
      {
        username,
      },
      JWT_SECRET
    );

    res.json({
      token,
    });
  } else {
    res.status(411).json({
      message: "Incorrect email and pass",
    });
  }
});

router.get("/courses", async (req, res) => {
  const response = await Course.find({});
  res.json({
    courses: response,
  });
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  const courseId = req.params.courseId;
  const username = req.headers.username;
  await User.updateOne(
    {
      username: username,
    },
    {
      $push: {
        purchasedcourse: courseId,
      },
    }
  );
  res.json({
    message: "Course purchased ",
  });
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  const user = await User.findOne({
    username: req.header.username,
  });
  console.log(purchasedcourse);
  const courses = await Course.find({
    _id: {
      $in: user.purchasedcourse,
    },
  });
  res.json({
    courses: courses,
  });
});

module.exports = router;
