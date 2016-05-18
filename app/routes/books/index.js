import Ember from 'ember';

export default Ember.Route.extend({

	queryParams: {
		page: { refreshModel: true },
	},

	limitToShow: 3,
	prevBook: null,
	nextBook: null,
	prevPageDisable: true,
	nextPageDisable: true,
	directionRight: true,
	currentPage: 1,
	currentBook: null,
	middleDirection: 'left',

	model(params) {
		if (!params.page) {
			return this.store.query('book', { orderBy: 'createdAt', limitToFirst: this.limitToShow});
		}
		
		if(this.currentPage > parseInt(params.page)) { 
			this.currentPage = parseInt(params.page);
			this.directionRight = false;
			return this.store.query('book', { orderBy: 'createdAt', endAt: this.prevBook, limitToFirst: this.limitToShow});
			
		} else { 
			this.directionRight = true;
			this.currentPage = parseInt(params.page); 
			return this.store.query('book', { orderBy: 'createdAt', startAt: this.nextBook, limitToFirst: this.limitToShow});
		}
	},

	setupController(controller, model) {
		if (!Ember.isEmpty(model)){
			if (this.directionRight && this.middleDirection === 'left') {
				if (this.limitToShow === model.toArray().length) { 
						this.prevBook = this.currentBook; 
						this.nextBook = model.popObject().get('createdAt');
						this.stepBook = model.get('firstObject').get('createdAt');
						this.currentBook = model.get('lastObject').get('createdAt');
						
						this.currentPage === 1 ? this._disableButtons(true, false) : this._disableButtons(false, false);
				} else {
					this.prevBook = this.currentBook;
					this.currentBook = model.get('lastObject').get('createdAt');
					this.stepBook = model.get('firstObject').get('createdAt');		
					this._disableButtons(false, true);
				}
			} else if (!this.directionRight && this.middleDirection === 'right') {
				if (this.limitToShow === model.toArray().length) {
					this.nextBook = this.currentBook;
					this.prevBook = model.shiftObject().get('createdAt');
					this.stepBook = model.get('lastObject').get('createdAt');
					this.currentBook = model.get('firstObject').get('createdAt');
					this._disableButtons(false, false);
				} else {
					this.nextBook = this.currentBook;
					this.currentBook = model.get('lastObject').get('createdAt');
					this.stepBook = this.currentBook;
					this._disableButtons(true, false);
				}
			} else if (this.directionRight && this.middleDirection === 'right') { 
				this.middleDirection = 'left';
				
				if (this.limitToShow === model.toArray().length) { 
					this.prevBook = this.stepBook; 
					this.nextBook = model.popObject().get('createdAt'); 
					this.stepBook = model.get('firstObject').get('createdAt');
					this.currentBook = model.get('lastObject').get('createdAt');
					this._disableButtons(true, false);
				} else {
					this.prevBook = this.stepBook;
					this.currentBook = model.get('lastObject').get('createdAt');
					this.stepBook = model.get('firstObject').get('createdAt');
					this._disableButtons(false, true);
				}
			} else if (!this.directionRight && this.middleDirection === 'left') {
				this.middleDirection = 'right';	

				if (this.limitToShow === model.toArray().length) {
					this.nextBook = this.stepBook;
					this.prevBook = model.shiftObject().get('createdAt');
					this.stepBook = model.get('lastObject').get('createdAt');
					this.currentBook = model.get('firstObject').get('createdAt');
					this._disableButtons(false, false);
				} else {
					this.nextBook = this.stepBook;
					this.currentBook = model.get('firstObject').get('createdAt');
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

	//private methods

	_disableButtons(statPrev, statNext) {
		this.prevPageDisable = statPrev;
		this.nextPageDisable = statNext;
	}
});
