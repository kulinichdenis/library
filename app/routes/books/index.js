import Ember from 'ember';

export default Ember.Route.extend({

	queryParams: {
		page: { refreshModel: true },
	},

	limitToShow: 4,
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
			return Ember.RSVP.hash({
				books: this.store.query('book', { orderBy: 'createdAt', limitToFirst: this.limitToShow}),
				libraries: this.store.findAll('library')
			})
		}

		if (this.currentPage > parseInt(params.page)) {
			this.currentPage = parseInt(params.page);
			this.spread = this.directionRight ? true : false;
			this.directionRight = false;

			return Ember.RSVP.hash({
				books: this.store.query('book', { orderBy: 'createdAt', endAt: (this.prevBook ? this.prevBook : this.get('controller').get('prevBook').get('createdAt')), limitToFirst: this.limitToShow}),
				libraries: this.store.findAll('library')
			})

		} else {
			this.currentPage = parseInt(params.page);
			this.spread = !this.directionRight ? true : false;
			this.directionRight = true;

			return Ember.RSVP.hash({
				books: this.store.query('book', { orderBy: 'createdAt', startAt: (this.nextBook ? this.nextBook : this.get('controller').get('nextBook').get('createdAt')), limitToFirst: this.limitToShow}),
				libraries: this.store.findAll('library')
			})
		}
	},

	setupController(controller, model) {
		let books = model.books;
		if (!Ember.isEmpty(model)){
			if (this.directionRight) {
				if (this.limitToShow === books.toArray().length) {
						this.prevBook =  this.spread ? this.stepBook : this.currentBook;
						this.nextBook = books.popObject().get('createdAt');
						this.currentBook = books.get('lastObject').get('createdAt');
						this.stepBook = books.get('firstObject').get('createdAt');
						this.currentPage === 1 ? this._disableButtons(true, false) : this._disableButtons(false, false);
				} else {
					this.prevBook = this.spread ? this.stepBook : this.currentBook;
					this.stepBook = books.get('firstObject').get('createdAt');
					this.currentPage === 1 ? this._disableButtons(true, true) : this._disableButtons(false, true);
					debugger
				}
			} else {
				if (this.limitToShow === books.toArray().length) {
					this.nextBook =  this.spread ? this.stepBook : this.currentBook;
					this.prevBook = books.shiftObject().get('createdAt');
					this.currentBook = books.get('firstObject').get('createdAt');
					this.stepBook = books.get('lastObject').get('createdAt');
					this._disableButtons(false, false);
				} else {
					this.nextBook = this.spread ? this.stepBook : this.currentBook;
					this.stepBook = books.get('lastObject').get('createdAt');
					this._disableButtons(true, false);
				}
			}
		}

		this._super(controller, books);
		controller.set('libraries', model.libraries);
		controller.set('nextBook', this.nextBook ? true : false);
		controller.set('prevButton',  this.prevPageDisable);
		controller.set('nextButton', this.nextPageDisable);
		controller.set('nextPage', this.currentPage + 1);
		controller.set('prevPage', this.currentPage - 1);
	},

	actions: {
		showModal() {
			this.get('controller').set('newBook', this.store.createRecord('book'));
			this.render('components/books/book-create', { into: 'books/index', outlet: 'modal'})
		},

		closeModal() {
			this.disconnectOutlet({
				outlet: 'modal',
				parentView: 'books/index'
			})
		},

		showDetails(book) {
			this.get('controller').set('currentBook', book);
			this.render('components/books/book-form', { into: 'books/index', outlet: 'modal'})
		}
	},

	//private methods
	_disableButtons(statPrev, statNext) {
		this.prevPageDisable = statPrev;
		this.nextPageDisable = statNext;
	}
});
