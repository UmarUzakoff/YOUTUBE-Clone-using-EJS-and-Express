const { v4: uuid } = require("uuid");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt");
const Io = require("../utils/Io");
const Users = new Io("src/database/users.json");
const User = require("../models/User");

exports.home = (req, res) => {
  res.render("index");
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const users = await Users.read();

  //VALIDATION
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate({ username, password });
  if (error) {
    return res.render("login");
  }

  //Finding a username and Comparing Hash Values
  const findUser = users.find((user) => user.username === username);
  if (!findUser) {
    return res.render("login");
  }
  const comparePassword = await bcrypt.compare(password, findUser.password);
  if (!comparePassword) {
    return res.render("login");
  }
  //TOKEN
  const token = jwt.sign({ id: findUser.id });
  res.cookie("token", token, { maxAge: 86400000 });
  res.redirect("/");
};

exports.register = async (req, res) => {
  const { username, password } = req.body;
  var { avatar } = req.files;
  const users = await Users.read();

  //VALIDATION
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    avatar: Joi.required(),
  });

  const { error } = schema.validate({ username, password, avatar });
  if (error) {
    return res.render("register");
  }
  //Finding a username and Hashing password
  const findUser = users.find((user) => user.username === username);
  if (findUser) {
    return res.render("register");
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  //AVATAR
  let imageName = `${uuid()}.${avatar.mimetype.split("/")[1]}`;
  if (avatar.mimetype === "image/svg+xml") {
    //SVG fayllarning oxiri MIME type da svg+xml bilan tugar ekan, uni UIga chiqarish uchun image .svg bilan tugashi kerak, shuning uchun shunday qildim
    imageName = `${uuid()}.svg`;
  }
  avatar.mv(`${process.cwd()}/uploads/${imageName}`);

  //ID
  const id = uuid();

  //NEWUSER
  const newUser = new User(id, username, hashedPassword, imageName);
  const data = users.length ? [...users, newUser] : [newUser];
  Users.write(data);

  //TOKEN
  const token = jwt.sign({ id: newUser.id });
  res.cookie("token", token, { maxAge: 86400000 });
  res.redirect("/");
};