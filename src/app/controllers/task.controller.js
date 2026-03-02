import Joi from "joi"
import {
  assignTask,
  createTask,
  deleteTask,
  getTaskById,
  getTaskCount,
  getTasks,
  updateTask,
  updateTaskStatus,
} from "../services/task.service.js"
import { apiResponse } from "../utils/apiResponse.js"
import { CustomError } from "../utils/customError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { TaskStatus } from "../constants/index.js"

const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  dueDate: Joi.date().required(),
})

const updateTaskSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  dueDate: Joi.date().optional(),
})

const updateTaskStatusSchema = Joi.object({
  id: Joi.string().required(),
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .required(),
})

const assignTaskSchema = Joi.object({
  id: Joi.string().required(),
  assignedTo: Joi.string().required(),
})

const deleteTaskSchema = Joi.object({
  id: Joi.string().required(),
})

const getTaskByIdSchema = Joi.object({
  id: Joi.string().required(),
})

export const createTaskController = asyncHandler(async (req, res) => {
  const { error, value } = createTaskSchema.validate(req.body)
  if (error) {
    throw new CustomError(400, error.details[0].message)
  }
  const { title, description, dueDate } = value

  await createTask(title, description, dueDate, req.user)

  apiResponse(res, 200, "task created", {})
})

export const getTasksController = asyncHandler(async (req, res) => {
  const data = await getTasks(req.user)
  apiResponse(res, 200, "tasks retrieved", data.tasks)
})

export const getTaskByIdController = asyncHandler(async (req, res) => {
  const { error, value } = getTaskByIdSchema.validate(req.params)
  if (error) {
    throw new CustomError(400, error.details[0].message)
  }
  const { id } = value
  const data = await getTaskById(id, req.user)
  apiResponse(res, 200, "task retrieved", data.task)
})

export const updateTaskController = asyncHandler(async (req, res) => {
  const { error, value } = updateTaskSchema.validate(req.body)
  if (error) {
    throw new CustomError(400, error.details[0].message)
  }
  const { title, description, dueDate } = value

  const data = await updateTask(
    req.params.id,
    title,
    description,
    dueDate,
    req.user,
  )

  apiResponse(res, 200, "task updated", data)
})

export const updateTaskStatusController = asyncHandler(async (req, res) => {
  const { error, value } = updateTaskStatusSchema.validate(req.body)
  if (error) {
    throw new CustomError(400, error.details[0].message)
  }
  const { id, status } = value

  const data = await updateTaskStatus(id, status, req.user)

  apiResponse(res, 200, "task updated", data.updatedTask)
})

export const assignTaskController = async (req, res) => {
  const { error, value } = assignTaskSchema.validate(req.body)
  if (error) {
    throw new CustomError(400, error.details[0].message)
  }
  const { id, assignedTo } = value
  try {
    const data = await assignTask(id, assignedTo, req.user)

    apiResponse(res, 200, "task assigned", data.updatedTask)
  } catch (error) {
    if (error instanceof CustomError) {
      throw new CustomError(error.statusCode, error.message)
    }
    throw new CustomError(500, "internal server error")
  }
}

export const deleteTaskController = asyncHandler(async (req, res) => {
  const { error, value } = deleteTaskSchema.validate(req.params)
  if (error) {
    throw new CustomError(400, error.details[0].message)
  }
  const { id } = value

  const data = await deleteTask(id, req.user)

  apiResponse(res, 200, "task deleted", {})
})

export const getTaskCountController = asyncHandler(async (req, res) => {
  const data = await getTaskCount(req.user)
  apiResponse(res, 200, "task count retrieved", data.count)
})
