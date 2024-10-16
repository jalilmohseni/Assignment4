const greetings = ['Hello!', 'Welcome!', 'Greetings!', 'Hi there!', 'Good day!'];

function getRandomGreeting() {
    return greetings[Math.floor(Math.random() * greetings.length)];
}

module.exports = getRandomGreeting;
