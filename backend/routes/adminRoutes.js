const express = require('express');
const router = express.Router();
const { authenticate, adminOnly } = require('../middleware/auth');
const {
  getAllRecruiters,
  getRecruiterById,
  createRecruiter,
  updateRecruiter,
  deleteRecruiter,
  resetUserPassword,
  getActivityLogs,
  deleteActivities,
  purgeActivities
} = require('../controllers/adminController');

// All routes are protected by auth and adminOnly check
router.use(authenticate, adminOnly);

// Recruiter Management
router.get('/users', getAllRecruiters);
router.post('/users', createRecruiter);
router.get('/users/:id', getRecruiterById);
router.patch('/users/:id', updateRecruiter);
router.delete('/users/:id', deleteRecruiter);
router.patch('/users/:id/reset-password', resetUserPassword);

// Activity Logs
router.get('/activity', getActivityLogs);
router.delete('/activity', deleteActivities);
router.delete('/activity/purge', purgeActivities);

module.exports = router;
