import agenda from '../lib/agenda.js';
import myId from 'mongodb';

const ObjectID = myId.ObjectID;

// module.exports = {

class Scheduler {

    // scheduleMessage: async ({ token, channel, text, post_at }) => {
        async scheduleMessage ({post_at, token, channel, text, messageId }) {
            // console.log(text)
        await agenda.schedule(post_at, 'schedule_message', {
            token,
            channel,
            text,
            messageId,
        });
    }

    async scheduleFiles ({post_at, token, channels, message, filename, title }) {
        console.log(filename)
    await agenda.schedule(post_at, 'schedule_files', {
        token,
        channels,
        message,
        filename,
        title
    });
}

async cancel (messageId) {    
const query = {
  "data.messageId": ObjectID(messageId)
};
  return agenda.cancel(query)
}

async edit(messageId) {
    const query = {
        "data.unique_id": ObjectID(messageId)
};

    return agenda
    .create("schedule_message", {        
        channel,
        text    
    })
    // .repeatEvery(schedule)
    .unique(query)
    .save();
}
    
    
    // ,

    // scheduleResendActiveEmail: async ({ username, email, url }) => {
    //     await agenda.schedule('in 1 second', 'resend', {
    //         username,
    //         email,
    //         url,
    //     });
    // },

    // scheduleWelcomeEmail: async ({ username, email }) => {
    //     await agenda.schedule('in 30 seconds', 'welcome', { username, email });
    // },
}

export default new Scheduler();