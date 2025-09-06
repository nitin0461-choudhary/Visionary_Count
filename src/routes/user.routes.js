import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  uploadRegisterFields,
  uploadAvatar,
} from "../middlewares/multer.middleware.js";
import { handleMulterError } from "../middlewares/multerError.middleware.js";

const router = Router();

// register: needs avatar image
router.post(
  "/register",
  uploadRegisterFields.fields([{ name: "avatar", maxCount: 1 }]),
  handleMulterError,
  registerUser
);

// login/logout
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);

// token refresh
router.post("/refresh-token", refreshAccessToken);

// password mgmt
router.post("/change-password", verifyJWT, changeCurrentPassword);

// current user
router.get("/current-user", verifyJWT, getCurrentUser);

// account update
router.patch("/update-account", verifyJWT, updateAccountDetails);

// avatar update
router.patch(
  "/avatar",
  verifyJWT,
  uploadAvatar.single("avatar"),
  handleMulterError,
  updateUserAvatar
);

export default router;
