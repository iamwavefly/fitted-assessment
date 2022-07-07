const errorHandler = (error) => {
  let message = {};
  if (error.name === "ValidationError") {
    Object.keys(error.errors).forEach((key) => {
      message[key] = error.errors[key].message;
    });
    return message;
  }
  message = "Something went wrong";
  return message;
};

module.exports = errorHandler;
