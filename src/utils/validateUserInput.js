
function validateInput(input) {
    /**
     * Tests a user input for potentially malicious contents to prevent a stored XSS attack.
     * Source: https://chatgpt.com/share/680f954a-41b8-8011-b2ff-a600becfa29f
     *
     * @param {String} input - The user input from a request
     * @returns {Boolean} True, if the input is valid, falso otherwise
     */
    const regex = /^[a-zA-Z0-9\s\-_,.()%]+$/;
    return regex.test(input);
}

module.exports = {validateInput}