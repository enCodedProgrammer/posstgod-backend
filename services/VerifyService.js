// import { Op } from 'sequelize';
import date from '../utils/date.js';

class VerifyService {
  constructor (Model) {
    this.Model = Model;
  }

  async count (user_id, workspace_id) {
    const { startOfMonth, now } = date();
    const result = await this.Model.count({
      where: { 
        user_id,
        workspace_id,
        created_at: {
          [Op.between]: [startOfMonth(), now()]
        }
      }
    });

    return result;
  }
}

export default VerifyService;