const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  updateEmployeeStatus,
  editEmployee,
  deleteEmployee,
  resetEmployeePassword
} = require('../controllers/employeeController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Make sure all these routes require authentication and admin role
router.use(authenticate, isAdmin);

router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.put('/:id/status', updateEmployeeStatus);
router.put('/:id', editEmployee);
router.delete('/:id', deleteEmployee);
router.put('/:id/reset-password', resetEmployeePassword);

module.exports = router;
