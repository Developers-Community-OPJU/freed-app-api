const { RecordModel } = require('../models/RecordModel');

module.exports = {
    // LIST ALL LEAVE FORMS
    all: async (req, res) => {
        try {
            let records = await RecordModel.find({});
            res.send(records);
        } catch (error) {
            console.error(error)
        }
    },

    // APPLY FOR NEW LEAVE FORM
    apply: async (req, res) => {
        try {
            let leave = new RecordModel({
                from: Date.now(),
                to: Date.now(),
                RID: "01ug18020003",
                destination: "Addres Goes here..",
                reason: "i wanted to flew away from the hostel.. been a dream ^-^"
            })
            await leave.save();
            res
                .status(200)
                .send("Leave Application has been submitted!")
        } catch (error) {
            console.error(error)
        }
    }

}