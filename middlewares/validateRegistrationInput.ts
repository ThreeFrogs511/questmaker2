export default function validateRegistrationInput(
  email: string,
  password: string,
  confirm: string,
) {

  const emailRegex = 
  /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~€£¥§°])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~€£¥§°]{12,}$/;

  if (!email || !password || !confirm) return {inputValid:false, err:"All fields required"};
  if (!emailRegex.test(email)) return {inputValid:false,err:"Invalid email"};
  if (password !== confirm) return {inputValid:false,err:"Password mismatch"};
  if (!passwordRegex.test(password)) return {inputValid:false,err:"Invalid password: at least 12+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character."};

  return {inputValid: true}
}
