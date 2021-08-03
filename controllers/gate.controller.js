const { Checklist } = require('../models/Checklist')
const { Checkout } = require('../models/Checkout')
const { Checkin } = require('../models/Checkin')

module.exports = {

    CHECK_OUT: async (req, res) => {
        try {
            // fetch studentid and record id
            const student = req.body.student;

            // check if studentid in checklist
            let inChecklist = await Checklist.findOne({ student })

            // check if studentid in checkout
            let inCheckout = await Checkout.findOne({ student })


            if (!inChecklist) return res
                .status(400).json({
                    msg: "Sorry, You Cannot Proceed to Checkout",
                    success: false
                })  

            // console.log("checklist", inChecklist)
            // console.log("checkout", inCheckout)

            // *********** ************* ************** ******************
            //     if user already in checkout list -> perform checkin process
            // *********** ************* ************** ******************

            if (inCheckout) {
                // console.log("Checking in...")
                const checkin = await new Checkin({
                    student: inChecklist.student,
                    record: inChecklist.record
                });

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
                        msg: "Welcome, Great to have you back!",
                        success: true
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
                        msg: "Hurray! Have a Great Journey :)",
                        success: true
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