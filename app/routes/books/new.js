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
		selectLibrary(id) {
			this.set('library', id);
		},

		saveBook(book) {
			let library;
			if(this.get('library')) {
				library = this.store.peekRecord('library', this.get('library'));
			} else {
				library = this.get('libraries').get('firstObject');
			}
			book.set('library', library);
			library.get('books').pushObject(book);
			library.save();
			book.save().then((response) => {
				this.set('library', '');
			})
		}
	}

});
