import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {
     this._super(...arguments);
     this.$('.modal').modal().on('hidden.bs.modal', () => {
       this.sendAction('closeModal');
     })
  },

  actions: {
    save(item) {
      this.$('.modal').modal('hide');
      this.sendAction('submit', item);
    }
  }
});
