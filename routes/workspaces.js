import express from 'express'
import { changePlan, listInvoice, cancelPlan } from '../controllers/account.js'
import { checkPlan, checkSimilarPlan } from '../middleware/account.js'
import { getWorkspace } from '../middleware/workspaces.js'
import { getSlackWorkspace } from '../middleware/workspaces.js'
import { protect } from '../middleware/auth.js'
import controller from '../controllers/WorkspaceController.js';
import { genWorkspace } from '../middleware/genWorkspace.js'

const router = express.Router({ mergeParams: true })

router
  .route('/:id/plan')
  .post(protect, checkPlan, getWorkspace, checkSimilarPlan, changePlan)
router.route('/:id/plan').delete(protect, getWorkspace, cancelPlan)
router.route('/:id/plan/invoice').get(getWorkspace, listInvoice)
router.route('/:id/account').get()
router.route('/:id/       account').delete()

router.get('/:userId/channels', [getSlackWorkspace], controller.listChannels);
router.get('/:userId/:workspaceId/conversations', [genWorkspace], controller.listConversations);
router.get('/:id/schedule', controller.listScheduledMessages);
router.delete('/:id/schedule', controller.deleteScheduledMessage);
router.get('/:id', controller.get);
router.get('/:userId/:workspaceId/users', [genWorkspace],  controller.listUsers);
router.post('/:userId/schedule', [getSlackWorkspace], controller.scheduleMessage);

export default router
