import { Router } from "express"
import {
  assignTaskController,
  createTaskController,
  deleteTaskController,
  getTaskByIdController,
  getTaskCountController,
  getTasksController,
  updateTaskController,
  updateTaskStatusController,
} from "../controllers/task.controller.js"
import { auth } from "../middlewares/auth.js"
const router = Router()

router.post("/tasks", auth(), createTaskController)
router.get("/tasks", auth(), getTasksController)
router.get("/tasks/:id", auth(), getTaskByIdController)
router.delete("/tasks/:id", auth(), deleteTaskController)
router.patch("/tasks/:id", auth(), updateTaskController)

router.post("/assign-task", auth(["admin"]), assignTaskController)
router.post("/update-task-status", auth(), updateTaskStatusController)

router.get("/tasks-count", auth(["admin"]), getTaskCountController)
export default router
