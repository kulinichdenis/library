import Ember from 'ember';

export default Ember.Controller.extend({
	filtering: '',
	library: '',
	bookName: '',
	isModal: false,
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
		toggleModal() {
			this.set('isModal', false);
		},
		showModal() {
			this.set('isModal', true);
		},

		selectLibrary(id) {
			this.set('library', id);
		},

		buttonSubmit() {
			let library;
			if(this.get('library')) {
				library = this.store.peekRecord('library', this.get('library'));
			} else {
				library = this.get('libraries').get('firstObject');
			}
			let book = this.store.createRecord('book', { title: this.get('bookName'), library: library });
			library.get('books').pushObject(book);
			library.save();
			book.save().then((response) => {
				this.set('isModal', false);
			})
		}
	}
});
