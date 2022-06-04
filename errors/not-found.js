class NotFoundError extends Error {
  constructor(message) {
    super(`${message} not founded!`);
  }
}

export default NotFoundError;