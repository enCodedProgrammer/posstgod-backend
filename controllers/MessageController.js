import messageService from '../services/MessageService.js';
import PlanItemController from '../controllers/PlanItemController.js';
import Scheduler from '../jobs/Scheduler.js';
import Message from '../models/Message.js';

class MessageController {
  async index (req, res) {

    console.log(req.params.id)
    const controller = new PlanItemController(messageService);
    controller.index(req, res);
  }

  async get (req, res) {
    const controller = new PlanItemController(messageService);
    controller.get(req, res);
  }

  async delete (req, res) {
    try {
      const { id } = req.params;
      
      await Promise.all([
        // await Promise(
          // Message.deleteOne({_id: id}),
        Scheduler.cancel(id)

      ]);

      res.status(204).send();
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

async patch (req, res) {
  try {
    const { id } = req.params;
    
    // await Promise.all([
      // await Promise(
        Message.deleteOne({_id: id})
      // Scheduler.cancel(id)
    // );

    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
}

export default new MessageController();