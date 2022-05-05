const studentModel = require("../models/StudentModel");

module.exports = {
    GET_DASHBOARD_DATA : async (req, res) => {
        try{
            const totalStudents = await studentModel.Student.find({});
            const totalStudentsHR1 = await studentModel.Student.find({residence: "HR1"});
            const totalStudentsHR2 = await studentModel.Student.find({residence: "HR2"});
            const totalStudentsHR3 = await studentModel.Student.find({residence: "HR3"});

            res.status(200).json({totalStudents : totalStudents.length, HR1 : totalStudentsHR1.length, HR2 : totalStudentsHR2.length, HR3 : totalStudentsHR3.length})
        }catch(error){
            console.error("error no 896" + error);
            res.send(error);
        }
    }
}