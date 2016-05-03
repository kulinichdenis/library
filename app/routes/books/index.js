import Ember from 'ember';

export default Ember.Route.extend({

  // model() {
  //   return this.store.findAll('book')
  // },

  // actions: {
  //   deleteBook(book) {
  //     book.get('author').then((prevAuthor) => {
  //       prevAuthor.get('books').removeObject(book);
  //       prevAuthor.save();
  //     });

  //     book.get('library').then((prevLibrary) => {
  //       prevLibrary.get('books').removeObject(book);
  //       prevLibrary.save();
  //     });
  //     book.destroyRecord();
  //   }
  // }

	queryParams: {
		page: { refreshModel: true },
	},

	limitToShow: 2, // use with one addition element 
	prevBook: null,
	nextBook: null,
	directionLeft: true,
	currentPage: 1,

	model(params) {
		if (!params.page) {
			return this.store.query('book', { orderBy: 'createdAt', limitToFirst: this.limitToShow});
		}
		
		if(this.currentPage > parseInt(params.page)) {
			this.currentPage = parseInt(params.page);
			this.directionLeft = false;
			this.nextBook = this.currentBook; 
			return this.store.query('book', { orderBy: 'createdAt', endAt: this.prevBook, limitToFirst: this.limitToShow});
		} else {
			this.directionLeft = true;
			this.currentPage = parseInt(params.page);
			this.prevBook = this.currentBook;
			return this.store.query('book', { orderBy: 'createdAt', startAt: this.nextBook, limitToFirst: this.limitToShow});
		}
	},

	setupController(controller, model) {
		
		if(this.directionLeft) {
			if(this.limitToShow === model.toArray().length) { // last item 
			// 	this.nextBook = null;
			// } else {
				this.nextBook = model.popObject().get('createdAt');
				this.currentBook = model.get('lastObject').get('createdAt');
			}
		} else {
			if (this.limitToShow === model.toArray().length) {
				// this.prevBook = null;
			// } else {
				this.prevBook = model.shiftObject().get('createdAt');
				this.currentBook = model.get('firstObject').get('createdAt');
			}
		}
	
		this._super(controller, model);
		
		// controller.set('prevButton', this.currentPage === 1 ? true : false);
		// controller.set('nextButton', this.nextBook ? false : true);
		controller.set('nextPage', this.currentPage + 1);
		controller.set('prevPage', this.currentPage - 1);
	}

});
