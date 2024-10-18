const greetings = ['Hey, sunshine!','Hello!', 'Welcome!', 'Greetings!', 'Hi there!', 'Good day!','Rise and shine!','What a lovely day!'];

function getRandomGreeting() {
    return greetings[Math.floor(Math.random() * greetings.length)];
}

module.exports = getRandomGreeting;
