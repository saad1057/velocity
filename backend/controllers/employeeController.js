const User = require('../model/user');
const { hashPassword } = require('../utils/password');

const getEmployees = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { adminId: req.user._id, role: 'employee' };
    
    // Only return employees tied to this admin
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.status = status;
    }

    const employees = await User.find(filter).select('-password');
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getEmployee = async (req, res) => {
  try {
    const employee = await User.findOne({ _id: req.params.id, adminId: req.user._id, role: 'employee' }).select('-password');
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const updateEmployeeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const employee = await User.findOne({ _id: req.params.id, adminId: req.user._id, role: 'employee' });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    employee.status = status;
    employee.isApproved = status === 'approved';
    await employee.save();

    const employeeObject = employee.toObject();
    delete employeeObject.password;
    res.status(200).json({ success: true, message: `Employee status updated to ${status}`, data: employeeObject });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const editEmployee = async (req, res) => {
  try {
    const { firstname, lastname, email, adminId } = req.body;
    
    // Find employee assigned to this admin
    const employee = await User.findOne({ _id: req.params.id, adminId: req.user._id, role: 'employee' });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    if (firstname) employee.firstname = firstname;
    if (lastname !== undefined) employee.lastname = lastname;
    if (email) employee.email = email;
    
    // Reassigning to another admin is allowed if the adminId is valid
    if (adminId && adminId !== req.user._id.toString()) {
      const newAdmin = await User.findOne({ _id: adminId, role: 'admin' });
      if (!newAdmin) {
        return res.status(400).json({ success: false, message: 'Target admin not found or is not an admin' });
      }
      employee.adminId = newAdmin._id;
    }

    await employee.save();

    const employeeObject = employee.toObject();
    delete employeeObject.password;
    res.status(200).json({ success: true, message: 'Employee updated successfully', data: employeeObject });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'Email already exists' });
    } else {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findOneAndDelete({ _id: req.params.id, adminId: req.user._id, role: 'employee' });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const resetEmployeePassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const employee = await User.findOne({ _id: req.params.id, adminId: req.user._id, role: 'employee' });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    employee.password = await hashPassword(password);
    await employee.save();

    res.status(200).json({ success: true, message: 'Employee password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getEmployees,
  getEmployee,
  updateEmployeeStatus,
  editEmployee,
  deleteEmployee,
  resetEmployeePassword
};
