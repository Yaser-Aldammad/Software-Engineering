const mailer = require('nodemailer');
const settings = require('../../server-settings.json')

const transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: settings.emailPreferences.emailAddress,
        pass: settings.emailPreferences.emailPassword
    }
});

/**
 * this function will send a confirmation email 
 * @param {String} to 
 * @param {String} subject 
 * @param {String} html 
 * @returns {boolean}
 */
async function sendMail(to, subject, html) {
    const mailOptions = {from: settings.emailPreferences.sender, to, subject, html};
    let resp = await transporter.sendMail(mailOptions);
    if (!resp)
        return false
    else
        return true
}

module.exports = {sendMail};