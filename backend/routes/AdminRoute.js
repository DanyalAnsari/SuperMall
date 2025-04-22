const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');

// Admin account creation (superadmin only)
// router.post('/invite', superAdminAuth, AdminController.createAdmin);
// router.post('/setup', AdminController.completeAdminSetup);

// Admin management routes
// router.get('/admins', adminAuth, AdminController.listAdmins);
// router.get('/admins/:id', adminAuth, AdminController.getAdmin);
// router.put('/admins/:id', adminAuth, AdminController.updateAdmin);
// router.delete('/admins/:id', superAdminAuth, AdminController.deleteAdmin);

module.exports = adminRouter;