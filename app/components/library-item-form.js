import Ember from 'ember';

export default Ember.Component.extend({
  buttonLabeL: 'Save',
  actions: {
    buttonClicked(param) {
      this.sendAction('action', param);
    }
  }
});
