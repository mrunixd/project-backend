```javascript
//Refer to description at bottom
const dataStore: {
    userData: [
        {
            email: "name@gmail.com",
            password: "realPassword",
            name: "First Last",
            authUserId: 000001,
            numSuccessfulLogins: 1,
            numFailedPasswordsSinceLastLogin: 0,
            QuizIds: [ 1 ],
        }
    ]
    QuizData: [
        {
            quizId: 1,
            name: "quizOne",
            timeCreated: 1249,
            timeLastEdited: 1250,
            description: "This is my first quiz, yippee!",
        }
    ]
}
```

[Optional] short description: "dataStore" stores all userData[] and also
QuizData[], where both arrays store the list of all users and quizzes respectively.
Users can access their relevant quizzes through the "QuizIds" property which contains
all of their own quizIds.
