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
                   "title": "Multimedia Math Assessment",
                   "videolink": "https://example.com/video.mp4",
                   "audiolink": "https://example.com/audio.mp3",
                   "textlink": "https://example.com/text.pdf",
                   "videodescription": "Video explaining linear equations",
                   "audiodescription": "Audio lecture on solving equations",
                   "textdescription": "Text document on algebraic methods"
                 }'

{"id":"67eaad0bb96326fe93a17cac","title":"Multimedia Math Assessment","videoContent":{"link":"https://example.com/video.mp4","description":"Video explaining linear equations"},"audioContent":{"link":"https://example.com/audio.mp3","description":"Audio lecture on solving equations"},"textContent":{"link":"https://example.com/text.pdf","description":"Text document on algebraic methods"},"videoQuiz":[{"type":"mcq","question":"What is the slope of the line represented by the equation y = 2x + 3?","options":{"A":"3","B":"2","C":"-3","D":"-2"}},{"type":"mcq","question":"Which of the following equations represents a horizontal line?","options":{"A":"x = 5","B":"y = 5","C":"y = x + 5","D":"x + y = 5"}},{"type":"writing","question":"Describe the process of finding the x-intercept of a linear equation. Provide a simple example.","options":{}},{"type":"writing","question":"Explain how the slope and y-intercept of a linear equation can be used to graph the equation.  Give an example.","options":{}}],"audioQuiz":[{"type":"mcq","question":"What is the first step typically recommended when solving a linear equation?","options":{"A":"Subtract the constant from both sides","B":"Divide both sides by the coefficient of x","C":"Simplify both sides of the equation","D":"Add the variable terms together"}},{"type":"mcq","question":"Which of the following is NOT a valid method for solving equations?","options":{"A":"Adding the same value to both sides","B":"Subtracting the same value from both sides","C":"Multiplying both sides by zero","D":"Dividing both sides by the same non-zero value"}},{"type":"writing","question":"Describe the process of solving a simple two-step equation, providing an example.","options":{}},{"type":"writing","question":"Explain how to check your solution after solving an equation. Why is this important?","options":{}}],"textQuiz":[{"type":"mcq","question":"Which algebraic method is primarily discussed in the text?","options":{"A":"Quadratic Formula","B":"Gaussian Elimination","C":"Newton-Raphson Method","D":"Linear Programming"}},{"type":"mcq","question":"What is a key application of the algebraic method described in the text?","options":{"A":"Solving systems of differential equations","B":"Analyzing statistical data","C":"Solving quadratic equations","D":"Modeling biological processes"}},{"type":"writing","question":"Describe the steps involved in applying the main algebraic method discussed in the text.","options":{}},{"type":"writing","question":"Explain how the concepts in the text could be applied to a real-world problem.","options":{}}]}
```

---

## learning assessment attempt (student)

```
curl -X POST http://localhost:7777/assessment/submit/67eaad0bb96326fe93a17cac \
                     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJkMWFkM2Y3YzM0ZDM0MDkyNjY1NSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQzNDMzMTg1LCJleHAiOjE3NDYwMjUxODV9.hNA7htCI5AlHKB8qm3TK9arQW3sRACjnvD1viUKnDtA" \
                     -H "Content-Type: application/json" \
                     -d '{
                   "quizType": "video",
                   "answers": {
                     "0": "B",
                     "1": "B",
                     "2": "To find the x-intercept, set y = 0 and solve for x. For example, in y = 2x + 3, 0 = 2x + 3, 2x = -3, x = -1.5.",
                     "3": "The slope (m) shows the steepness, and the y-intercept (b) is where the line crosses the y-axis. For y = 2x + 3, slope is 2, y-intercept is 3. Plot (0, 3), then use slope to find (1, 5) and draw the line."
                   }
                 }'

{"assessmentId":"67eaad0bb96326fe93a17cac","quizType":"video","score":90,"totalScorePossible":40,"responses":[{"questionIndex":0,"answer":"B","feedback":"Correct answer."},{"questionIndex":1,"answer":"B","feedback":"Correct answer."},{"questionIndex":2,"answer":"To find the x-intercept, set y = 0 and solve for x. For example, in y = 2x + 3, 0 = 2x + 3, 2x = -3, x = -1.5.","feedback":"The response accurately describes the process of finding the x-intercept and provides a correct and clear example.  It could be slightly improved by explicitly stating that the x-intercept is the point where the line crosses the x-axis (although this is implied).  The brevity is a strength, as it directly addresses the prompt's request for a simple explanation and example."},{"questionIndex":3,"answer":"The slope (m) shows the steepness, and the y-intercept (b) is where the line crosses the y-axis. For y = 2x + 3, slope is 2, y-intercept is 3. Plot (0, 3), then use slope to find (1, 5) and draw the line.","feedback":"The response correctly identifies the roles of slope and y-intercept in graphing a linear equation and provides a valid example. However, it lacks a thorough explanation of *how* the slope is used to find the second point (1,5).  Saying 'use slope to find (1,5)' is insufficient; it should explain that the slope of 2 means a rise of 2 and a run of 1 from the y-intercept.  More detail on the process would improve the score."}],"overallScore":"30.00","studentFeedback":{"detailed":"Your performance on this assignment demonstrates a mixed understanding of the material.  You correctly answered questions 0 and 2, showcasing a grasp of the underlying concepts in those specific instances. However, you missed questions 1 and 3, indicating a need for further review of those particular topics.  More significantly, your responses to questions 4, 5, and 6 reveal a substantial gap in your understanding of key concepts: derivatives and integrals (question 4), real-world applications of derivatives (question 5), and limits (question 6).  These responses were deemed completely inadequate due to a lack of explanation and crucial detail.  While you correctly stated the power rule in question 7, your explanation lacked depth and detail regarding its application to polynomials and the restrictions on 'n'.  To improve your grade, focus on a deeper understanding of the core concepts, providing thorough explanations and examples in your responses.  Practice applying the concepts to various scenarios to solidify your comprehension.  Pay special attention to the feedback provided for questions 4, 5, and 6, as these areas require significant improvement.","summary":"Inconsistent understanding.  Strong in some areas but needs significant improvement in core concepts (derivatives, integrals, limits, application of concepts). Provide more detail and examples in future responses.","generatedAt":"2025-03-31T15:01:10.760Z"},"submittedAt":"2025-03-31T15:01:10.798Z"}
```

```
curl -X POST http://localhost:7777/assessment/submit/67eaad0bb96326fe93a17cac \
                     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJkMWFkM2Y3YzM0ZDM0MDkyNjY1NSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQzNDMzMTg1LCJleHAiOjE3NDYwMjUxODV9.hNA7htCI5AlHKB8qm3TK9arQW3sRACjnvD1viUKnDtA" \
                     -H "Content-Type: application/json" \
                     -d '{
                   "quizType": "audio",
                   "answers": {
                     "0": "C",
                     "1": "C",
                     "2": "For 2x + 3 = 7, subtract 3 from both sides to get 2x = 4, then divide by 2, so x = 2.",
                     "3": "Substitute x back into the original equation. For 2x + 3 = 7, if x = 2, then 2(2) + 3 = 7, which is true. This ensures accuracy."
                   }
                 }'

{"assessmentId":"67eaad0bb96326fe93a17cac","quizType":"audio","score":82.5,"totalScorePossible":40,"responses":[{"questionIndex":0,"answer":"C","feedback":"Correct answer."},{"questionIndex":1,"answer":"C","feedback":"Correct answer."},{"questionIndex":2,"answer":"For 2x + 3 = 7, subtract 3 from both sides to get 2x = 4, then divide by 2, so x = 2.","feedback":"The student correctly solves the equation and shows the steps. However, the response lacks a description of the *process*.  It only shows the process by example, without explaining the general steps involved in solving two-step equations (e.g., isolating the variable term, then isolating the variable).  A more complete answer would describe the general strategy before applying it to a specific example."},{"questionIndex":3,"answer":"Substitute x back into the original equation. For 2x + 3 = 7, if x = 2, then 2(2) + 3 = 7, which is true. This ensures accuracy.","feedback":"The student correctly explains the substitution method for checking solutions.  The example is clear and accurate. However, the explanation of *why* this is important is too brief.  A more thorough response would discuss the potential for errors in solving equations and how verification ensures accuracy and builds confidence in the solution.  The response only mentions 'ensures accuracy' without elaborating on the significance of this in mathematics."}],"overallScore":27.5,"studentFeedback":{"detailed":"The student shows inconsistent understanding, excelling in some multiple-choice questions but struggling with conceptual explanations and detailed justifications.  Performance in written assignments reveals significant gaps in understanding of fundamental concepts (derivatives, integrals, limits).  While some audio responses are correct, they often lack depth and fail to fully explain underlying processes.  Improved conceptual understanding and more detailed explanations, both written and verbal, are required.","summary":"Inconsistent understanding; needs improved conceptual understanding and detailed explanations.","generatedAt":"2025-03-31T15:02:11.736Z"},"submittedAt":"2025-03-31T15:02:11.749Z"}
```

```
curl -X POST http://localhost:7777/assessment/submit/67eaad0bb96326fe93a17cac \
                     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJkMWFkM2Y3YzM0ZDM0MDkyNjY1NSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQzNDMzMTg1LCJleHAiOjE3NDYwMjUxODV9.hNA7htCI5AlHKB8qm3TK9arQW3sRACjnvD1viUKnDtA" \
                     -H "Content-Type: application/json" \
                     -d '{
                   "quizType": "text",
                   "answers": {
                     "0": "B",
                     "1": "C",
                     "2": "Gaussian Elimination involves writing equations in matrix form, using row operations to reduce to row-echelon form, then solving for variables.",
                     "3": "In budgeting, Gaussian Elimination can solve a system of equations to allocate resources efficiently, like determining costs for multiple projects."
                   }
                 }'

{"assessmentId":"67eaad0bb96326fe93a17cac","quizType":"text","score":55.00000000000001,"totalScorePossible":40,"responses":[{"questionIndex":0,"answer":"B","feedback":"Incorrect. The correct answer is A."},{"questionIndex":1,"answer":"C","feedback":"Correct answer."},{"questionIndex":2,"answer":"Gaussian Elimination involves writing equations in matrix form, using row operations to reduce to row-echelon form, then solving for variables.","feedback":"The response correctly identifies the main steps of Gaussian elimination: matrix representation, row reduction to row-echelon form, and back-substitution (implied in 'solving for variables'). However, it lacks crucial detail.  It doesn't explain what constitutes 'row operations' (e.g., swapping rows, multiplying rows by constants, adding multiples of rows), nor does it describe how to actually solve for the variables once in row-echelon form.  More detail and precision would significantly improve the response."},{"questionIndex":3,"answer":"In budgeting, Gaussian Elimination can solve a system of equations to allocate resources efficiently, like determining costs for multiple projects.","feedback":"The response correctly identifies a real-world application (budgeting) and connects it to a relevant mathematical concept (Gaussian Elimination). However, it lacks depth.  The explanation is very brief and doesn't fully explain *how* Gaussian Elimination solves the system of equations or the specifics of resource allocation.  More detail on the process and the nature of the equations would significantly improve the response."}],"overallScore":45.83,"studentFeedback":{"detailed":"The student demonstrates inconsistent performance. Strong in some multiple-choice questions, but consistently lacks depth and detail in written explanations across assignment and assessment questions, particularly regarding application and process explanation. Significant improvement needed in providing comprehensive and well-reasoned answers.","summary":"Inconsistent performance; needs improvement in written explanation and demonstrating a deeper understanding of concepts.","generatedAt":"2025-03-31T15:02:43.611Z"},"submittedAt":"2025-03-31T15:02:43.626Z"}
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
