##  FREED APP - SERVER API

##### BASE_URL = "https://dco-leave-app-api.herokuapp.com/"

### RECORDS ENDPOINTS

* :white_check_mark: - [get] - api/records/ - list all the records
* :white_check_mark: - [get] - api/records/:id - get particular record  
* :white_check_mark: - [get] - api/records/id/:studentId' - get all records of the student  
* :white_check_mark: - [get] - api/records/:id/:studentId - get particular record of the student
* :white_check_mark: - [post] - api/records/new - request new leave
* :white_check_mark: - [delete] - api/records/:id - cancel request
* :white_check_mark: - [put] - api/records/:id?status=['ACCEPTED',"DECLINED"] - permit update action for admin
* :white_check_mark: - [post] - api/records/:id/remark - add remark   body : { msg : "decline msg goes here", by : id of the admin user} x
* :white_check_mark: - [post] - /api/records/approval-request 
body : {
    "recordId" : "61463ded06af3a0ab4522525",
    "wardenId" : "6143882dd3a99860494961df"
}

* :white_check_mark: - [post] - /api/records/approval-decline 
body : {
    "recordId" : "61463ded06af3a0ab4522525",
    "adminId" : "6143882dd3a99860494961df",
    remark : ""
}

* :white_check_mark: - [post] - /api/records/approval-accept 
body : {
    "recordId" : "61463ded06af3a0ab4522525",
    "adminId" : "6143882dd3a99860494961df"
}




### PROFILE

* :white_check_mark: - [post] - api/student/update - update student profile
send req body as as follows -

# note make sure validate for each key not to be empty overwrite values are allowed.

{
"\_id": "60d42f8c83052434089e7672",
"firstName": "",
"lastName": "",
"email" : "amanadmin@leaveopju.com",
"course": "B.Tech",
"semester": 6,
"branch": "CSE"
}

### AUTH - student

 * :white_check_mark: - [post] - api/auth/register/student
 * :white_check_mark: - [post] - api/auth/login/student
 * :white_check_mark: - [post] - api/auth/spread_token
send token in headers as - [x-leave-auth-token] : token_value

### AUTH - admin

 * :white_check_mark: - [post] - api/auth/admin/register
 * :white_check_mark: - [post] - api/auth/admin/login
 * :white_check_mark: - [post] - api/auth/admin/spread_token
send token in headers as - [x-admin-auth-token] : "pass token here"

### ADMIN ROUTES

* :white_check_mark: - [get] - api/admin/list - get all admin users
* :white_check_mark: - [put] - api/records/:id?status=['ACCEPTED',"DECLINED"] - permit update * action
* :white_check_mark: - [get] - /api/admin/fetch/:adminId  

### GATEWAY - CHECKIN-CHECKOUT ROUTES

* :white_check_mark: - [get] - /api/gateway/checklist - list all the checklist
* :white_check_mark: - [post] - /api/gateway/checkout - perform checkin and checkout
{
"student" : "60eb41009f076b0004abe4a4"
}


### ADMIN

* [] get notified for new leave
* [] list all the leaves
* [] perform action on the leave

limited records / sem or / year
no new leave record untill previous records are finalized

### NOTIFICATION CLIENT CONNECTION

* emit - > 'join' and pass { id of the student } : Connect to server
* on - > 'msg to student' : listen for any noitification from admin

### NOTIFICATION GATE APP CONNECTION

* emit - > 'msg from admin' and pass { id, name of the student } : send notification to the student



## tasks

* proper on boarding-process
* profile
* improove ui feedback

<!--  changes made -->
- Record Model :  studentid - > student
- Record Model :  removed the "remark_by_hod" field


TODAYS TASK
 [x]- CONFIRM DIALOG 
 [x] CONNECTION TO THE APPROVAL API

 [x]- DECLINE AND ADD REMARK BY HOD - API 
 [x]- ACCEPT APPROVAL BY HOD - API 


 <!-- new changes -->
 - routes changes from 
        request-approval -> approval-request


COMPLETE THE APPROVAL MODULE - Co OFunder DC - Roshan Nahak [ The Android Master ] - Noogler
