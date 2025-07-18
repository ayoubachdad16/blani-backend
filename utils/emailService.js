const SibApiV3Sdk = require('sib-api-v3-sdk');

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const sendVerificationEmail = async (toEmail, toName, token) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = {
    to: [{ email: toEmail, name: toName }],
    sender: { email: 'ayoubachdad16@gmail.com', name: 'Blani' },
    subject: 'Vérifiez votre adresse email',
    htmlContent: `
      <p>Bonjour ${toName},</p>
      <p>Merci de vous être inscrit sur Blani.</p>
      <p>Veuillez cliquer sur le lien ci-dessous pour valider votre adresse email :</p>
      <a href="https://blani-backend.onrender.com/verify-email?token=${token}">Vérifier mon adresse</a>
    `,
  };

  await apiInstance.sendTransacEmail(sendSmtpEmail);
};

module.exports = sendVerificationEmail;
