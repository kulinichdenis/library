import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return this.store.findAll('library');
	},

  setupController(controller, model) {
    let models = model.sortBy('name');
    this._super(controller, models);
  },

  actions: {
		deleteLibrary(library) {
      let confirmation = confirm('Are you sure?');

      if (confirmation) {
        library.destroyRecord();
      }
	  }
	}
});
