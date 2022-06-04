import express from 'express';
import slackRoutes from './slack.js';
// import userRoutes from './slackUser.js';
import workspaceRoutes from './workspaces.js';
// import taskRoutes from './task.js';
// import memberRoutes from './member.js';
// import imageRoutes from './routes/image';
import messageRoutes from './message.js';

const routes = express.Router();

routes.get('/', async (req, res) => res.end());
// routes.get('/checkout', async (req, res) => res.render('checkout'));
routes.use('/slack', slackRoutes);
// routes.use('/user', userRoutes);
routes.use('/workspace', workspaceRoutes);
// routes.use('/task', taskRoutes);
// routes.use('/member', memberRoutes);
// routes.use('/image', imageRoutes);
routes.use('/message', messageRoutes);

export default routes;