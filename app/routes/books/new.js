import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return Ember.RSVP.hash({
			libraries: this.store.findAll('library'),
			book: this.store.createRecord('book')
		})
	},

	setupController(controller, model) {
		controller.set('libraries', model.libraries),
		controller.set('model', model.book)
	},

	actions: {
		selectLibrary(id) {
			this.controller.set('library', id);
		},

		saveBook(book) {
			var id;
			if(this.controller.get('library')) {
				id = this.controller.get('library'); 
			} else {
				let libraries = this.controller.get('libraries');
				id = libraries.get('firstObject').get('id'); 
			}
			
			let library = this.store.peekRecord('library', id);
			book.set('library', library);
			library.get('books').pushObject(book);	
			library.save();
			book.save();
		}
	} 
});
