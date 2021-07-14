const { Student, VALIDATE_LOGIN, VALIDATE_REGISTER } = require("../models/StudentModel")
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');



module.exports = {

    UPDATE_STUDENT_PROFILE: async (req, res) => {
        try {
            // PARSING FORM DATA
            const student = { firstName, lastName, email, course, semester, branch } = req.body;

            // FINDING STUDENT WITH ID
            console.log(student)
            await Student.findOneAndUpdate({ _id: req.body._id }, student)

            if (!student) {
                return res
                    .status(404)
                    .json({
                        msg: "Student Not Found!",
                        success: false,
                    });
            }
            res
                .status(200).json({
                    msg: "Updated Successfully!",
                    success: true,

                });


        } catch (error) {
            console.error(error)
        }
    },

}