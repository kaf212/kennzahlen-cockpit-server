
function catchAsync(asyncFunction) {
    /**
     * This middleware function catches any uncaught errors in the API endpoints it's used in.
     * It takes the provided endpoint function, wraps it in a try/catch statement with .catch that calls
     * the global error handler with next(err) if an error is caught, and returns it back.
     *
     * @param {Function} asyncFunction - The asynchronous endpoint function which is to be called
     * @returns {Function} The endpoint function wrapped in a try/catch
     */
    // Source: https://chatgpt.com/share/6810e544-5c34-8011-a018-dfbf55c6b6e9
    return (req, res, next) => {
        asyncFunction(req, res, next).catch((err) => {
            // When an error occurs, pass it to the global error handler
            next(err);
        });
    };
}

module.exports = {catchAsync}