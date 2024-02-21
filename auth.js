//create an array to store user data
const users = [];

// Function to create a new user and add it to the users array
function createUser(username, password) {
    users.push({ username, password });
    console.log(users);
}

// Function to authenticate a user based on the provided username and password
function authenticateUser(username, password) {
    // Find the user with the given username in the users array
    const user = users.find(user => user.username === username.toLowerCase());
    if (!user || user.password !== password.toLowerCase()) {
        return false;
    }
    return true;
}

// Export the createUser and authenticateUser functions to be used by other modules
module.exports = { createUser, authenticateUser };