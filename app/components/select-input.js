import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'select',

  change(event) {
    this.sendAction('action', event.target.value)
  }
});
