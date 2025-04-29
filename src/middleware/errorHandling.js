
// Source: https://chatgpt.com/share/6810e544-5c34-8011-a018-dfbf55c6b6e9
function catchAsync(asyncFunction) {
    return (req, res, next) => {
        asyncFunction(req, res, next).catch((err) => {
            // When an error occurs, pass it to the global error handler
            next(err);
        });
    };
}
module.exports = {catchAsync}