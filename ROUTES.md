### Student routes

`GET /students`

`GET /students/:student_id`

`GET /students/:student_id/advisors`

`GET /students/:student_id/sections`


### Instructor routes

`GET /instructors`

`GET /instructors/:instructor_id`

`GET /instructors/:instructor_id/sections`


### Advisor routes

`GET /advisors`

`GET /advisors/:advisor_id`

`GET /advisors/:advisor_id/students`


### Course routes

`GET /courses`

`GET /courses/subjects`

`GET /courses/subjects/:subject`

`GET /courses/subjects/:subject/:catalog_number`

`GET /courses/subjects/:subject/:catalog_number/sections`

`GET /courses/subjects/:subject/:catalog_number/requisites`

`GET /courses/subjects/:subject/:catalog_number/eligible`

### Section routes

`GET /sections`

`GET /sections/terms`

`GET /sections/terms/:term`

`GET /sections/terms/:term/:class_number`

`GET /sections/terms/:term/:class_number/students`


### Requiste routes

`GET /requisites`


### Data loading routes

All of these require a `multipart/form-data` encoding and a `file` parameter
containing the CSV data file.

`POST /courses`

`POST /requisites`

`POST /enrollments`
