function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (!emailRegex.test(email)) {
    return false;
  }
  return true;
}

function validatePassword(password) {
  if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return false;
  }
  return true;
}

export {
    validateEmail,
    validatePassword
}