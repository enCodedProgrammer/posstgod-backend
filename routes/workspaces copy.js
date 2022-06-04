import express from 'express'
import { changePlan } from '../controllers/account.js'
import controller from '../controllers/WorkspaceController.js';
import { auth } from '../middleware/user.js';
// import { 
//   verifyMessages, 
//   verifyImages, 
//   verifyTasks,
//   verifyMembers,
//   loadWorkspace
// } from 'app/middlewares/workspace';


const router = express.Router({ mergeParams: true })

// router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)


router.get('/:id/channels', [auth], controller.listChannels);
router.get('/:id/conversations', [auth], controller.listConversations);
router.get('/:id/schedule', [auth,], controller.listScheduledMessages);
router.delete('/:id/schedule', [auth], controller.deleteScheduledMessage);
router.get('/:id', [auth], controller.get);
router.get('/:id/users', [auth], controller.listUsers);
router.post('/:id/schedule', [auth], controller.scheduleMessage);
router.route('/:id/plan').post(changePlan)
router.route('/:id/plan/invoice').get()
router.route('/:id/account').get()
router.route('/:id/account').delete()

export default router
