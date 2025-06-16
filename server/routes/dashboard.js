const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");
const Activity = require("../models/Activity");

// Get dashboard summary with time range filter
router.get("/summary", auth, async (req, res) => {
  try {
    const { timeRange } = req.query;
    const timeFilter = getTimeFilter(timeRange);

    const [
      totalUsers,
      activeProjects,
      pendingTasks,
      recentActivities,
      metrics,
      salesData,
      taskDistribution,
    ] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments({ status: "active" }),
      Task.countDocuments({ status: { $in: ["todo", "in-progress"] } }),
      Activity.find().sort({ createdAt: -1 }).limit(5).populate("user", "name"),
      getMetrics(timeFilter),
      getSalesData(timeFilter),
      getTaskDistribution(timeFilter),
    ]);

    // Prepare metrics data
    const metricsData = [
      {
        title: "Users",
        count: totalUsers.toLocaleString(),
        icon: "users",
        trend: "+12%",
      },
      {
        title: "Projects",
        count: activeProjects.toLocaleString(),
        icon: "projects",
        trend: "+8%",
      },
      {
        title: "Tasks",
        count: pendingTasks.toLocaleString(),
        icon: "tasks",
        trend: "+5%",
      },
      {
        title: "Revenue",
        count: "$" + (Math.random() * 100000).toFixed(2),
        icon: "revenue",
        trend: "+15%",
      },
    ];

    // Get projects with progress
    const projects = await Project.find()
      .sort({ updatedAt: -1 })
      .limit(4)
      .populate("members", "avatar");

    // Broadcast real-time update
    const broadcast = req.app.get("broadcast");
    if (broadcast) {
      broadcast({
        type: "dashboard_update",
        data: {
          metrics: metricsData,
          sales: salesData,
          tasks: taskDistribution,
          activities: recentActivities,
        },
      });
    }

    res.json({
      metrics: metricsData,
      sales: salesData,
      tasks: taskDistribution,
      projects,
      activities: recentActivities,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({ message: "Error fetching dashboard summary" });
  }
});

// Helper function to get time filter based on range
const getTimeFilter = (timeRange) => {
  const now = new Date();
  switch (timeRange) {
    case "week":
      return {
        start: new Date(now.setDate(now.getDate() - 7)),
        end: new Date(),
      };
    case "month":
      return {
        start: new Date(now.setMonth(now.getMonth() - 1)),
        end: new Date(),
      };
    case "year":
      return {
        start: new Date(now.setFullYear(now.getFullYear() - 1)),
        end: new Date(),
      };
    default:
      return {
        start: new Date(now.setDate(now.getDate() - 7)),
        end: new Date(),
      };
  }
};

// Helper function to get metrics data
const getMetrics = async (timeFilter) => {
  // Implement metrics calculation based on timeFilter
  return [];
};

// Helper function to get sales data
const getSalesData = async (timeFilter) => {
  // Implement sales data calculation based on timeFilter
  return [];
};

// Helper function to get task distribution
const getTaskDistribution = async (timeFilter) => {
  const tasks = await Task.aggregate([
    {
      $match: {
        createdAt: { $gte: timeFilter.start, $lte: timeFilter.end },
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  return tasks.reduce((acc, task) => {
    acc[task._id] = task.count;
    return acc;
  }, {});
};

// Get user preferences and settings
router.get("/settings", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "preferences notificationSettings systemSettings"
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user settings" });
  }
});

// Update user preferences
router.put("/settings/preferences", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { preferences: req.body } },
      { new: true }
    ).select("preferences");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating preferences" });
  }
});

// Update notification settings
router.put("/settings/notifications", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { notificationSettings: req.body } },
      { new: true }
    ).select("notificationSettings");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating notification settings" });
  }
});

// Update system settings
router.put("/settings/system", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { systemSettings: req.body } },
      { new: true }
    ).select("systemSettings");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating system settings" });
  }
});

module.exports = router;
