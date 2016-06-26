
import Ember from 'ember';

export default Ember.Controller.extend({
	filtering: '',
	library: '',

	books: Ember.computed('model.@each.title', 'filtering', function(){
		let result = this.get('model');
		let filtering = this.get('filtering');
		const regex = new RegExp((filtering), 'ig');
		if (filtering.length != 0) {
			return result.filter((item) => item.get('title').match(regex));
		} else {
			return result;
		}
	}),
	
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
		},

		deleteBook(book){
			book.get('library').then((library) => {
				library.get('books').removeObject(book);
				library.save();
			})
			book.destroyRecord();
		}
	}
});
