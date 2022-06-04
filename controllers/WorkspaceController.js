import formidable from 'formidable';
import Scheduler from '../jobs/Scheduler.js';
// import ScheduleMessage from '../jobs/scheduleMessage.js'
// import ScheduleFile  from '../jobs/scheduleFile.js'
import slackService  from '../services/SlackService.js';
import imageService from "../services/ImageService.js"
import messageService from "../services/MessageService.js"
import userService from '../services/UserService.js';
// import taskService from "../services/TaskService.js"
import schedulingSettingService from "../services/SchedulingSettingService.js"
import messageAttachment from "../models/MessageAttachments.js"
import { rename, renameSync, unlink } from 'fs';
import NotFoundError from '../errors/not-found.js';
import Message from "../models/Message.js"

const { IncomingForm } = formidable

class WorkspaceController {
  async get (req, res) {
    try {
      const {
        id,
        slack_team_name,
        slack_firstname,
        slack_lastname,
        slack_timezone,
        slack_role,
        slack_phone,
        slack_photo,
        user_id
      } = req.workspace;

      res.json({
        id,
        slack_team_name,
        slack_firstname,
        slack_lastname,
        slack_timezone,
        slack_role,
        slack_phone,
        slack_photo,
        user_id
      });
    } catch (e) {
      res.json({ error: e.message });
    }
  }

  async scheduleMessage (req, res) {
    const promises = [];
    // const { user, workspace } = req;
    const { slack_token, _id } = req.workspace;
    const user = req.params.userId

    const form = new IncomingForm({ multiples: true, keepExtensions: true });

    form.parse(req, async (err, fields, { files }) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const { channel, text, post_at } = fields;      

      // const post_at = '2021-11-20 11:04:00 AM'

      try { 
        const message = await new Promise((resolve, reject)=> {
          const chann = (channel).split(/\s*,\s*/)
          // for(var i=0; i<chann.length; i++){
        Message.create({
          slack_channel_id: chann,
          slack_message_text: text,
          slack_message_post_at: post_at,
          user_id: user,
          workspace_id: _id,
        },
        // { upsert: true, returnNewDocument: true },
         ( error, obj ) => {
          if( error ) {
              console.error( JSON.stringify( error ) );
              return reject( error );
          }

          resolve( obj );
      })
    // };
    })

  console.log(message)            
    promises.push(Scheduler.scheduleMessage({post_at, token: slack_token, channel, text, messageId: message._id
    }));


        if (files) {
          files = Array.isArray(files) ? files : [files];
          
          for (const file of files) {
            try {
              const filename = `/tmp/${file.originalFilename}`;              
              console.log(filename)
              renameSync(file.filepath, filename);            

              promises.push(messageAttachment.create({ 
                filename, 
                message_id: message._id,
                user_id: user,
                workspace_id: _id,
              }));

              const channels = channel


              // promises.push(slackService.uploadFile({ 
              //   token: slack_token,
              //   channels, 
              //   message: text,
              //   filename,
              //   title: file.originalFilename
              // }));

              promises.push(Scheduler.scheduleFiles({post_at,
                token: slack_token, 
                channels,
                message: text,
                filename,
                title: file.originalFilename

              }));
            } catch (e) {
              await message.destroy();
              throw e;
            }
          }
        }

        await Promise.all(promises);
      
        res.json(message);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });
  }

  async deleteScheduledMessage (req, res) {
    try {
      const { message_id } = req.body;
      
      await Promise.all([
        messageService.destroy({ id: message_id }), 
        Scheduler.cancel(message_id)
      ]);

      res.status(204).send();
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async listChannels (req, res) {
    try {
      const { slack_token } = req.workspace;
      res.json(await slackService.listChannels(slack_token));
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async listConversations (req, res) {
    try {
      const { slack_token } = req.workspace;

      res.json(await slackService.listConversations(slack_token));
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async listUsers (req, res) {
    try   {    
      const { slack_bot_token } = req.workspace;

      // console.log("error", slack_token)

      res.json(await slackService.listUsers(slack_bot_token));
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async listScheduledMessages (req, res) {
    try {
      const { latest, oldest } = req.query;
      const { slack_token } = req.workspace;

      const { scheduled_messages } = await slackService.listScheduledMessages({ 
        token: slack_token, latest, oldest 
      });
      
      res.json(scheduled_messages);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async createReminder (req, res) {
    try {
      const { text, time } = req.body;
      const { user, workspace } = req;
      const { slack_token } = workspace;
      
      const reminder = await slackService.createReminder({ 
        token: slack_token, text, time, user: workspace.slack_user_id 
      });
      
      res.json(await taskService.save({
        slack_reminder_time: reminder.time, 
        slack_reminder_text: reminder.text,
        slack_reminder_id: reminder.id,
        workspace_id: workspace.id,
        user_id: user.id
      }));
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async sendImage (req, res) {
    try {
      const { user, workspace } = req;
      const { slack_token } = workspace;

      const form = new IncomingForm();

      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        const { channels } = fields;
        const filename = `/tmp/${files.file.name}`;

        rename(files.file.path, filename, async (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          const image = await slackService.uploadFile({ 
            token: slack_token, 
            channels, 
            message: 'http://www.vyudu.dev',
            title: 'Vyudu annotation',
            filename,
          });
  
          image.user_id = user.id;
          image.workspace_id = workspace.id;
  
          unlink(filename, (err) => {
            if (err) return console.log(err);
      
            console.log(`file ${filename} deleted successfully`);
          });
          
          res.json(await imageService.save(image));
        });
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async getSchedulingSetting (req, res) {
    try {
      const { id } = req.workspace;

      const setting = await schedulingSettingService.getBy({ workspace_id: id });

      res.json(setting);
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  }

  async saveSchedulingSetting (req, res) {
    try {
      const { schedulingSetting } = req;
      const { workspace_id } = schedulingSetting;

      const setting = await schedulingSettingService.save(schedulingSetting, { workspace_id });

      res.json(setting);
    } catch (e) {
      if (e instanceof NotFoundError) {
        return res.status(404).json({ error: e.message });
      }
      res.status(500).json({ error: e.message });
    }
  }

  async updateTimezone (req, res) {
    try {
      const { workspace } = req;
      const { timezone } = req.body;

      workspace.slack_timezone = timezone;
      await workspace.save();

      res.status(204).send();
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async addUser (req, res) {
    try {
      const { channel, slack_user_id } = req.body;
      const { user, workspace } = req;
      const { slack_token } = workspace;
      
      const [ _, slackUser ] = await Promise.all([ 
        slackService.addUser({ token: slack_token, channel, user_id: slack_user_id }), 
        slackService.getUserInfo({ token: slack_token, user_id: slack_user_id })
      ]);

      const member = await memberService.save({
        slack_user_id: slackUser.id,
        slack_team_id: slackUser.team_id,
        slack_name: slackUser.real_name,
        slack_timezone: slackUser.tz,
        slack_email: slackUser.profile.email,
        slack_photo: slackUser.profile.image_48,
        workspace_id: workspace.id,
        user_id: user.id
      });

      res.json(member);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}

export default new WorkspaceController();