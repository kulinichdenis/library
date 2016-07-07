import Ember from 'ember';

export default Ember.Route.extend({

	queryParams: {
		page: { refreshModel: true },
	},

	limitToShow: 4,
	prevBook: null,
	nextBook: null,
	tmpNextBook: null,
	tmpPrevBook: null,
	prevPageDisable: true,
	nextPageDisable: true,
	directionRight: true,
	currentPage: 1,
	currentBook: null,
	spread: false,
	tmpStatus: false,

	model(params) {
		if (!params.page) {
			return this._receiveData('', '', this.limitToShow)
		}

		if (this.currentPage > parseInt(params.page)) {
			this.currentPage = parseInt(params.page);
			this.spread = this.directionRight ? true : false;
			this.directionRight = false;

			return this._receiveData('endAt', this.prevBook, this.limitToShow);

		} else if (this.currentPage < parseInt(params.page)) {
			this.currentPage = parseInt(params.page);

			this.spread = !this.directionRight ? true : false;
			this.directionRight = true;
			return this._receiveData('startAt', this.nextBook ? this.nextBook : this.get('controller').get('nextBook').get('createdAt'), this.limitToShow);

		} else if (this.currentPage === parseInt(params.page)) {
			this.tmpStatus = true;
			if (this.directionRight) {
				return this._receiveData('startAt', this.tmpNextBook, this.limitToShow);
			} else {
				return this._receiveData('endAt', this.tmpPrevBook, this.limitToShow);
			}
		}
	},

	setupController(controller, model) {
		let books = model.books;
		if (!Ember.isEmpty(model)){
			if (this.directionRight) {
				if (this.limitToShow === books.toArray().length) {
						this.prevBook = this.tmpStatus ? this.prevBook : this.spread ? this.stepBook : this.currentBook;
						this.tmpNextBook = this.nextBook;
						this.nextBook = books.popObject().get('createdAt');
						this.currentBook = books.get('lastObject').get('createdAt');
						this.stepBook = books.get('firstObject').get('createdAt');
						this.currentPage === 1 ? this._disableButtons(true, false) : this._disableButtons(false, false);
				} else {
					this.tmpNextBook = this.nextBook;
					this.nextBook = null;
					this.prevBook = this.controller.get('prevBook') ? this.controller.get('prevBook').get('createdAt') : this.spread ? this.stepBook : this.currentBook;
					this.stepBook = books.get('firstObject').get('createdAt');
					this.currentPage === 1 ? this._disableButtons(true, true) : this._disableButtons(false, true);
				}
			} else {
				if (this.limitToShow === books.toArray().length) {
					this.nextBook = this.tmpStatus ? this.nextBook : this.spread ? (this.controller.get('stepBook') ? this.stepBook : false) : this.currentBook;
					this.tmpPrevBook = this.prevBook;
					this.prevBook = books.shiftObject().get('createdAt');
					this.currentBook = books.get('firstObject').get('createdAt');
					this.stepBook = books.get('lastObject').get('createdAt');
					this._disableButtons(false, false);

				} else {
					this.tmpPrevBook = this.prevBook;
					this.nextBook = this.spread ? (this.controller.get('stepBook') ? this.stepBook : false) : this.currentBook;
					this.stepBook = books.get('lastObject').get('createdAt');
					this._disableButtons(true, false);
				}
			}
			this.tmpStatus = false;
		}

		this._super(controller, books);
		controller.set('libraries', model.libraries);
		controller.set('nextBook', this.nextBook ? true : false);
		controller.set('prevBook', false);
		controller.set('leftStep', !this.directionRight);
		controller.set('stepBook', true);
		controller.set('prevButton', this.prevPageDisable);
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
	},

	_receiveData(direction, startPoint, limit) {
		let queryParameters = { orderBy: 'createdAt', limitToFirst: limit };

		if (startPoint) {
			direction === 'endAt' ? queryParameters.endAt = startPoint : queryParameters.startAt = startPoint;
		}

		return Ember.RSVP.hash({
			books: this.store.query('book', queryParameters),
			libraries: this.store.findAll('library')
		})
	}
});
