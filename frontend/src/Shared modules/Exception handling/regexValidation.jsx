// Validation for email
export const emailvalidator = (email) => {
  const regexemail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  return regexemail.test(email);
};

// Validation for Password
export const passwordvalidator = (password) => {
  const regexpassword =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
  return regexpassword.test(password);
};

// Validation for Confirm Password
export const Confirm_passwordvalidator = (confirm_password) => {
  const regexpassword = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,16}$/;
  return regexpassword.test(confirm_password);
};

// us mobile number validation
export const UsPhoneNumberValidator = (phone_number) => {
  const regexphonenumber = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  return regexphonenumber.test(phone_number);
};

//namevalidator
export const NameValidator = (input) => {
  const regex = /^\D*$/;
  return regex.test(input);
};

//US Zipcode Validation
export const ZipcodeValidator = (zipcode) => {
  const ZipcodeValidator = /^\d{5}(?:-\d{4})?$/;
  return ZipcodeValidator.test(zipcode);
};
