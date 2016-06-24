import Ember from 'ember';

export default Ember.Component.extend({
  libraries: Ember.computed('collection', function(){
    return this.get('collection').map((item) => {
       return { library: item, isSelected: Ember.isEqual(item.id, this.get('selected').id) }
    });
  }),
  change(event) {
    this.sendAction('action', event.target.value);
  }
});
