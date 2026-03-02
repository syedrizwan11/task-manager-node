import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { UserRoles } from "../constants/index.js"

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(UserRoles),
    default: UserRoles.USER,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
})

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema)
