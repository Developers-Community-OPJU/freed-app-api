const { Admin, VALIDATE_REGISTER, VALIDATE_LOGIN } = require("../models/AdminModel")
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');


module.exports = {

    LOGIN_ADMIN: async (req, res) => {
        try {
            // PARSING FORM DATA
            let { username, password } = req.body;
            console.log(username, password)
            // VALIDATING THE REQ
            const { error } = VALIDATE_LOGIN(req.body);
            if (error) return res
                .status(400)
                .json({ msg: "Validation Failed", error: error.details[0].message });

            // FINDING STUDENT WITH RID

            const admin = await Admin.findOne({ username })
            if (!admin) {
                return res
                    .status(401)
                    .json({
                        msg: "Make sure you are registered!",
                        success: false,
                    });
            }

            // DECRYPTING PASSWORD
            const match = await bcrypt.compare(password, admin.password);
            if (!match) return res
                .status(401)
                .json({
                    msg: "Invalid Credentials.. Please try Again",
                    success: false,
                });

            // GENERATING TOKEN
            const token = admin.generateAuthToken();

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

    REGISTER_ADMIN: async (req, res) => {
        try {

            // PARSING AND FORMATING FORM DATA
            let admin_data = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
            }

            // VALIDATING THE REQ
            const { error } = VALIDATE_REGISTER(req.body);
            if (error) return res
                .status(400)
                .json({ msg: "Validation Failed", error: error.details[0].message });

            //CHECKING DUPLICATE USER
            let admin = await Admin.findOne({ username: admin_data.username });
            if (admin) { return res.json({ msg: "Already Registered!", success: false }) }

            admin = new Admin(admin_data)

            // HASING PASSWORD USING BCRYPT
            const salt = await bcrypt.genSalt(15)
            admin.password = await bcrypt.hash(admin.password, salt)

            const result = await admin.save();
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
            const token = req.header("x-admin-auth-token");
            if (!token) return res.status(401).json({ msg: "Access denied, No token provided.", success: false })
            let decoded = jwt.verify(token, config.get('jwtPrivateKey'));
            try {
                // checking duplicate user
                decoded = await Admin.findOne({ _id: decoded._id })
                    .select('-password -__v -records')
                if (decoded) {
                    res.json({
                        success: true,
                        decoded
                    })
                }
                else {
                    res.json({
                        msg: `Sorry, User Not Found`,
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