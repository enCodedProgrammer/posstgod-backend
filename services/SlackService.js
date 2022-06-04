import Client from './WebClient.js';
import { createReadStream } from 'fs';
import Account from "../models/Account.js"
import axios from 'axios';



import qs from 'querystring';


class SlackService {
  async getAccessData(code) {
    const data = await this.getAccessToken(code);
    // console.log(data)
    const user = await this.getUserInfo({ 
      token: data.access_token, user_id: data.authed_user.id 
    });
    
    // console.log({data});
    return this.format(data, user)
  }

  async getUserInfo({ token, user_id }) {
    const form = qs.stringify(process.env.permissions);
    const wc = new Client(token, form);
    const { user } = await wc.users.info({ user: user_id });

    console.log(user)

    return user;
  }

  async getAccessToken (code) {
    const wc = new Client();
    return await wc.accessToken(code);
  }

  async uninstallApp (token) {
    const wc = new Client(token);
    return await wc.uninstallApp(token);
  }

  async scheduleMessage ({ token, channel, text, post_at }) {
    const wc = new Client(token);
    
    const { 
      scheduled_message_id,
      message
    } =
      await wc.chat.scheduleMessage({ 
      channel, 
      post_at: post_at,
      text,
      as_user: true,
      attachments: [{
        text: 'via www.postgod.io' 
      }]
    });
    
    return { 
      scheduled_message_id,
      message
    }
  }


//   async scheduleMessage ({ token, channel, text, post_at }) {
//     const wc = new Client(token);
//     const chann = (channel).split(/\s*,\s*/)
    
//     if (chann[0]) {
//       const { 
//         scheduled_message_id,
//         message
//       } = await wc.chat.scheduleMessage({ 
//       channel: chann[0],
//       post_at: '1637107155000',
//       text,
//       as_user: true,
//       attachments: [{
//         text: 'via www.postgod.io' 
//       }]
//     })
//   }

//   if (chann[1]) {
//     const { 
//       scheduled_message_id,
//       message
//     } = await wc.chat.scheduleMessage({ 
//     channel: chann[1],
//     post_at: '1637107155000',
//     text,
//     as_user: true,
//     attachments: [{
//       text: 'via www.postgod.io' 
//     }]
//   })
// }

// if (chann[2]) {
//   const { 
//     scheduled_message_id,
//     message
//   } = await wc.chat.scheduleMessage({ 
//   channel: chann[2],
//   post_at: '1637107155000',
//   text,
//   as_user: true,
//   attachments: [{
//     text: 'via www.postgod.io' 
//   }]
// })
// }
    
// if (chann[3]) {
//   const { 
//     scheduled_message_id,
//     message
//   } = await wc.chat.scheduleMessage({ 
//   channel: chann[3],
//   post_at: '1637107155000',
//   text,
//   as_user: true,
//   attachments: [{
//     text: 'via www.postgod.io' 
//   }]
// })
// }

// if (chann[4]) {
//   const { 
//     scheduled_message_id,
//     message
//   } = await wc.chat.scheduleMessage({ 
//   channel: chann[4],
//   post_at: '1637107155000',
//   text,
//   as_user: true,
//   attachments: [{
//     text: 'via www.postgod.io' 
//   }]
// })
// }

// if (chann[5]) {
//   const { 
//     scheduled_message_id,
//     message
//   } = await wc.chat.scheduleMessage({ 
//   channel: chann[5],
//   post_at: '1637107155000',
//   text,
//   as_user: true,
//   attachments: [{
//     text: 'via www.postgod.io' 
//   }]
// })
// }
//     return [{
//       scheduled_message_id,
//       message
//     }]
//   }

   async postMessage ({ token, channel, text }) { 
     console.log(token, text)   
    const chann = (channel).split(/\s*,\s*/)    
    const wc = new Client(token);    
    if (chann[0]) {
      console.log("chann", chann[0])
      await wc.chat.postMessage({ 
        channel: chann[0],
        text,
        as_user: true,
        attachments: [{
          text: 'via www.postgod.io' 
        }]
      })
    }
      if (chann[0] && chann[1]) {
     wc.chat.postMessage({ 
      channel: chann[1],
      text,
      as_user: true,
      attachments: [{
        text: 'via www.postgod.io' 
      }]
    })
  }
    if (chann[0] && chann[1] && chann[2]) {
    await wc.chat.postMessage({ 
      channel: chann[2],
      text,
      as_user: true,
      attachments: [{
        text: 'via www.postgod.io' 
      }]
    })
 }

 if (chann[0] && chann[1] && chann[2] && chann[3]) {
  await wc.chat.postMessage({ 
    channel: chann[3],
    text,
    as_user: true,
    attachments: [{
      text: 'via www.postgod.io' 
    }]
  })
}

if (chann[0] && chann[1] && chann[2] && chann[3] && chann[4]) {
  await wc.chat.postMessage({ 
    channel: chann[4],
    text,
    as_user: true,
    attachments: [{
      text: 'via www.postgod.io' 
    }]
  })
}

if (chann[0] && chann[1] && chann[2] && chann[3] && chann[4] && chann[5]) {
  await wc.chat.postMessage({ 
    channel: chann[5],
    text,
    as_user: true,
    attachments: [{
      text: 'via www.postgod.io' 
    }]
  })
}

if (chann[0] && chann[1] && chann[2] && chann[3] && chann[4] && chann[5] && chann[6]) {
  wc.chat.postMessage({ 
   channel: chann[6],
   text,
   as_user: true,
   attachments: [{
     text: 'via www.postgod.io' 
   }]
 })
}
 if (chann[0] && chann[1] && chann[2] && chann[3] && chann[4] && chann[5] && chann[6] && chann[7]) {
 await wc.chat.postMessage({ 
   channel: chann[7],
   text,
   as_user: true,
   attachments: [{
     text: 'via www.postgod.io' 
   }]
 })
}

if (chann[0] && chann[1] && chann[2] && chann[3] && chann[4] && chann[5] && chann[6] && chann[7] && chann[8]) {
await wc.chat.postMessage({ 
 channel: chann[8],
 text,
 as_user: true,
 attachments: [{
   text: 'via www.postgod.io' 
 }]
})
}

if (chann[0] && chann[1] && chann[2] && chann[3] && chann[4] && chann[5] && chann[6] && chann[7] && chann[8] && chann[9]) {
await wc.chat.postMessage({ 
 channel: chann[9],
 text,
 as_user: true,
 attachments: [{
   text: 'via www.postgod.io' 
 }]
})
}

if (chann[0] && chann[1] && chann[2] && chann[3] && chann[4] && chann[5] && chann[6] && chann[7] && chann[8] && chann[9] && chann[10]) {
await wc.chat.postMessage({ 
 channel: chann[10],
 text,
 as_user: true,
 attachments: [{
   text: 'via www.postgod.io' 
 }]
})
}

if (chann[0] && chann[1] && chann[2] && chann[3] && chann[4] && chann[5] && chann[6] && chann[7] && chann[8] && chann[9] && chann[10] && chann[11]) {
  await wc.chat.postMessage({ 
   channel: chann[11],
   text,
   as_user: true,
   attachments: [{
     text: 'via www.postgod.io' 
   }]
  })
  }
}


  async deleteScheduledMessage ({ token, channel, scheduled_message_id }) {
    const wc = new Client(token);
    return await wc.chat.deleteScheduledMessage({ channel, scheduled_message_id });
  }

  async listScheduledMessages ({ token, latest, oldest }) {
    const wc = new Client(token);
    return await wc.chat.scheduledMessages.list({ latest, oldest });
  }
  
  async listConversations (token) {
    const wc = new Client(token);
    const { channels } = await wc.users.conversations({
      types: 'public_channel,private_channel,mpim,im'
    });
    return channels;
  }
  
  async listChannels (token) {
    const wc = new Client(token);
    const { channels } = await wc.conversations.list({
      types: 'public_channel,private_channel,mpim,im'
    });
    return channels;
  }

  async listUsers (token) {
    const wc = new Client(token);
    const { members } = await wc.users.list({ token });
    return members;
  }

  async createReminder ({ token, text, time, user }) {
    const wc = new Client(token);
    return await wc.createReminder({ text, time, user });
  }

  async uploadFile ({ token, title, message, channels, filename }) {
    const wc = new Client(token);
    // const { file: { id, name, url_private } } =
     return await wc.files.upload({
      channels,
      content: message,
      initial_comment: message,
      file: createReadStream(filename),
      title,
      filename: filename
    });

    // return { 
      // slack_image_name: name, 
      // slack_image_title: title, 
      // slack_image_id: id, 
      // slack_image_url: url_private 
    // };
  }

  async addUser ({ token, channel, user_id }) {
    const wc = new Client(token);
    return await wc.conversationInvite({ channel, user_id });
  }

  format(data, user) {
    const { team, authed_user, access_token, app_id } = data;  
    const { tz, profile } = user;

    // console.log(profile)

    // const account = Account.find({user: profile.email})

    // console.log(account)
    
    return {
      email: profile.email,
      userData: {
        slack_user_id: authed_user.id,
        slack_app_id: app_id,
        slack_token: authed_user.access_token,
        slack_bot_token: access_token,
        slack_team_id: team.id,
        slack_team_name: team.name,
        slack_firstname: profile.first_name ? profile.first_name : profile.real_name,
        slack_lastname: profile.last_name ? profile.last_name : '',
        slack_timezone: tz,
        slack_role: profile.title,
        slack_phone: profile.phone.replace(/\D/g,''),
        slack_photo: profile.image_48
      }
    }
  }
}

export default SlackService = new SlackService();