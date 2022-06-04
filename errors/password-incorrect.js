class PasswordIncorrectError extends Error {
  constructor(message) {
    super(message ? message : 'Email or password incorrect.');
  }
}

export default PasswordIncorrectError;