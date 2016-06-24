import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return Ember.RSVP.hash({
			libraries: this.store.findAll('library'),
			book: this.store.createRecord('book')
		})
	},

	setupController(controller, model) {
		this._super(controller, model.book);
		controller.set('libraries', model.libraries);
	},

	actions: {
	}
});
