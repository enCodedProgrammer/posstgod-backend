import NotFoundError from '../errors/not-found.js';

class PlanItemController {
  constructor (service) {
    this.service = service;
  }

  async index (req, res) {
    try {
      const page = req.query.page || 1;
      const id = req.params.id
      // const { id } = req.user;
      res.json(await this.service.paginate(id, Number(page)));
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async get (req, res) {
    try {
      const { id } = req.params;
      res.json(await this.service.get(id));
    } catch (e) {
      if (e instanceof NotFoundError) {
        return res.status(404).json({ error: e.message });
      }
      res.status(500).json({ error: e.message });
    }
  }
}

export default PlanItemController;