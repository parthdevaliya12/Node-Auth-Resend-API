const verifyEmailTemplate = ({ name, url }) => {
  return `<h1>${name}, Welcome to E-commerce</h1><p>Thank you for registering with us. We are excited to have you on board!</p><p>Please click the link below to verify your email address:</p><a href="${url}">Verify Email</a><p>Best regards,<br/>E-commerce Team</p>`;
};
export default verifyEmailTemplate;
