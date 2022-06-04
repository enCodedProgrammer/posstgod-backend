import ModelService from '../services/ModelService.js';
import VerifyService from '../services/VerifyService.js';
import Workspace from '../models/Workspace.js';
import Message from '../models/Message.js';

import NotFoundError from '../errors/not-found.js';

class MessageService {
  async count (user_id, workspace_id) {
    const verify = new VerifyService(this.Model);
    return await verify.count(user_id, workspace_id);
  }

  destroy(id) {

    console.log(id)
     return Message.deleteOne({_id: id})
  }


  // async get (id) {
  //   const message = await this.Model.findOne({
  //     where: { id },
  //     include: [
  //       {
  //         model: Workspace,
  //         as: 'workspace',
  //         attributes: [
  //           'id', 'slack_team_name', 'slack_firstname', 
  //           'slack_firstname', 'slack_timezone', 'slack_role', 
  //           'slack_phone', 'slack_photo', 'user_id'
  //         ]
  //       },
  //       {
  //         model: MessageAttachment,
  //         as: 'attachments',
  //         attributes: ['filename']
  //       }
  //     ],
  //   });

  //   if (!message) {
  //     throw new NotFoundError('Message');
  //   }

  //   return message;
  // }




  async get (id) {
    const message = await Message.findById({user: id })
    if (!message) {
      throw new NotFoundError('Message');
    }

    return message;
  }

  // async paginate (user_id, page = 1) {
  //   const limit = 10;
  //   const offset = (page - 1) * limit;

  //   const { count, rows } = await this.Model.findAndCountAll({
  //     where: { 
  //       user_id,
  //       sent: false
  //     },
  //     include: [{
  //       model: MessageAttachment,
  //       as: 'attachments',
  //       attributes: ['filename']
  //     }],
  //     distinct: true,
  //     offset, 
  //     limit
  //   });

  //   return {
  //     data: rows,
  //     totalItems: count,
  //     currentPage: page,
  //     lastPage: Math.ceil(count / limit)
  //   };
  // }



  async paginate (user_id, page = 1) {
    const limit = 10;
    const offset = (page - 1) * limit;

    // const { count, rows } = await Message.estimatedDocumentCount({
      const count = await Message.countDocument({user: user_id, sent: false});

    return {
      // data: rows,
      totalItems: count,
      currentPage: page,
      lastPage: Math.ceil(count / limit)
    };
  }


  // async setSent (id) {
  //   await this.Model.update({ sent: true }, { where: { id } }); 
  // }

  async setSent (id) {
    await this.Message.findOneAndUpdate(id, { sent: true }); 
  }
}

export default MessageService;