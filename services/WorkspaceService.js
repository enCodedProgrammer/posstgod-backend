import Workspace from "../models/Workspace.js"
import NotFoundError from '../errors/not-found.js';

class WorkspaceService {
  async getBy (where) {
    const workspace = await this.Model.findOne({ where });

    if (!workspace) {
      throw new NotFoundError('Workspace');
    }

    return workspace;
  }


  async save (userData) { 
    // console.log(userData)
    Workspace.updateOne({slack_user_id: userData.slack_user_id }, userData, {upsert: true, setDefaultsOnInsert: true}
      , function(err, user) {
      //  return done(err, user);
      if (err) {
        console.log("authenticated");
      }
    })}

  async get (id) {
    return await this.getBy({ id });
  }
}

export default new WorkspaceService;