const settings = require(`../../server-settings`);
const mailer = require("../helpers/mailer");
const jwt = require(`jsonwebtoken`);
const ExampleModel = require("./models/exampleModel");

const controller = {};
const validateUserName = async function (name) {
  let result = false;
  const p = ExampleModel.findOne({ username: name }).exec();
  await p.then(user => {
    if (user === null) {
      result = true;
    }
  });
  return result;
};

controller.ExampleAddUser = async function (req, res) {
  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    countryCode: req.body.countryCode,
    phoneNo: req.body.phoneNo
  };

  if (typeof user.username !== `undefined`) {
    user.username = user.username.slice(0, 60);
  }

  if ((await validateUserName(user.username)) === false) {
    return res.status(400).json({ success: false, message: `That username already exists` });
  }

  const email_exist = await ExampleModel.findOne({email: user.email})

  if(email_exist){
    return res.status(400).json({ success: false, message: `That email already exists` });
  }

  const model = new ExampleModel(user);
  const promise = model.save();
  const token = jwt.sign({ sub: model._id }, settings.server.secret, {
    algorithm: "HS512"
  });
  promise
    .then(user => {
      let resp = {
        success: true,
        message: "User created successfully.",
        data: { user: user, token: token }
      };
      res.json(resp);
    })
    .catch(ex => {
      console.log(ex);
      
      let resp = {
        success: false,
        message: "error"
      };
      res.status(400).json(resp);
    });
};



module.exports = controller;
