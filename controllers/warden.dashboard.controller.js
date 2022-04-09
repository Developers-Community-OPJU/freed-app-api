const studentModel = require("../models/StudentModel");

module.exports = {
    GET_DASHBOARD_DATA : async (req, res) => {
        try{
            const totalStudents = await studentModel.Student.find({});
            const totalStudentOfsHR1 = await studentModel.Student.find({residence: "HR1"});
            const totalStudentOfsHR2 = await studentModel.Student.find({residence: "HR2"});
            const totalStudentOfsHR3 = await studentModel.Student.find({residence: "HR3"});

            res.status(200).json({totalStudents : totalStudents.length, HR1 : totalStudentOfsHR1.length, HR2 : totalStudentOfsHR2.length, HR3 : totalStudentOfsHR3.length})
        }catch(error){
            console.error("error no 896" + error);
            res.send(error);
        }
    }
}