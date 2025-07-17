const SibApiV3Sdk = require('@sendinblue/client');
const dotenv = require('dotenv');
dotenv.config();

const client = new SibApiV3Sdk.TransactionalEmailsApi();
client.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

async function sendVerificationEmail(to, token) {
  const link = `http://localhost:5000/api/auth/verify-email?token=${token}`;


  await client.sendTransacEmail({
    sender: { name: 'Blani', email: 'dukufi@gmail.com' }, // expéditeur validé
    to: [{ email: to }],
    subject: 'Vérifie ton adresse email ✉️',
    htmlContent: `
      <h2>Bienvenue sur Blani !</h2>
      <p>Merci de t’inscrire. Clique sur le lien ci-dessous pour vérifier ton adresse email :</p>
      <a href="${link}">Vérifier mon email</a>
    `
  });
}

module.exports = sendVerificationEmail;
