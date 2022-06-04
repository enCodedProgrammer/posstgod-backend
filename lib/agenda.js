import Agenda from 'agenda';
import slackService from '../services/SlackService.js';

const agenda = new Agenda({
    db: { address: process.env.MONGO_URI },
});

agenda
    .on('ready', () => console.log('Agenda started!'))
    .on('error', () => console.log('Agenda connection error!'));

agenda.define('schedule_message', async job => {
    const { token, channel, text, messageId } = job.attrs.data;
    await slackService.postMessage({ token, channel, text });
});


agenda.define('schedule_files', async job => {
    const { token, channels, message, filename, title } = job.attrs.data;
    console.log(channels, message)
    await slackService.uploadFile({ token, channels, message, filename, title });
});

// agenda.define('welcome', async job => {
//     const { username, email } = job.attrs.data;
//     await mailer.sendWelcomeEmail({ username, email });
// });

agenda.start();

// module.exports = agenda;
export default agenda