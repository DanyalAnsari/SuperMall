const { AdminInviteModel } = require('../models/AdmitInvite');
const asyncErrorhandler = require('../utils/AsyncErrorHandler');
const sendEmail = require('../utils/Email');
const { sendSuccessResponse } = require('../utils/Utilities');
const CustomError = require('../utils/CustomError');
const { UserModel } = require('../models/UserModel');

const AdminController = {
  // Only superadmins can create new admin accounts
  createAdmin: asyncErrorhandler(async (req, res, next) => {
    // Verify requesting user is superadmin
    if (req.user.role !== 'superadmin') {
      return next(new CustomError('Only superadmins can create admin accounts', 403));
    }

    const { email } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return next(new CustomError('User already exists', 400));
    }

    const newInvite = await AdminInviteModel.create({
      email,
      token,
      expiresAt,
      createdBy: req.user.id
    });

    // Send email with invitation link
    const inviteLink = `${process.env.ADMIN_PORTAL_URL}/admin/setup?token=${token}`;

    const message = `
      Admin Invitation\n
      Please use the following link to register as admin:\n
      ${inviteLink}\n
      This link will expire in 10 minutes.\n
      If you didn't request this, please ignore this email.
    `;

    try {
      // Send email to the invitee
      await sendEmail({
        email: email, // Use the invite email
        subject: "Admin Invitation",
        message: message,
      });

      sendSuccessResponse(res, 200, {
        message: `Admin invitation sent successfully to ${email}`
      });
    } catch (err) {
      return next(new CustomError(
        "Failed to send admin invitation email. Please try again later.",
        500
      ));
    }
  }),

  // Complete admin setup
  completeAdminSetup: asyncErrorhandler(async (req, res, next) => {
    const { token, password, name } = req.body;

    // Validate invitation
    const invite = await AdminInviteModel.findOne({
      token,
      expiresAt: { $gt: new Date() },
      used: false
    });

    if (!invite) {
      return next(new CustomError('Invalid or expired invitation token', 403));
    }

    const admin = await UserModel.create({
      name, 
      email: invite.email,
      password,
      role: 'Admin',
      phone_number: '123-456-7890' // Add a default phone number
    });

    // Mark invitation as used
    invite.used = true;
    await invite.save();

    sendSuccessResponse(res, 200, {
      message: 'Admin account created successfully'
    });
  })
};

module.exports = AdminController;