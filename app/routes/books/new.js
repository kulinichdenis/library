import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      book: this.store.createRecord('book'),
      libraries: this.store.findAll('library')
    })
  },

  setupController(controller, model){
    controller.set('model', model.book);
    controller.set('libraries', model.libraries);
  },

  actions: {
    selectLibrary(param) {
      let model = this.controller.get('model');
      model.set('library_item', param);
    },

    saveBook(book) {
      let library = this.store.peekRecord('library', book.library_item)
      library.get('books').pushObject(book);
      book.save();
    }
  }
});
