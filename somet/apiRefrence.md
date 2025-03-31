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

[{"className":"Math 101","subject":"Mathematics","classCode":"MATH102","studentCount":1,"topicCount":0,"learningAssessmentStatus":"Available","recentTopics":[],"assignments":[{"id":"67e2dad5bf5ff4652fddd3eb","title":"Algebra","type":"quiz","dueDate":"2025-03-26T23:59:59.999Z"},{"id":"67e55903d26a8da6e3e41a28","title":"Calculus","type":"quiz","dueDate":"2025-03-28T23:59:59.999Z"}],"assessments":[{"id":"67e3f4e323f94f8d80a1dd7e","title":"Linear Equations Basics"},{"id":"67e562243ffd90db6e09b146","title":"Introduction to Calculus"}],"overallFeedback":{"feedback":"The class shows a mixed performance. While demonstrating a reasonable grasp of core concepts as evidenced by the relatively high MCQ scores (average assessment score suggests a good understanding of the material), significant weaknesses are apparent in the written assignments.  Students struggle to provide comprehensive and well-explained answers, frequently offering incomplete or superficial responses.  The feedback consistently highlights a lack of detail, insufficient explanation, and the absence of crucial examples to support their claims.  This suggests a need for more emphasis on critical thinking, problem-solving, and the application of theoretical knowledge to practical examples.  While the students can often identify the correct answer or concept, they lack the ability to articulate their understanding thoroughly and demonstrate a deeper level of comprehension. Therefore, future instruction should focus on improving written communication skills, problem-solving abilities, and providing more opportunities for in-depth exploration of concepts through detailed examples and applications.","summary":"Mixed performance; strong MCQ scores but weak written explanations. Focus needed on detailed explanations and application of concepts.","generatedAt":"2025-03-27T17:34:44.078Z"}}]
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

## classroom assignment quiz create (teacher)

```
curl -X POST http://localhost:7777/assignment/MATH102/quiz \
                                          -H "Content-Type: application/json" \
                                          -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJjZmNlM2Y3YzM0ZDM0MDkyNjY0YiIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzQyOTE3NjEyLCJleHAiOjE3NDU1MDk2MTJ9.8emLWvxQnrCVawFTsqECc9mureSD-0XCujFS54zouLY" \
                                          -d '{"title": "Calculus", "description": "class 12: get to know basics of Calculus topics"}'

{"id":"67e553b954bf19a0521869fc","title":"Calculus","description":"class 12: get to know basics of Calculus topics","type":"quiz","quizContent":[{"type":"mcq","question":"What is the derivative of f(x) = x³?","options":{"A":"x²","B":"3x²","C":"3x","D":"x⁴"}},{"type":"mcq","question":"Find the limit as x approaches 2 of (x² - 4) / (x - 2).","options":{"A":"0","B":"4","C":"undefined","D":"2"}},{"type":"mcq","question":"∫ 2x dx = ?","options":{"A":"2x² + C","B":"x² + C","C":"4x + C","D":"x + C"}},{"type":"mcq","question":"What is the slope of the tangent line to the curve y = x² at x = 1?","options":{"A":"0","B":"1","C":"2","D":"4"}},{"type":"writing","question":"Explain the difference between differentiation and integration in calculus.","options":{}},{"type":"writing","question":"Describe the concept of a limit in calculus and provide a simple example.","options":{}},{"type":"writing","question":"Explain how to find the critical points of a function and what their significance is.","options":{}},{"type":"writing","question":"Describe the relationship between the derivative of a function and its slope at a point.","options":{}}],"dueDate":"2025-03-28T23:59:59.999Z"}
```

---

## get all classroom assignments (teacher & student)

```
curl -X GET http://localhost:7777/assignment/MATH102 \
                     -H "Content-Type: application/json" \
                     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJjZmNlM2Y3YzM0ZDM0MDkyNjY0YiIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzQyOTE3NjEyLCJleHAiOjE3NDU1MDk2MTJ9.8emLWvxQnrCVawFTsqECc9mureSD-0XCujFS54zouLY"

[{"_id":"67e55903d26a8da6e3e41a28","classroom":"67e2d2ee3f7c34d340926661","title":"Calculus","description":"class 12: get to know basics of Calculus topics","type":"quiz","createdBy":"67e2cfce3f7c34d34092664b","dueDate":"2025-03-28T23:59:59.999Z","quizContent":[{"type":"mcq","question":"Find the derivative of f(x) = 3x² + 2x - 1.","options":{"A":"6x + 2","B":"3x + 2","C":"6x² + 2","D":"9x + 2"},"_id":"67e55903d26a8da6e3e41a29"},{"type":"mcq","question":"What is the integral of 4x³ dx?","options":{"A":"x⁴ + C","B":"12x² + C","C":"x³ + C","D":"4x⁴ + C"},"_id":"67e55903d26a8da6e3e41a2a"},{"type":"mcq","question":"What is the limit of (x² - 1) / (x - 1) as x approaches 1?","options":{"A":"0","B":"1","C":"2","D":"undefined"},"_id":"67e55903d26a8da6e3e41a2b"},{"type":"mcq","question":"If f'(x) represents the derivative of f(x), what does f''(x) represent?","options":{"A":"The slope of f(x)","B":"The area under f(x)","C":"The second derivative of f(x)","D":"The integral of f(x)"},"_id":"67e55903d26a8da6e3e41a2c"},{"type":"writing","question":"Explain the difference between a derivative and an integral in the context of calculus.","_id":"67e55903d26a8da6e3e41a2d"},{"type":"writing","question":"Describe a real-world application where derivatives are used.","_id":"67e55903d26a8da6e3e41a2e"},{"type":"writing","question":"Explain the concept of a limit in calculus and provide a simple example.","_id":"67e55903d26a8da6e3e41a2f"},{"type":"writing","question":"What is the power rule for differentiation, and how is it applied?","_id":"67e55903d26a8da6e3e41a30"}],"createdAt":"2025-03-27T13:56:19.051Z","__v":0}]
```

---

## student dashboard

```
curl -X GET http://localhost:7777/student-dashboard \
                                          -H "Content-Type: application/json" \
                                          -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJkMWFkM2Y3YzM0ZDM0MDkyNjY1NSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQyOTE4MDk1LCJleHAiOjE3NDU1MTAwOTV9.BofayzB0I8rOSC92mOZcLcTzml1aYFVxmBVv1NpBECg"

{"classrooms":[{"className":"Math 101","subject":"Mathematics","description":"A beginner's course in math","teacher":{"name":"Anupam Jain","email":"ac@ac.com"},"topics":[],"assignments":[{"id":"67e2dad5bf5ff4652fddd3eb","title":"Algebra","type":"quiz","dueDate":"2025-03-26T23:59:59.999Z"},{"id":"67e55903d26a8da6e3e41a28","title":"Calculus","type":"quiz","dueDate":"2025-03-28T23:59:59.999Z"}],"assessments":[{"id":"67e3f4e323f94f8d80a1dd7e","title":"Linear Equations Basics","attempted":true},{"id":"67e562243ffd90db6e09b146","title":"Introduction to Calculus","attempted":true}]}],"feedback":{"detailed":"Your performance on the assessments shows a mixed understanding of calculus concepts.  While you correctly answered several multiple-choice questions, demonstrating a grasp of fundamental definitions and rules (like the power rule), your written responses consistently fall short in terms of depth and explanation.  Specifically, questions 4, 5, and 6 in the assignment demonstrate a significant lack of understanding of key concepts (derivatives, integrals, and limits).  Even when you correctly identified concepts in other questions (e.g., the Fundamental Theorem of Calculus), your explanations lacked sufficient detail and supporting examples.  You need to improve your ability to not only state definitions but also to explain *how* concepts work, providing illustrative examples and addressing nuances of the topic. For example, your understanding of limits would be improved by considering cases where the limit exists but the function is undefined at that point, or where the limit does not exist.  Similarly, fully explaining the inverse relationship between derivatives and integrals requires demonstrating this relationship through examples such as finding the derivative of an integral or vice versa.  Focus on providing more comprehensive and detailed answers in future assessments.  Paying close attention to the feedback provided on each question will help you identify areas requiring further study.","summary":"Inconsistent performance. Shows basic understanding but needs significant improvement in explaining concepts and providing detailed, illustrative examples.  More thorough preparation and attention to detail is required.","generatedAt":"2025-03-27T17:16:49.580Z"}}
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

## classroom assignment quiz attempt (student)

- takes assignment id (can get from /assignment/:classcode)

```
curl -X POST "http://localhost:7777/assignment/attempt/67e55903d26a8da6e3e41a28" \
                          -H "Content-Type: application/json" \
                          -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJkMWFkM2Y3YzM0ZDM0MDkyNjY1NSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQyOTE4MDk1LCJleHAiOjE3NDU1MTAwOTV9.BofayzB0I8rOSC92mOZcLcTzml1aYFVxmBVv1NpBECg" \
                          -d '{
                        "answers": {
                          "0": "A",
                          "1": "D",
                          "2": "C",
                          "3": "B",
                          "4": "A",
                          "5": "Wrong approach",
                          "6": "A limit is the value a function approaches as x approaches a point.",
                          "7": "The power rule states d/dx [x^n] = nx^(n-1). Used in differentiating polynomials."
                        }
                      }'

{"message":"Quiz submitted successfully","score":41.25,"totalScorePossible":80,"responses":[{"questionIndex":0,"answer":"A","feedback":"Correct answer."},{"questionIndex":1,"answer":"D","feedback":"Incorrect. The correct answer is A."},{"questionIndex":2,"answer":"C","feedback":"Correct answer."},{"questionIndex":3,"answer":"B","feedback":"Incorrect. The correct answer is C."},{"questionIndex":4,"answer":"A","feedback":"The response is completely inadequate.  The student provided only a single letter, offering no explanation of derivatives or integrals.  It demonstrates a complete lack of understanding of the concepts."},{"questionIndex":5,"answer":"Wrong approach","feedback":"The student response 'Wrong approach' provides no information about a real-world application of derivatives.  It demonstrates a complete lack of understanding of the question and the topic."},{"questionIndex":6,"answer":"A limit is the value a function approaches as x approaches a point.","feedback":"The response correctly defines the basic concept of a limit. However, it's too brief and lacks crucial details.  It doesn't address the possibility of the limit not existing or being different from the function's value at the point. A simple example is missing, which was explicitly requested in the question. While the core idea is present, the lack of depth and the missing example significantly detract from the response."},{"questionIndex":7,"answer":"The power rule states d/dx [x^n] = nx^(n-1). Used in differentiating polynomials.","feedback":"The response correctly states the power rule. However, it lacks explanation of how 'n' is restricted (it should mention that n is a real number) and doesn't provide examples of its application beyond mentioning polynomials.  A more complete answer would demonstrate the application with at least one specific example, showing the steps involved in differentiating a simple polynomial term using the power rule."}]}
```

---

## learning assessment create (teacher)

```
curl -X POST http://localhost:7777/assessment/create \
                          -H "Content-Type: application/json" \
                          -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJjZmNlM2Y3YzM0ZDM0MDkyNjY0YiIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzQyOTE3NjEyLCJleHAiOjE3NDU1MDk2MTJ9.8emLWvxQnrCVawFTsqECc9mureSD-0XCujFS54zouLY" \
                          -d '{
                        "classcode": "MATH102",
                        "title": "Introduction to Calculus",
                        
                        "videolink": "https://www.youtube.com/watch?v=5vVbG9YPZOc",
                        "videodescription": "The video explains the basics of calculus, covering limits, differentiation, and integration. Generate questions that test students on these concepts, including definitions, problem-solving, and real-world applications.",
                        "audiolink": "https://www.youtube.com/watch?v=5vVbG9YPZOc",
                        "audiodescription": "The video explains the basics of calculus, covering limits, differentiation, and integration. Generate questions that test students on these concepts, including definitions, problem-solving, and real-world applications.",
                        "textlink": "https://www.youtube.com/watch?v=5vVbG9YPZOc",
                        "textdescription": "The video explains the basics of calculus, covering limits, differentiation, and integration. Generate questions that test students on these concepts, including definitions, problem-solving, and real-world applications."
                      }'

{"id":"67e562243ffd90db6e09b146","title":"Introduction to Calculus","content":{"type":"video","urlOrText":"https://www.youtube.com/watch?v=5vVbG9YPZOc"},"quiz":[{"type":"mcq","question":"What does the limit of a function represent?","options":{"A":"The average rate of change of the function","B":"The instantaneous rate of change of the function","C":"The value the function approaches as the input approaches a specific value","D":"The area under the curve of the function"}},{"type":"mcq","question":"Differentiation is primarily used to find:","options":{"A":"The area under a curve","B":"The slope of a tangent line to a curve","C":"The accumulation of a quantity over time","D":"The limit of a function"}},{"type":"mcq","question":"Which of the following is a real-world application of integration?","options":{"A":"Finding the velocity of an object given its acceleration","B":"Determining the slope of a curve at a specific point","C":"Calculating the total distance traveled by a moving object given its velocity","D":"Predicting the future value of an investment"}},{"type":"writing","question":"Explain the relationship between differentiation and integration.  How are they inverse operations?","options":{}},{"type":"writing","question":"Give a real-world example (different from those in the video) where understanding limits could be helpful in solving a problem.","options":{}}]}
```

---

## learning assessment attempt (student)

```
curl -X POST "http://localhost:7777/assessment/attempt/67e562243ffd90db6e09b146" \
                          -H "Content-Type: application/json" \
                          -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJkMWFkM2Y3YzM0ZDM0MDkyNjY1NSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQyOTkyNzIyLCJleHAiOjE3NDU1ODQ3MjJ9.CJ8o1Q3q2wAV2hQxq4iQIS1w-D8z9vPG_vPBhCQxqCw" \
                          -d '{
                        "answers": {
                          "0": "C",
                          "1": "A",
                          "2": "C",
                          "3": "The Fundamental Theorem of Calculus states that differentiation and integration are inverse operations. Differentiation finds the rate of change, while integration accumulates values over an interval.",
                          "4": "In manufacturing, understanding limits helps ensure machine tolerances. If a part\'s dimension approaches a limit, adjustments are needed to maintain precision."
                        }
                      }'

{"assessmentId":"67e562243ffd90db6e09b146","score":66,"totalScorePossible":50,"responses":[{"questionIndex":0,"answer":"C","feedback":"Correct answer."},{"questionIndex":1,"answer":"A","feedback":"Incorrect. The correct answer is B."},{"questionIndex":2,"answer":"C","feedback":"Correct answer."},{"questionIndex":3,"answer":"The Fundamental Theorem of Calculus states that differentiation and integration are inverse operations. Differentiation finds the rate of change, while integration accumulates values over an interval.","feedback":"The response correctly identifies the Fundamental Theorem of Calculus as the key to understanding the inverse relationship between differentiation and integration, and gives accurate, albeit brief, definitions of each operation. However, it lacks a crucial explanation of *how* they are inverse operations.  The student merely states they are, without demonstrating it through an example or further elaboration (e.g., the derivative of an integral, or vice-versa).  More detail is needed to fully explain the inverse relationship."},{"questionIndex":4,"answer":"In manufacturing, understanding limits helps ensure machine tolerances. If a part's dimension approaches a limit, adjustments are needed to maintain precision.","feedback":"The response correctly identifies a real-world application of understanding limits in manufacturing.  However, it's somewhat brief and lacks specific examples of the types of limits involved (e.g., upper and lower bounds on dimensions) or how the adjustments are made.  More detail on the problem-solving aspect would improve the response."}],"submittedAt":"2025-03-27T14:38:21.928Z"}
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

## generate classroom feedback (teacher)

```
curl -X POST http://localhost:7777/classroom/MATH102/feedback \
                     -H "Content-Type: application/json" \
                     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJjZmNlM2Y3YzM0ZDM0MDkyNjY0YiIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzQyOTE3NjEyLCJleHAiOjE3NDU1MDk2MTJ9.8emLWvxQnrCVawFTsqECc9mureSD-0XCujFS54zouLY"

{"feedback":"The class shows a mixed performance. While demonstrating a reasonable grasp of core concepts as evidenced by the relatively high MCQ scores (average assessment score suggests a good understanding of the material), significant weaknesses are apparent in the written assignments.  Students struggle to provide comprehensive and well-explained answers, frequently offering incomplete or superficial responses.  The feedback consistently highlights a lack of detail, insufficient explanation, and the absence of crucial examples to support their claims.  This suggests a need for more emphasis on critical thinking, problem-solving, and the application of theoretical knowledge to practical examples.  While the students can often identify the correct answer or concept, they lack the ability to articulate their understanding thoroughly and demonstrate a deeper level of comprehension. Therefore, future instruction should focus on improving written communication skills, problem-solving abilities, and providing more opportunities for in-depth exploration of concepts through detailed examples and applications.","summary":"Mixed performance; strong MCQ scores but weak written explanations. Focus needed on detailed explanations and application of concepts.","generatedAt":"2025-03-27T17:34:44.078Z"}
```

---
