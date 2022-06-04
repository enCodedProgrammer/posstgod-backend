import asyncHandler from 'express-async-handler'
import Workspace from '../models/Workspace.js'
import Account from '../models/Account.js'
import NotFoundError from '../errors/not-found.js';
import userService from "../services/Userservice.js"

export const getWorkspace = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  let workspace = await Workspace.findById(id)

  if (!workspace) {
    res.status(404)
    throw new Error('Workspace is required but not found')
  }

  if (workspace.account == null) {
    // create an account with null values

    const account = await Account.create({
      stripe_customer_id: null,
      subscribed_at: null,
      stripe_subscription_id: null,
      stripe_payment_method_id: null,
      workspace: workspace._id,
    })

    if (account) {
      workspace.account = account._id
      //update workspace
      const updatedWorkspace = await workspace.save()
      //return workspace with account
      req.workspace = updatedWorkspace
    } else {
      res.status(400)
      throw new Error('Something went wrong while creating an account')
    }
  }
  req.workspace = workspace
  next()
})


export const getSlackWorkspace = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { userWorkspaceId } = req.params;
      // console.log(id)
      const user = await userService.getAuthCompleteUser(userId);
      const { workspaces } = user;
      // const workspace = workspaces.find(w => w.id === id);
      if (!workspaces) {
      throw new NotFoundError('Workspace');
    }

    req.workspace = workspaces;

    next();

  } catch (e) {
    if (e instanceof NotFoundError) {
      return res.status(404).json({ error: e.message });
    }
    
    res.status(500).json({ error: e.message });
  }
};
