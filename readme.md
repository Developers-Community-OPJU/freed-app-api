# TODOS

================
create models - student - admin - superadmin

## SERVER API

# BASE_URL = "https://dco-leave-app-api.herokuapp.com/"

### RECORDS ENDPOINTS

[x][get] - api/records/ - list all the records
[x][get] - api/records/:id - get particular record  
[x][get] - api/records/id/:studentId' - get all records of the student  
[x][get] - api/records/:id/:studentId - get particular record of the student
[x][post] - api/records/new - request new leave
[x][delete] - api/records/:id - cancel request
[x][put] - api/records/:id?permitted=[true/false] - permit update action for admin

### AUTH - student

[x][post] - api/auth/register/student
[x][post] - api/auth/login/student
[x][post] - api/auth/spread_token
send token in headers as - [x-leave-auth-token] : token_value

### AUTH - admin

[][post] - api/auth/register/admin
[][post] - api/auth/login/admin

## tasks

proper on boarding-process
profile

### ADMIN

[] get notified for new leave
[] list all the leaves
[] perform action on the leave

limited records / sem or / year
no new leave record untill previous records are finalized

profile
Auth
