### Student routes

`GET /students`

`GET /students/:student_id`

`GET /students/:student_id/advisors`

`GET /students/:student_id/classes`


### Instructor routes

`GET /instructors`

`GET /instructors/:instructor_id`

`GET /instructors/:instructor_id/classes`


### Advisor routes

`GET /advisors`

`GET /advisors/:advisor_id`

`GET /advisors/:advisor_id/students`


### Course routes

`GET /courses`

`GET /courses/subjects`

`GET /courses/subjects/:subject`

`GET /courses/subjects/:subject/:catalog_number`

`GET /courses/subjects/:subject/:catalog_number/classes`


### Class routes

`GET /classes`

`GET /classes/terms`

`GET /classes/terms/:term`

`GET /classes/terms/:term/:class_number`

`GET /classes/terms/:term/:class_number/students`


### Requiste routes

`GET /requisites`


### Data loading routes

All of these require a `multipart/form-data` encoding and a `file` parameter
containing the CSV data file.

`POST /courses`

`POST /requisites`

`POST /enrollments`
