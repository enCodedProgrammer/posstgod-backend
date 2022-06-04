import express from 'express';
import controller from '../controllers/MessageController.js';
import { auth } from '../middleware/user.js';
import { genWorkspace } from '../middleware/genWorkspace.js'

const routes = new express.Router();

routes.get('/:id/sent', controller.index);
routes.get('/:workspaceId', [genWorkspace], controller.get);
routes.delete('/:id', controller.delete);
routes.patch('/:id', controller.patch);

export default routes;
