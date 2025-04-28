
function validateInput(input) {
    /**
     * Tests a user input for potentially malicious contents to prevent a stored XSS attack.
     *
     * @param {String} input - The user input from a request
     * @returns {Boolean} True, if the input is valid, falso otherwise
     */
    const regex = /^[A-Za-z0-9\s!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~]*$/;
    return regex.test(input);
}

module.exports = {validateInput}