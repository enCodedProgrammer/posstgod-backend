import NotFoundError from '../errors/not-found.js';
import Account from "../models/Account.js"
import Plan from "../models/Plan.js"

class AccountService {
  async findOrCreate (userId) {
    const plan = await this.getPlan(userId);
    const account = await Account.findOrCreate({user: userId});
    return {
      account: account.doc,
      plan
    }
  }

  async getPlan(userId) {
    const plan = await Plan.findOne({user: userId});
    console.log("First", plan);
    if (!plan) {
      console.log("No plan chosen yet");
      const setDefaultPlan = {
        name: "Free Plan",
        price: 0,
        user: userId
      }
      const defaultPlanSet = await Plan.create(setDefaultPlan);
      console.log("Created Plan", defaultPlanSet)
      return defaultPlanSet;
    } else if (plan) {
      console.log("Found Plan", plan)
      return plan;
    }
  }

  async get (id) {
    const account = await this.Model.findOne({ where: { id } });

    if (!account) {
      throw new NotFoundError('Account');
    }

    return account;
  }
}

export default new AccountService;