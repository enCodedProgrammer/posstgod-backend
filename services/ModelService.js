class ModelService {
  constructor (Model) {
    this.Model = Model;
  }

  async create (model) {
    return await this.Model.create(model);
  }

  async findOrCreate (where, data) {
    const [ model, created ] = await this.Model.findOrCreate({
      where,
      defaults: data
    });

    return model;
  }
  
  async save (model, where) {
    return await this.Model.updateOrCreate(model, where);
  }

  async destroy (where) {
    await this.Model.destroy({ where });
  }
}

export default ModelService;