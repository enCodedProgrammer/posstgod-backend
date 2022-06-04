import ModelService from '../services/ModelService.js';
import VerifyService from '../services/VerifyService.js';
// import PaginationService from 'app/services/PaginationService';
import Workspace from '../models/Workspace.js';
import NotFoundError from '../errors/not-found.js';

class ImageService extends ModelService {
  async count (user_id, workspace_id) {
    const verify = new VerifyService(this.Model);
    return await verify.count(user_id, workspace_id);
  }

  async get (id) {
    const image = await this.Model.findOne({
      where: { id },
      include: [
        {
          model: Workspace,
          as: 'workspace',
          attributes: [
            'id', 'slack_team_name', 'slack_firstname', 
            'slack_firstname', 'slack_timezone', 'slack_role', 
            'slack_phone', 'slack_photo', 'user_id'
          ]
        }
      ],
    });

    if (!image) {
      throw new NotFoundError('Annotation');
    }

    return image;
  }

  // async paginate (user_id, page = 1) {
  //   const pagination = new PaginationService(this.Model);
  //   return await pagination.paginate(user_id, page);
  // }
}

export default ImageService;