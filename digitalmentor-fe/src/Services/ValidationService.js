const ValidationService = {
  // Email validation
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Password validation (at least 8 characters, one uppercase, one lowercase, one number, and one special character)
  validatePassword: (password) => {
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const simplePassowrdReges =  /^.{4,}$/;
    return simplePassowrdReges.test(password);
  },

  // Phone number validation (supports international formats)
  validatePhoneNumber: (phoneNumber) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format (international)
    return phoneRegex.test(phoneNumber);
  },

  // Username validation (alphanumeric, 3-20 characters)
  validateUsername: (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  },

  // URL validation
  validateURL: (url) => {
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlRegex.test(url);
  },

  // Credit card validation (Luhn Algorithm)
  validateCreditCard: (cardNumber) => {
    const cardNumberRegex = /^\d{13,19}$/;
    if (!cardNumberRegex.test(cardNumber)) return false;

    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

};

export default ValidationService;