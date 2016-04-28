import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('book')
  },

  actions: {
    deleteBook(book) {
      book.get('author').then((prevAuthor) => {
        prevAuthor.get('books').removeObject(book);
        prevAuthor.save();
      });

      book.get('library').then((prevLibrary) => {
        prevLibrary.get('books').removeObject(book);
        prevLibrary.save();
      });
      book.destroyRecord();
    }
  }
});
