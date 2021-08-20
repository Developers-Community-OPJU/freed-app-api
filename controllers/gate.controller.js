const { Checklist } = require('../models/Checklist')
const { Checkout } = require('../models/Checkout')
const { Checkin } = require('../models/Checkin')
const { RecordModel } = require('../models/RecordModel');

module.exports = {

    CHECK_OUT: async (req, res) => {
        try {

            // check if studentid in checklist
            let inChecklist = await Checklist.findOne({ record: req.body.recordId })
            // check if studentid in checkout
            let inCheckout = await Checkout.findOne({ record: req.body.recordId })

            if (!inChecklist) return res
                .status(200).json({
                    msg: "Sorry, You Cannot Proceed to Checkout",
                    success: false
                })

            // *********** ************* ************** ******************
            //     if user already in checkout list -> perform checkin process
            // *********** ************* ************** ******************

            if (inCheckout) {
                // console.log("Checking in...")
                const checkin = await new Checkin({
                    student: inChecklist.student,
                    record: inChecklist.record
                });

                console.log(inChecklist)

                let removed = await Checkout.findOneAndRemove({
                    record: inChecklist.record
                })

                const removedFromCheckList = await Checklist.findOneAndRemove({
                    record: inChecklist.record
                })

                // console.log(removedFromCheckList)

                if (removed) {
                    await checkin.save()
                    return res.json({
                        checkedin: true,
                        msg: "Welcome, Great to have you back!",
                        success: true,
                        data: {
                            student: inChecklist.student
                        }
                    })
                }

            }
            else if (inChecklist) {
                // console.log("Checking out...")
                // if yes, add student with record id in the checkout             
                const checkout = await new Checkout({
                    student: inChecklist.student,
                    record: inChecklist.record
                })

                await checkout.save();
                return res
                    .status(200)
                    .json({
                        checkedout: true,
                        msg: "Hurray! Have a Great Journey :)",
                        success: true,
                        data: {
                            student: inChecklist.student
                        }
                    })
            }
        }
        catch (error) {
            console.error(error)
        }
    },

    GET_CHECK_LIST: async (req, res) => {
        try {

            const record = await Checklist.find({});

            if (!record) return res.status(404).json({ msg: "No Records Found", success: false });

            res.json({
                success: true,
                record
            });

        } catch (error) {
            console.error(error)
        }
    }

}