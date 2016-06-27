import Ember from 'ember';

export default Ember.Component.extend({
  libraries: Ember.computed('collection.[]', function(){
    let sortedData = this.get('collection').sortBy('name');
    return sortedData.map((item) => {
      return { library: item, isSelected: (item.get('id') === this.get('selected').get('id')) }
    });
  }),
  change(event) {
    this.sendAction('action', event.target.value);
  }
});
