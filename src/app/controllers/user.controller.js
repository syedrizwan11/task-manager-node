import { registerUser } from "../services/auth.service.js"
import {
  deleteUser,
  getUserById,
  getUserCount,
  getUsers,
  updateUserProfile,
} from "../services/user.service.js"
import { apiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { CustomError } from "../utils/customError.js"
import Joi from "joi"

const CreateUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().optional(),
  password: Joi.string().required(),
})

const UpdateUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().optional(),
})

const UserIdSchema = Joi.object({
  id: Joi.string().required(),
})

export const getUserController = asyncHandler(async (req, res) => {
  const data = await getUsers()
  apiResponse(res, 200, "users retrieved", data.users)
})

export const getUserCountController = asyncHandler(async (req, res) => {
  const data = await getUserCount(req.user)
  apiResponse(res, 200, "user count retrieved", data.count)
})

export const createUserController = asyncHandler(async (req, res) => {
  const { error, value } = CreateUserSchema.validate(req.body)
  if (error) {
    throw new CustomError(400, error.details[0].message)
  }
  const { name, email, password } = value
  await registerUser(name, email, password)
  apiResponse(res, 200, "user created", {})
})

export const updateUserProfileController = asyncHandler(async (req, res) => {
  const { error, value } = UpdateUserSchema.validate(req.body)
  if (error) {
    throw new CustomError(400, error.details[0].message)
  }
  const { name, email } = value
  const data = await updateUserProfile(req.user.id, name, email)
  res.setHeader("Set-Cookie", data.generatedCookieString)
  apiResponse(res, 200, "user updated", {})
})

export const deleteUserController = asyncHandler(async (req, res) => {
  const { error, value } = UserIdSchema.validate(req.params)
  if (error) {
    throw new CustomError(400, error.details[0].message)
  }
  const { id } = value
  const data = await deleteUser(id)
  apiResponse(res, 200, "user deleted", {})
})

export const getCurrentUserController = asyncHandler(async (req, res) => {
  const data = await getUserById(req.user.id)
  apiResponse(res, 200, "user retrieved", data.user)
})
