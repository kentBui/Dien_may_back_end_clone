module.exports.errorApp = (res, statusCode, message, error) => {
  return res.status(statusCode).json({
    status: "error",
    message,
    error,
  });
};
