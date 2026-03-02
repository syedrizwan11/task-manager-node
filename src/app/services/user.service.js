import { UserRoles } from "../constants/index.js"
import { User } from "../models/user.model.js"
import { CustomError } from "../utils/customError.js"
import { generateCookieString, generateToken } from "./auth.service.js"

export const getUsers = async () => {
  const users = await User.find({
    isActive: true,
    role: { $ne: UserRoles.ADMIN },
  }).select("_id name role email")
  if (!users) {
    throw new Error("No users found")
  }
  return { users }
}

export const getUserCount = async (user) => {
  const count = await User.countDocuments({
    isActive: true,
    role: { $ne: UserRoles.ADMIN },
  })
  return { count }
}

export const updateUserProfile = async (userId, name, email, password) => {
  const user = await User.findById(userId)
  if (!user) throw new CustomError(404, "User not found")

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name, email, password },
    {
      new: true,
    },
  )

  const generatedToken = generateToken(
    updatedUser._id,
    updatedUser.name,
    updatedUser.email,
    updatedUser.role,
  )
  const generatedCookieString = generateCookieString(generatedToken)

  return { generatedCookieString, updatedUser }
}

export const deleteUser = async (userId) => {
  const user = await User.findById(userId)
  if (!user) throw new CustomError(404, "User not found")
  await User.findByIdAndUpdate(userId, { isActive: false })
}

export const getUserById = async (userId) => {
  const user = await User.findById(userId)
  if (!user || !user.isActive) throw new CustomError(404, "User not found")
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
}
