const studentModel = require("../models/StudentModel");

module.exports = {
    GET_DASHBOARD_DATA : async (req, res) => {
        try{
            studentModel.Student.find().then(result => 
                {res.status(200).json({totalStudents : result.length})})
        }catch(error){
            console.error(error);
            res.send(error);
        }
    }
}