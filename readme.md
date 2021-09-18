# TODOS

================
create models - student - admin - superadmin

## SERVER API

# BASE_URL = "https://dco-leave-app-api.herokuapp.com/"

### RECORDS ENDPOINTS

* [x][get] - api/records/ - list all the records
* [x][get] - api/records/:id - get particular record  
* [x][get] - api/records/id/:studentId' - get all records of the student  
* [x][get] - api/records/:id/:studentId - get particular record of the student
* [x][post] - api/records/new - request new leave
* [x][delete] - api/records/:id - cancel request
* [x][put] - api/records/:id?status=['ACCEPTED',"DECLINED"] - permit update action for admin
* [x][post] - api/records/:id/remark - add remark   body : { msg : "decline msg goes here", by : id of the admin user}
* [x][post] - /api/records/request-approval 
body : {
    "recordId" : "61463ded06af3a0ab4522525",
    "wardenId" : "6143882dd3a99860494961df"
}

### PROFILE

* [x][post] - api/student/update - update student profile
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

 * [x][post] - api/auth/register/student
 * [x][post] - api/auth/login/student
 * [x][post] - api/auth/spread_token
send token in headers as - [x-leave-auth-token] : token_value

### AUTH - admin

 * [x][post] - api/auth/admin/register
 * [x][post] - api/auth/admin/login
 * [x][post] - api/auth/admin/spread_token
send token in headers as - [x-admin-auth-token] : "pass token here"

### ADMIN ROUTES

* [x][get] - api/admin/list - get all admin users
* [x][put] - api/records/:id?status=['ACCEPTED',"DECLINED"] - permit update * action
* [x][get] - /api/admin/fetch/:adminId  

### GATEWAY - CHECKIN-CHECKOUT ROUTES

* [x][get] - /api/gateway/checklist - list all the checklist
* [x][post] - /api/gateway/checkout - perform checkin and checkout
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

