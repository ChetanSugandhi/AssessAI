## teacher signup

```
curl -X POST http://localhost:7777/auth/teacher-signup \
                     -H "Content-Type: application/json" \
                     -d '{"name": "Anupam Jain", "username": "anupam", "email": "ac@ac.com", "password": "12345678"}'

{"message":"Teacher account created successfully"}
```

---

## teacher login

```
curl -X POST http://localhost:7777/auth/teacher-login \
                     -H "Content-Type: application/json" \
                     -d '{"username": "anupam", "password": "12345678"}'

{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJjZmNlM2Y3YzM0ZDM0MDkyNjY0YiIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzQyOTE3NjEyLCJleHAiOjE3NDU1MDk2MTJ9.8emLWvxQnrCVawFTsqECc9mureSD-0XCujFS54zouLY","role":"teacher"}
```

---

## student signup

```
curl -X POST http://localhost:7777/auth/student-signup \
                     -H "Content-Type: application/json" \
                     -d '{"name": "STUanupam", "username":"rjanupam", "email":"ac@ac.com", "password":"12345678"}'

{"message":"Student account created successfully"}
```

---

## student login

```
curl -X POST http://localhost:7777/auth/student-login \
                     -H "Content-Type: application/json" \
                     -d '{ "username":"rjanupam",  "password":"12345678"}'

{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJkMWFkM2Y3YzM0ZDM0MDkyNjY1NSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQyOTE4MDk1LCJleHAiOjE3NDU1MTAwOTV9.BofayzB0I8rOSC92mOZcLcTzml1aYFVxmBVv1NpBECg","role":"student"}
```

---

## teacher dashboard

```
curl -X GET http://localhost:7777/teacher-dashboard \
                     -H "Content-Type: application/json" \
                     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJjZmNlM2Y3YzM0ZDM0MDkyNjY0YiIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzQyOTE3NjEyLCJleHAiOjE3NDU1MDk2MTJ9.8emLWvxQnrCVawFTsqECc9mureSD-0XCujFS54zouLY"

{"createdClassrooms":[{"className":"Math 101","subject":"Mathematics","classCode":"MATH102","studentCount":1,"topicCount":0,"learningAssessmentStatus":"Not Available","recentTopics":[]}]}
```

---

## classroom create (teacher)

```
curl -X POST http://localhost:7777/classroom/create \
                     -H "Content-Type: application/json" \
                     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJjZmNlM2Y3YzM0ZDM0MDkyNjY0YiIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzQyOTE3NjEyLCJleHAiOjE3NDU1MDk2MTJ9.8emLWvxQnrCVawFTsqECc9mureSD-0XCujFS54zouLY" \
                     -d '{
                   "name": "Math 101",
                   "subject": "Mathematics",
                   "classroomCode": "MATH102",
                   "description": "A beginner'\''s course in math"
                 }'

{"className":"Math 101","subject":"Mathematics","classCode":"MATH102","description":"A beginner's course in math","topicCount":0}
```

---

## classroom details (teacher)

```
curl -X GET http://localhost:7777/classroom/MATH102 \
                     -H "Content-Type: application/json" \
                     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJjZmNlM2Y3YzM0ZDM0MDkyNjY0YiIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzQyOTE3NjEyLCJleHAiOjE3NDU1MDk2MTJ9.8emLWvxQnrCVawFTsqECc9mureSD-0XCujFS54zouLY"

{"className":"Math 101","classJoinedDate":"2025-03-25T15:59:42.955Z","teacherName":"Anupam Jain","subject":"Mathematics","classDescription":"A beginner's course in math","assignments":[{"title":"Algebra","description":"class 10: get to know basics of algebra topics","creationDate":"2025-03-25T16:05:59.378Z"}]}
```

---

## classroom assignment quiz (mcq) create (teacher)

```
curl -X POST http://localhost:7777/assignment/MATH102/quiz \
                     -H "Content-Type: application/json" \
                     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJjZmNlM2Y3YzM0ZDM0MDkyNjY0YiIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzQyOTE3NjEyLCJleHAiOjE3NDU1MDk2MTJ9.8emLWvxQnrCVawFTsqECc9mureSD-0XCujFS54zouLY" \
                     -d '{"title": "Algebra", "description": "class 10: get to know basics of algebra topics"}'

{"id":"67e2dad5bf5ff4652fddd3eb","title":"Algebra","description":"class 10: get to know basics of algebra topics","type":"quiz","quizContent":[{"question":"Simplify the expression: 3x + 2x - x","options":{"A":"6x","B":"4x","C":"5x","D":"2x"},"correctAnswer":"B","_id":"67e2dad5bf5ff4652fddd3ec"},{"question":"Solve for x: 2x + 5 = 11","options":{"A":"3","B":"8","C":"6","D":"16"},"correctAnswer":"A","_id":"67e2dad5bf5ff4652fddd3ed"},{"question":"Expand the expression: (x + 3)(x - 2)","options":{"A":"x² + x - 6","B":"x² + 5x - 6","C":"x² - x - 6","D":"x² - 5x - 6"},"correctAnswer":"A","_id":"67e2dad5bf5ff4652fddd3ee"},{"question":"What is the value of  y when x = 2 in the equation y = 3x - 1?","options":{"A":"4","B":"5","C":"6","D":"7"},"correctAnswer":"B","_id":"67e2dad5bf5ff4652fddd3ef"},{"question":"Solve the equation: x² - 9 = 0","options":{"A":"x = 3 only","B":"x = -3 only","C":"x = 3 or x = -3","D":"x = 0"},"correctAnswer":"C","_id":"67e2dad5bf5ff4652fddd3f0"},{"question":"If a = 4 and b = -2, what is the value of 2a + 3b?","options":{"A":"2","B":"10","C":"-2","D":"14"},"correctAnswer":"A","_id":"67e2dad5bf5ff4652fddd3f1"},{"question":"Factorize the expression: x² + 5x + 6","options":{"A":"(x + 1)(x + 6)","B":"(x + 2)(x + 3)","C":"(x - 2)(x - 3)","D":"(x + 1)(x - 6)"},"correctAnswer":"B","_id":"67e2dad5bf5ff4652fddd3f2"},{"question":"What is the slope of the line represented by the equation y = 2x + 4?","options":{"A":"4","B":"2","C":"-4","D":"-2"},"correctAnswer":"B","_id":"67e2dad5bf5ff4652fddd3f3"}],"dueDate":"2025-03-26T23:59:59.999Z"}
```

---

## get all classroom assignments (teacher & student)

- will show correctAnswer if dueDate passed

```
curl -X GET http://localhost:7777/assignment/MATH102 \
                     -H "Content-Type: application/json" \
                     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJkMWFkM2Y3YzM0ZDM0MDkyNjY1NSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQyOTE4MDk1LCJleHAiOjE3NDU1MTAwOTV9.BofayzB0I8rOSC92mOZcLcTzml1aYFVxmBVv1NpBECg"

[{"_id":"67e2dad5bf5ff4652fddd3eb","classroom":"67e2d2ee3f7c34d340926661","title":"Algebra","description":"class 10: get to know basics of algebra topics","type":"quiz","createdBy":"67e2cfce3f7c34d34092664b","dueDate":"2025-03-26T23:59:59.999Z","quizContent":[{"question":"Simplify the expression: 3x + 2x - x","options":{"A":"6x","B":"4x","C":"5x","D":"2x"},"_id":"67e2dad5bf5ff4652fddd3ec"},{"question":"Solve for x: 2x + 5 = 11","options":{"A":"3","B":"8","C":"6","D":"16"},"_id":"67e2dad5bf5ff4652fddd3ed"},{"question":"Expand the expression: (x + 3)(x - 2)","options":{"A":"x² + x - 6","B":"x² + 5x - 6","C":"x² - x - 6","D":"x² - 5x - 6"},"_id":"67e2dad5bf5ff4652fddd3ee"},{"question":"What is the value of  y when x = 2 in the equation y = 3x - 1?","options":{"A":"4","B":"5","C":"6","D":"7"},"_id":"67e2dad5bf5ff4652fddd3ef"},{"question":"Solve the equation: x² - 9 = 0","options":{"A":"x = 3 only","B":"x = -3 only","C":"x = 3 or x = -3","D":"x = 0"},"_id":"67e2dad5bf5ff4652fddd3f0"},{"question":"If a = 4 and b = -2, what is the value of 2a + 3b?","options":{"A":"2","B":"10","C":"-2","D":"14"},"_id":"67e2dad5bf5ff4652fddd3f1"},{"question":"Factorize the expression: x² + 5x + 6","options":{"A":"(x + 1)(x + 6)","B":"(x + 2)(x + 3)","C":"(x - 2)(x - 3)","D":"(x + 1)(x - 6)"},"_id":"67e2dad5bf5ff4652fddd3f2"},{"question":"What is the slope of the line represented by the equation y = 2x + 4?","options":{"A":"4","B":"2","C":"-4","D":"-2"},"_id":"67e2dad5bf5ff4652fddd3f3"}],"createdAt":"2025-03-25T16:33:25.934Z","__v":0}]
```

---

## student dashboard

```
curl -X GET http://localhost:7777/student-dashboard \
                     -H "Content-Type: application/json" \
                     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJkMWFkM2Y3YzM0ZDM0MDkyNjY1NSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQyOTE4MDk1LCJleHAiOjE3NDU1MTAwOTV9.BofayzB0I8rOSC92mOZcLcTzml1aYFVxmBVv1NpBECg"

{"joinedClassrooms":[{"name":"Math 101","subject":"Mathematics","description":"A beginner's course in math","teacher":"Anupam Jain"}]}
```

---

## classroom join (student)

```
curl -X POST http://localhost:7777/classroom/join \
                     -H "Content-Type: application/json" \
                     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJkMWFkM2Y3YzM0ZDM0MDkyNjY1NSIsInJvbGUiOiJzdHVkZW50Iiw
iaWF0IjoxNzQyOTE4MDk1LCJleHAiOjE3NDU1MTAwOTV9.BofayzB0I8rOSC92mOZcLcTzml1aYFVxmBVv1NpBECg" \
                     -d '{"classroomCode":"MATH102"}'

{"message":"You are succesfully enrolled.","className":"Math 101","subject":"Mathematics","description":"A beginner's course in math","teacher":"67e2cfce3f7c34d34092664b","topics":[]}
```

---

## classroom details (student)

```
curl -X GET http://localhost:7777/classroom/MATH102 \
                     -H "Content-Type: application/json" \
                     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJkMWFkM2Y3YzM0ZDM0MDkyNjY1NSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQyOTE4MDk1LCJleHAiOjE3NDU1MTAwOTV9.BofayzB0I8rOSC92mOZcLcTzml1aYFVxmBVv1NpBECg"

{"className":"Math 101","classJoinedDate":"2025-03-25T15:59:42.955Z","teacherName":"Anupam Jain","subject":"Mathematics","classDescription":"A beginner's course in math","assignments":[{"id":"67e2d4673f7c34d340926667","title":"Algebra","description":"class 10: get to know basics of algebra topics","creationDate":"2025-03-25T16:05:59.378Z","attemptedDate":null,"score":null}]}
```

---

## classroom assignment quiz (mcq) attempt (student)

- takes assignment id (can get from /assignment/:classcode)

```
curl -X POST "http://localhost:7777/assignment/attempt/67e2dad5bf5ff4652fddd3eb" \
                     -H "Content-Type: application/json" \
                     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJkMWFkM2Y3YzM0ZDM0MDkyNjY1NSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQyOTE4MDk1LCJleHAiOjE3NDU1MTAwOTV9.BofayzB0I8rOSC92mOZcLcTzml1aYFVxmBVv1NpBECg" \
                     -d '{
                   "answers": {
                     "0": "B",
                     "1": "A",
                     "2": "D",
                     "3": "B",
                     "4": "C",
                     "5": "A",
                     "6": "B",
                     "7": "C"
                   }
                 }'

{"message":"Quiz submitted successfully","score":6,"totalQuestions":8}
```

---

## learning assessment create (teacher)

```
curl -X POST http://localhost:7777/assessment/create \
                     -H "Content-Type: application/json" \
                     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJjZmNlM2Y3YzM0ZDM0MDkyNjY0YiIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzQyOTE3NjEyLCJleHAiOjE3NDU1MDk2MTJ9.8emLWvxQnrCVawFTsqECc9mureSD-0XCujFS54zouLY" \
                     -d '{
                   "classcode": "MATH102",
                   "title": "Linear Equations Basics",
                   "contentType": "text",
                   "contentUrlOrText": "To solve a linear equation like 2x + 3 = 7, subtract 3 from both sides, then divide by 2.",
                   "quizDescription": "Generate questions about the steps to solve linear equations."
                 }'

{"id":"67e3f4e323f94f8d80a1dd7e","title":"Linear Equations Basics","content":{"type":"text","urlOrText":"To solve a linear equation like 2x + 3 = 7, subtract 3 from both sides, then divide by 2."},"quiz":[{"question":"What is the first step in solving the equation 2x + 5 = 9?","options":{"A":"Divide both sides by 2","B":"Subtract 5 from both sides","C":"Add 5 to both sides","D":"Multiply both sides by 2"}},{"question":"After subtracting 7 from both sides of the equation x + 7 = 12, what equation remains?","options":{"A":"x = 5","B":"x = 19","C":"x = -5","D":"x = 7"}},{"question":"To solve the equation 3x = 15, what operation should be performed on both sides?","options":{"A":"Addition","B":"Subtraction","C":"Multiplication","D":"Division"}},{"question":"What is the solution to the equation 4x - 2 = 10?","options":{"A":"x = 2","B":"x = 3","C":"x = 4","D":"x = 8"}},{"question":"If you have the equation 5x + 10 = 35, what is the value of x after subtracting 10 from both sides?","options":{"A":"x = 5","B":"x = 25","C":"x = 45","D":"x = 50"}}]}
```

---

## learning assessment attempt (student)

```
curl -X POST "http://localhost:7777/assessment/attempt/67e3f4e323f94f8d80a1dd7e" \
                      -H "Content-Type: application/json" \
                      -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJkMWFkM2Y3YzM0ZDM0MDkyNjY1NSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQyOTkyNzIyLCJleHAiOjE3NDU1ODQ3MjJ9.CJ8o1Q3q2wAV2hQxq4iQIS1w-D8z9vPG_vPBhCQxqCw" \
                      -d '{
                    "answers": {
                      "0": "B",
                      "1": "A",
                      "2": "D",
                      "3": "B",
                      "4": "C",
                      "5": "A",
                      "6": "B",
                      "7": "C"
                    }
                  }'

{"assessmentId":"67e3f4e323f94f8d80a1dd7e","score":80,"submittedAt":"2025-03-26T12:51:51.284Z"}
```

---

## learning assessment fetch for classroom

```
curl -X GET http://localhost:7777/assessment/classroom/MATH102 \
                      -H "Content-Type: application/json" \
                      -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJkMWFkM2Y3YzM0ZDM0MDkyNjY1NSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQyOTkyNzIyLCJleHAiOjE3NDU1ODQ3MjJ9.CJ8o1Q3q2wAV2hQxq4iQIS1w-D8z9vPG_vPBhCQxqCw"

[{"_id":"67e3f4e323f94f8d80a1dd7e","classroom":"67e2d2ee3f7c34d340926661","title":"Linear Equations Basics","content":{"type":"text","urlOrText":"To solve a linear equation like 2x + 3 = 7, subtract 3 from both sides, then divide by 2."},"quiz":[{"question":"What is the first step in solving the equation 2x + 5 = 9?","options":{"A":"Divide both sides by 2","B":"Subtract 5 from both sides","C":"Add 5 to both sides","D":"Multiply both sides by 2"},"correctAnswer":"B","_id":"67e3f4e323f94f8d80a1dd7f"},{"question":"After subtracting 7 from both sides of the equation x + 7 = 12, what equation remains?","options":{"A":"x = 5","B":"x = 19","C":"x = -5","D":"x = 7"},"correctAnswer":"A","_id":"67e3f4e323f94f8d80a1dd80"},{"question":"To solve the equation 3x = 15, what operation should be performed on both sides?","options":{"A":"Addition","B":"Subtraction","C":"Multiplication","D":"Division"},"correctAnswer":"D","_id":"67e3f4e323f94f8d80a1dd81"},{"question":"What is the solution to the equation 4x - 2 = 10?","options":{"A":"x = 2","B":"x = 3","C":"x = 4","D":"x = 8"},"correctAnswer":"B","_id":"67e3f4e323f94f8d80a1dd82"},{"question":"If you have the equation 5x + 10 = 35, what is the value of x after subtracting 10 from both sides?","options":{"A":"x = 5","B":"x = 25","C":"x = 45","D":"x = 50"},"correctAnswer":"A","_id":"67e3f4e323f94f8d80a1dd83"}],"createdBy":{"_id":"67e2cfce3f7c34d34092664b","email":"ac@ac.com","name":"Anupam Jain"},"createdAt":"2025-03-26T12:36:51.362Z","__v":0}]
```

---
