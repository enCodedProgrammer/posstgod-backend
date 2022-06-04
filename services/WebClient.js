// import { WebClient } from '@slack/web-api';
import pkg from "@slack/web-api"
import axios from 'axios';
import qs from 'querystring';

const { WebClient } = pkg;

class Client extends WebClient {
  constructor (token) {
    super(token);
    this.token = token;
  }

  async uninstallApp (token) {
    const url = 'https://slack.com/api/apps.uninstall';
    const option = {
      headers: {
        'Authorization': "Bearer " + token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const form = qs.stringify({
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET
    });

    const { data } = await axios.post(url, form, option);
    
    if (!data.ok) {
      throw new Error(data.error);
    }
    console.log(data)
    return data.ok;
  }

  
async accessToken (code) {
  const url = 'https://slack.com/api/oauth.v2.access';
  const option = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      
    }
  };

  const config = {
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
     code,
     scope: ['channels:read', 'chat:write', 'app_mentions:read', 'channels:manage', 'commands', 'links:write', 'users:read', 'users:read.email', 'im:read', ' mpim:read'],    
  }

  const form = qs.stringify(config);

  const { data } = await axios.post(url, form, option);
  
  if (!data.ok) {
    throw new Error(data.error);
  } 

  console.log("Access token data" + data)

  return data;
}



  async createReminder ({ token, text, time }) {
    const url = 'https://slack.com/api/reminders.add';
    const option = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const form = qs.stringify({
      token: this.token || token,
      text,
      time
    });

    const { data } = await axios.post(url, form, option);
    
    if (!data.ok) {
      throw new Error(data.error);
    } 

    return data.reminder;
  }

  async conversationInvite ({ token, channel, user_id }) {
    const url = 'https://slack.com/api/conversations.invite';
    const option = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const form = qs.stringify({
      token: this.token || token,
      channel,
      users: user_id
    });

    const { data } = await axios.post(url, form, option);
    
    if (!data.ok) {
      throw new Error(data.error);
    } 

    return data.channel;
  }
}

export default Client;