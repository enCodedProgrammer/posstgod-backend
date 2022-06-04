import NotFoundError from '../errors/not-found.js';
import ModelService from '../services/ModelService.js';

class SchedulingSettingService extends ModelService {
  async get (id) {
    const setting = await this.Model.findOne({
      where: { id }
    });

    if (!setting) {
      throw new NotFoundError('Scheduling Settings');
    }

    return setting;
  }

  async getBy (where) {
    console.log(where);

    const setting = await this.Model.findOne({ where });

    if (!setting) {
      throw new NotFoundError('Scheduling Settings');
    }

    return setting;
  }
}

export default SchedulingSettingService;