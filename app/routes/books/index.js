import Ember from 'ember';

export default Ember.Route.extend({

	queryParams: {
		page: { refreshModel: true },
	},

	limitToShow: 5,
	prevBook: null,
	nextBook: null,
	prevPageDisable: true,
	nextPageDisable: true,
	directionRight: true,
	currentPage: 1,
	currentBook: null,
	spread: false,

	model(params) {
		if (!params.page) {
			return this.store.query('book', { orderBy: 'createdAt', limitToFirst: this.limitToShow});
		}

		if(this.currentPage > parseInt(params.page)) {
			this.currentPage = parseInt(params.page);
			this.spread = this.directionRight ? true : false ;
			this.directionRight = false;

			return this.store.query('book', { orderBy: 'createdAt', endAt: this.prevBook, limitToFirst: this.limitToShow});

		} else {
			this.currentPage = parseInt(params.page);
			this.spread = !this.directionRight ? true : false;
			this.directionRight = true;

			return this.store.query('book', { orderBy: 'createdAt', startAt: this.nextBook, limitToFirst: this.limitToShow});
		}
	},

	setupController(controller, model) {
		if (!Ember.isEmpty(model)){
			if (this.directionRight) {
				if (this.limitToShow === model.toArray().length) {
						this.prevBook =  this.spread ? this.stepBook : this.currentBook;
						this.nextBook = model.popObject().get('createdAt');
						this.currentBook = model.get('lastObject').get('createdAt');
						this.stepBook = model.get('firstObject').get('createdAt');
						this.currentPage === 1 ? this._disableButtons(true, false) : this._disableButtons(false, false);
				} else {
					this.prevBook = this.spread ? this.stepBook : this.currentBook;
					this.stepBook = model.get('firstObject').get('createdAt');
					this._disableButtons(false, true);
				}
			} else  {
				if (this.limitToShow === model.toArray().length) {
					this.nextBook =  this.spread ? this.stepBook : this.currentBook;
					this.prevBook = model.shiftObject().get('createdAt');
					this.currentBook = model.get('firstObject').get('createdAt');
					this.stepBook = model.get('lastObject').get('createdAt');
					this._disableButtons(false, false);
				} else {
					this.nextBook = this.spread ? this.stepBook : this.currentBook;
					this.stepBook = model.get('lastObject').get('createdAt');
					this._disableButtons(true, false);
				}
			}
		}

		this._super(controller, model);

		controller.set('prevButton',  this.prevPageDisable);
		controller.set('nextButton', this.nextPageDisable);
		controller.set('nextPage', this.currentPage + 1);
		controller.set('prevPage', this.currentPage - 1);
	},

	actions: {
		deleteBook(book){
			book.get('library').then((library) => {
				library.get('books').removeObject(book);
				library.save();
			})
			book.destroyRecord();
		}
	},
	//private methods

	_disableButtons(statPrev, statNext) {
		this.prevPageDisable = statPrev;
		this.nextPageDisable = statNext;
	}
});
