import NotFoundError from '../errors/not-found.js';
import Workspace from '../models/Workspace.js'

export const genWorkspace = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    let workspaces = await Workspace.findById(workspaceId)

    if (!workspaces) {
      res.status(404)
      throw new Error('Workspace is required but not found')
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
