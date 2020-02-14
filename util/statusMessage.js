module.exports = (message, statusText, statusCode) => ({
    status: [statusCode || 200, statusText || "success"], message: message || "Request Successful"
})