// import { ApiError } from '../utils/ApiError.js';
// import { ApiResponse } from '../utils/ApiResponse.js';
// import { asyncHandler } from '../utils/asyncHandler.js';
// import jwt from "jsonwebtoken";
// import { uploadOnCloudinary } from '../utils/cloudinary.js';
// import { User } from '../models/user.model.js';

// const access_and_refresh_token_generator = async (userId) => {
//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       throw new ApiError(401, "UserId does not exist");
//     }
//    // console.log("access tokenn: ")
//    // console.log(process.env.ACCESS_TOKEN_SECRET);

//    // console.log("inside the generator");
//     const accessToken = user.generateAccessToken();
//    // console.log("Access done");
//     const refreshToken = user.generateRefreshToken();
//    // console.log("refreah done");
//     user.refreshToken = refreshToken;
//     await user.save({ validateBeforeSave: false });
//     return { accessToken, refreshToken };
//   } catch (error) {
//     throw new ApiError(401, error?.message || "UserId does not exist");
//   }
// };

// const options = {
// httpOnly: true,
//   secure: false,         // true only if you run HTTPS locally
//   sameSite: "lax",       // good default; "none" requires secure: true
//   path: "/",             // safe default

// };

// const registerUser = asyncHandler(async (req, res, next) => {
//   const { username, email, fullName, password } = req.body;

//   if ([username, email, fullName, password].some((field) => !String(field || "").trim())) {
//     throw new ApiError(400, "Enter all the details");
//   }

//   const user = await User.findOne({
//     $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
//   });
//   if (user) {
//     throw new ApiError(409, "With these credential user already exixts");
//   }

//   const avatarLocalPath = req.files?.avatar?.[0]?.path;
//   if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

//   // upload avatar and store URL (you required avatar)
//   const avatarUpload = await uploadOnCloudinary(avatarLocalPath, "image");
//   if (!avatarUpload?.url) throw new ApiError(400, "Failed to upload avatar");

//   const user1 = await User.create({
//     username: username.trim().toLowerCase(),
//     email: email.trim().toLowerCase(),
//     password: password,
//     fullName: fullName,
//     avatar: avatarUpload.url,
//   });

//   const createdUser = await User.findById(user1._id).select("-password -refreshToken");
//   if (!createdUser) {
//     throw new ApiError(500, "User registration failed");
//   }

//   return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
// });

// const loginUser = asyncHandler(async (req, res, next) => {
//   const { username = "", email = "", password = "" } = req.body;

//   if (!String(username).trim() && !String(email).trim()) {
//     throw new ApiError(400, "Enter email or username");
//   }
//   if (!String(password).trim()) {
//     throw new ApiError(400, "Password is required");
//   }

//   const user1 = await User.findOne({
//     $or: [{ email: email.trim().toLowerCase() }, { username: username.trim().toLowerCase() }],
//   });
//   if (!user1) {
//     throw new ApiError(401, "Invalid credentails");
//   }

//   const comp = await user1.isPasswordCorrect(password);
//   if (!comp) {
//     throw new ApiError(401, "Invalid credentials");
//   }

//   const { accessToken, refreshToken } = await access_and_refresh_token_generator(user1._id);

//   return res
//     .status(201)
//     .cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options)
//     .json(
//       new ApiResponse(
//         200,
//         {
//           user: await User.findById(user1._id).select("-password -refreshToken"),
//           accessToken,
//           refreshToken,
//         },
//         "user loggedIn Successfully"
//       )
//     );
// });

// const logoutUser = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);
//   if (!user) {
//     throw new ApiError(401, "Invalid User");
//   }

//   // clear stored refresh token
//   await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined } }, { new: true });

//   return res
//     .status(201)
//     .clearCookie("accessToken", options)
//     .clearCookie("refreshToken", options)
//     .json(new ApiResponse(200, {}, "User loggedout successfully"));
// });

// const refreshAccessToken = asyncHandler(async (req, res) => {
//   const inComingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
//   if (!inComingRefreshToken) {
//     throw new ApiError(401, "Invalid User");
//   }
//   try {
//     const decodedUser = jwt.verify(inComingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

//     const user = await User.findById(decodedUser._id);
//     if (!user) {
//       throw new ApiError(401, "User does not exist");
//     }
//     if (user.refreshToken !== inComingRefreshToken) {
//       throw new ApiError(401, "User does not exist");
//     }

//     const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
//       await access_and_refresh_token_generator(user._id);

//     return res
//       .status(201)
//       .cookie("accessToken", newAccessToken, options)
//       .cookie("refreshToken", newRefreshToken, options)
//       .json(
//         new ApiResponse(
//           200,
//           {
//             accessToken: newAccessToken,
//             refreshToken: newRefreshToken,
//           },
//           "Access token refreshed"
//         )
//       );
//   } catch (error) {
//     throw new ApiError(401, error?.message || "Invalid refresh token");
//   }
// });

// const changeCurrentPassword = asyncHandler(async (req, res) => {
//   let { new_password, password } = req.body;
//   if (!String(new_password || "").trim() || !String(password || "").trim()) {
//     throw new ApiError(401, "Newpassword and password are madetaory");
//   }

//   new_password = String(new_password).trim();
//   password = String(password).trim();

//   const user = await User.findById(req.user._id);
//   if (!user) {
//     throw new ApiError(401, "Invalid user in changeCurrentPassword");
//   }

//   const is_correct = await user.isPasswordCorrect(password);
//   if (!is_correct) {
//     throw new ApiError(401, "Invalid user in changeCurrentPassword");
//   }

//   user.password = new_password;
//   await user.save({ validateBeforeSave: false });

//   return res.status(200).json(new ApiResponse(200, {}, "Password changed Successfully"));
// });

// const getCurrentUser = asyncHandler(async (req, res) => {
//   return res
//     .status(201)
//     .json(new ApiResponse(200, req.user, "CUrrent User fetched Successfully"));
// });

// const updateAccountDetails = asyncHandler(async (req, res) => {
//   const { fullName, email } = req.body;
//   if (!fullName || !email) {
//     throw new ApiError(401, "All fields are required");
//   }
//   const user = await User.findByIdAndUpdate(
//     req.user?._id,
//     {
//       $set: {
//         fullName,
//         email: String(email).trim().toLowerCase(),
//       },
//     },
//     {
//       new: true,
//     }
//   ).select("-password -refreshToken");

//   return res
//     .status(200)
//     .json(new ApiResponse(200, user, "Account details updated successfully"));
// });

// const updateUserAvatar = asyncHandler(async (req, res) => {
//   const avatarLocalPath = req.file?.path;
//   if (!avatarLocalPath) {
//     throw new ApiError(401, "Avatar file is missing");
//   }
//  // console.log("avatarLocalPath=",avatarLocalPath);
//  // console.log("cloudinary_url=",process.env.CLOUDINARY_URL)
//   const avatarOnCloudinary = await uploadOnCloudinary(avatarLocalPath, "image");
//   //console.log("Cloudinary upload result:", { secure_url: res.secure_url, public_id: res.public_id, resource_type: res.resource_type });

//   if (!avatarOnCloudinary?.url) {
//     throw new ApiError(400, "Error while uploading on avatar");
//   }
//   const user = await User.findByIdAndUpdate(
//     req.user?._id,
//     {
//       $set: {
//         avatar: avatarOnCloudinary.url,
//       },
//     },
//     {
//       new: true,
//     }
//   ).select("-password -refreshToken");

//   return res
//     .status(200)
//     .json(new ApiResponse(200, user, "Avatar Image is Updated Successfully"));
// });

// export {
//   registerUser,
//   loginUser,
//   logoutUser,
//   refreshAccessToken,
//   changeCurrentPassword,
//   getCurrentUser,
//   updateAccountDetails,
//   updateUserAvatar,
// };
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

/* ------------------------------ helpers ------------------------------ */
const issueTokens = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(401, "UserId does not exist");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const cookieOpts = {
  httpOnly: true,
  secure: false,   // set true behind HTTPS
  sameSite: "lax",
  path: "/",
};

/* ------------------------------ controllers ------------------------------ */

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullName, password } = req.body;

  if ([username, email, fullName, password].some((f) => !String(f || "").trim())) {
    throw new ApiError(400, "Enter all the details");
  }

  const exists = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
  });
  if (exists) throw new ApiError(409, "User with these credentials already exists");

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

  const avatarUpload = await uploadOnCloudinary(avatarLocalPath, "image");
  if (!avatarUpload?.url) throw new ApiError(400, "Failed to upload avatar");

  const created = await User.create({
    username: username.trim().toLowerCase(),
    email: email.trim().toLowerCase(),
    password,
    fullName,
    avatar: avatarUpload.url,
  });

  const safeUser = await User.findById(created._id).select("-password -refreshToken");
  return res.status(201).json(new ApiResponse(201, safeUser, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { username = "", email = "", password = "" } = req.body;
   console.log("comming username=",username);
   console.log("email=",email);
   console.log("password=",password);
  if (!String(username).trim() && !String(email).trim())
    throw new ApiError(400, "Enter email or username");
  if (!String(password).trim()) throw new ApiError(400, "Password is required");

  const user = await User.findOne({
    $or: [{ email: email.trim().toLowerCase() }, { username: username.trim().toLowerCase() }],
  });
  if (!user) throw new ApiError(401, "Invalid credentials");

  const ok = await user.isPasswordCorrect(password);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = await issueTokens(user._id);
  const safeUser = await User.findById(user._id).select("-password -refreshToken");
console.log("yes it is here in login");
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOpts)
    .cookie("refreshToken", refreshToken, cookieOpts)
    .json(new ApiResponse(200, { user: safeUser, accessToken, refreshToken }, "Logged in"));
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined } });
  return res
    .status(200)
    .clearCookie("accessToken", cookieOpts)
    .clearCookie("refreshToken", cookieOpts)
    .json(new ApiResponse(200, {}, "Logged out"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incoming = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incoming) throw new ApiError(401, "Missing refresh token");

  let decoded;
  try {
    decoded = jwt.verify(incoming, process.env.REFRESH_TOKEN_SECRET);
  } catch (e) {
    throw new ApiError(401, e?.message || "Invalid refresh token");
  }

  const user = await User.findById(decoded?._id);
  if (!user || user.refreshToken !== incoming) throw new ApiError(401, "Invalid refresh token");

  const { accessToken, refreshToken } = await issueTokens(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOpts)
    .cookie("refreshToken", refreshToken, cookieOpts)
    .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed"));
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
  let { new_password, password } = req.body;
  if (!String(new_password || "").trim() || !String(password || "").trim()) {
    throw new ApiError(400, "New password and current password are required");
  }
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(401, "Invalid user");

  const ok = await user.isPasswordCorrect(password);
  if (!ok) throw new ApiError(401, "Current password is incorrect");

  user.password = String(new_password).trim();
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "Current user fetched"));
});

export const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!fullName || !email) throw new ApiError(400, "All fields are required");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { fullName, email: String(email).trim().toLowerCase() } },
    { new: true }
  ).select("-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, user, "Account updated"));
});

export const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is missing");

  const up = await uploadOnCloudinary(avatarLocalPath, "image");
  if (!up?.url) throw new ApiError(400, "Error while uploading avatar");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: up.url } },
    { new: true }
  ).select("-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, user, "Avatar updated"));
});

