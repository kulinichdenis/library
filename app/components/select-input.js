import Ember from 'ember';

export default Ember.Component.extend({
  
  change(event) {
    this.sendAction('action', event.target.value);
  }
});
