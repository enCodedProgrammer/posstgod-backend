import jwt from 'jsonwebtoken';
import Workspace from '../models/Workspace.js';
import User from "../models/User.js"
import Account from "../models/Account.js"
import Plan from "../models/Plan.js"


class UserService {
  async findOrCreate (email,username) {
      const id = await User.findOrCreate({email: email, username:username})
        return id
    }
    
  async getCompleteUser (userId, slack_user_id) {
    const user = await User.findById({_id: userId})
    const user_workspace = await Workspace.findOne({slack_user_id})
    user.workspaces = user_workspace;
    const user_account = await Account.findOne({user: userId});
    user.account = user_account;
    const user_plan = await Plan.findOne({user: userId});
    user.plan = user_plan
    return (user);
  }

  async getAuthCompleteUser (userId) {
    const user = await User.findById({_id: userId})
    // console.log(user);
    const user_workspace = await Workspace.findOne({user: userId})
    user.workspaces = user_workspace;
    // console.log(user_workspace);
    return user;
  }

  generateLoginData ({ id, email, name, workspaces, account, plan }) {
     return {
      user: { id, email, name, workspaces, account, plan },
      token: this.generateJwtToken({ id, email, name })
    }
  }

  generateJwtToken (payload) {
    return jwt.sign(payload, "secret", { 
      expiresIn: "30d" 
    });
  }

  async getUserFromToken (token) {
    return await promisify(jwt.verify)(token, "secret");
  }
}

export default new UserService;