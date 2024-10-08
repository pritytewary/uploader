import withApiWrapper from "@/lib/with-api-wrapper";
import User from "@/models/User";
import bcrypt from "bcryptjs";

import HttpError from "http-errors";

async function signupApi(req, res) {
  const { name, username, password } = req.body;

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    throw new HttpError.BadRequest("User already exist");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    username,
    password: hashedPassword,
  });

  res.status(201).json({
    message: "User registered.",
    data: user,
  });
}

export default withApiWrapper(signupApi);
