const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required!"],
    minLength: [3, "First Name must contain at least 3 characters!"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required!"],
    minLength: [3, "Last Name must contain at least 3 characters!"],
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    validate: [validator.isEmail, "Provide a valid email!"],
    unique: true, // Ensure uniqueness
  },
  phone: {
    type: String,
    required: [true, "Phone is required!"],
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v); // Ensures exactly 10 digits
      },
      message: "Phone number must contain exactly 10 digits!",
    },
  },
  dob: {
    type: Date,
    required: [true, "DOB is required!"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required!"],
    enum: ["Male", "Female", "Other"], // Optional addition
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    minLength: [8, "Password must contain at least 8 characters!"],
    select: false,
  },
  role: {
    type: String,
    required: [true, "User role required!"],
    enum: ["Patient", "Admin"], // Removed "Doctor"
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const User = mongoose.model("User", userSchema);
