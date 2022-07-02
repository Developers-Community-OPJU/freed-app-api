const {
  Student,
  VALIDATE_LOGIN,
  VALIDATE_REGISTER,
} = require("../models/StudentModel");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");

/**
 * nodemailer setup *
 */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.get("_nodemailer").EMAIL,
    pass: config.get("_nodemailer").PASS,
  },
});

const nodemailerOptions = (to, OTP) => {
  return {
    from: "dco.opju@gmail.com",
    to,
    subject: "Password Reset - FREED | O.P Jindal University",
    text: `Password  is ${OTP}`,
  };
};

const mailer = async (email, OTP) => {
  transporter.sendMail(nodemailerOptions(email, OTP), function (err, info) {
    if (err) {
      console.error(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = {
  LOGIN_STUDENT: async (req, res) => {
    try {
      // PARSING FORM DATA
      let { RID, password } = req.body;
      // VALIDATING THE REQ
      const { error } = VALIDATE_LOGIN(req.body);
      if (error)
        return res
          .status(400)
          .json({ msg: "Validation Failed", error: error.details[0].message });

      // FINDING STUDENT WITH RID

      const student = await Student.findOne({ RID });
      if (!student) {
        return res.status(401).json({
          msg: "Not Registered yet ?",
          success: false,
        });
      }

      // DECRYPTING PASSWORD
      const match = await bcrypt.compare(password, student.password);
      if (!match)
        return res.status(401).json({
          msg: "Invalid Credentials.. Please try Again",
          success: false,
        });
      const token = student.generateAuthToken();
      res.status(200).json({
        msg: "Logged In Successfully!",
        success: true,
        token,
      });
    } catch (error) {
      console.error(error);
    }
  },

  REGISTER_STUDENT: async (req, res) => {
    try {
      // PARSING AND FORMATING FORM DATA
      let student_data = {
        RID: req.body.RID,
        email: req.body.email,
        password: req.body.password,
      };

      // VALIDATING THE REQ
      const { error } = VALIDATE_REGISTER(req.body);
      if (error)
        return res
          .status(400)
          .json({ msg: "Validation Failed", error: error.details[0].message });

      //CHECKING DUPLICATE USER
      let student = await Student.findOne({ RID: student_data.RID });
      if (student) {
        return res.json({ msg: "Student Already Registered!", success: false });
      }

      student = new Student(student_data);

      // HASING PASSWORD USING BCRYPT
      const salt = await bcrypt.genSalt(15);
      student.password = await bcrypt.hash(student.password, salt);

      const result = await student.save();
      res.status(200).json({
        msg: "You have registered Successfully",
        success: true,
        result,
      });
    } catch (error) {
      console.error(error);
    }
  },

  RESET_PASSWORD: async (req, res) => {
    try {
      // GET CONTACT NUMBER / EMAIL
      // GENERATE NEW OTP
      //SEND OTP TO CONTACT /EMAIL

      const token = req.header("x-leave-auth-token");
      if (!token)
        return res
          .status(401)
          .json({ msg: "Access denied, No token provided.", success: false });

      let decoded = jwt.verify(token, config.get("jwtPrivateKey"));

      try {
        // checking duplicate user
        decoded = await Student.findOne({ _id: decoded.id }).select(
          "-password -__v -records"
        );
        if (decoded) {
          res.json({
            success: true,
            decoded,
          });
        } else {
          res.json({
            msg: `Sorry, Student Not Found`,
            success: false,
          });
        }
      } catch (error) {
        res.send(error);
      }
    } catch (error) {
      res.status(400).json({ msg: "Invalid token.", error, success: false });
    }
  },

  SPREAD_TOKEN: async (req, res) => {
    try {
      const token = req.header("x-leave-auth-token");
      if (!token)
        return res
          .status(401)
          .json({ msg: "Access denied, No token provided.", success: false });
      let decoded = jwt.verify(token, config.get("jwtPrivateKey"));
      try {
        // checking duplicate user
        decoded = await Student.findOne({ _id: decoded.id }).select(
          "-password -__v -records"
        );
        if (decoded) {
          res.json({
            success: true,
            decoded,
          });
        } else {
          res.json({
            msg: `Sorry, Student Not Found`,
            success: false,
          });
        }
      } catch (error) {
        res.send(error);
      }
    } catch (error) {
      res.status(400).json({ msg: "Invalid token.", error, success: false });
    }
  },

  GENERATE_PASSWORD: async (req, res) => {
    try {
      /**
       * get student with email
       */
      const { RID } = req.body;
      const student = await Student.findOne({ RID });

      if (!student) {
        return res.status(404).json({
          msg: "Invalid Registration No.",
          success: false,
        });
      }

      if (!student.email) {
        return res.status(405).json({
          msg: "You are not verified user",
          success: false,
        });
      }

      const OTP = await generateOTP();
      console.log("New OTP is : ", OTP);
      if (!OTP) {
        return res.status(501).json({
          msg: "Please, try again",
          success: false,
        });
      }

      // updaing the password
      const salt = await bcrypt.genSalt(15);
      const newPassword = await bcrypt.hash(OTP, salt);

      const result = await Student.findOneAndUpdate(
        { RID },
        {
          password: newPassword,
        }
      );

      // sending mail to RID
      await mailer(student.email, OTP);

      res.status(200).json({
        msg: `Recovery Password Sent to ${student.email}`,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ msg: "oops! it's us", error, success: false });
    }
  },
};

async function generateOTP(length = 7) {
  const OTP = otpGenerator.generate(length, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
  return OTP;
}
