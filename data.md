```javascript
const allQuizData = {
    quizId: 1,
    name: quizOne,
    timeCreated: 1249,
    timeLastEdited: 1250,
    description: "This is my first quiz, yippee!",
}

const userData = {
    email: bob@gmail.com,
    password: bobIsVeryAwesome,
    name: bob Bob,
    authUserId: 000001,
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
    Quizzes: { allQuizData }
}
```

[Optional] short description: "allQuizData" stores all info about every quiz owned
by one specific person, whilst "userData" stores all info about a specific user.
