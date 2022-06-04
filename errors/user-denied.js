export default class UserDeniedError extends Error {
  constructor(status) {
    if (status === 'blocked') {
      super(`User blocked. Contact the administrator.`);
    } else if (status === 'inactive') {
      super(`Your account wasn't activated yet. Check your email.`);  
    } else {
      super(`User access denied. Contact the administrator.`);
    }
  }
}