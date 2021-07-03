const { Student, VALIDATE_LOGIN, VALIDATE_REGISTER } = require("../models/StudentModel")
const bcrypt = require('bcryptjs');
const config = require('config');


module.exports = {

    LOGIN_STUDENT: async (req, res) => {
        try {
            // PARSING FORM DATA
            let { RID, password } = req.body;
            console.log(RID, password)
            // VALIDATING THE REQ
            const { error } = VALIDATE_LOGIN(req.body);
            if (error) return res
                .status(400)
                .json({ msg: "Validation Failed", error: error.details[0].message });

            // FINDING STUDENT WITH RID

            const student = await Student.findOne({ RID })
            if (!student) {
                return res
                    .status(401)
                    .json({
                        msg: "Not Registered yet ?",
                        success: false,
                    });
            }

            // DECRYPTING PASSWORD
            const match = await bcrypt.compare(password, student.password);
            if (!match) return res
                .status(401)
                .json({
                    msg: "Invalid Credentials.. Please try Again",
                    success: false,
                });
            const token = student.generateAuthToken();
            res
                .status(200).json({
                    msg: "Logged In Successfully!",
                    success: true,
                    token
                });


        } catch (error) {
            console.error(error)
        }
    },

    REGISTER_STUDENT: async (req, res) => {
        try {

            // PARSING AND FORMATING FORM DATA
            let student_data = {
                RID: req.body.RID,
                email: req.body.email,
                password: req.body.password,
            }

            // VALIDATING THE REQ
            const { error } = VALIDATE_REGISTER(req.body);
            if (error) return res
                .status(400)
                .json({ msg: "Validation Failed", error: error.details[0].message });

            //CHECKING DUPLICATE USER
            let student = await Student.findOne({ RID: student_data.RID });
            if (student) { return res.json({ msg: "Student Already Registered!", success: false }) }

            student = new Student(student_data)

            // HASING PASSWORD USING BCRYPT
            const salt = await bcrypt.genSalt(15)
            student.password = await bcrypt.hash(student.password, salt)

            const result = await student.save();
            res
                .status(200)
                .json({
                    msg: "You have registered Successfully",
                    success: true,
                    result
                })
        } catch (error) {
            console.error(error)
        }
    },

    SPREAD_TOKEN: async (req, res) => {
        try {
            const token = req.header("x-leave-auth-token");
            if (!token) return res.status(401).json({ msg: "Access denied, No token provided.", success: false });
            let decoded = jwt.verify(token, config.get('jwtPrivateKey'));
            try {
                // checking duplicate user
                decoded = await Student.findOne({ _id: decoded._id })
                    .select('--v -_id -password -records')
                if (decoded) {
                    res.json({
                        msg: `user Found with username ${decoded.firstName} ${decoded.lastName}`,
                        success: true,
                        decoded
                    })
                }
                else {
                    res.json({
                        msg: `Sorry, Student Not Found`,
                        success: false
                    })
                }
            } catch (error) {
                res.send(error)
            }
        } catch (error) {
            res.status(400).json({ msg: "Invalid token.", error, success: false })
        }
    }

}