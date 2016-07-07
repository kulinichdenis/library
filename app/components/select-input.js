import Ember from 'ember';

export default Ember.Component.extend({
  libraries: Ember.computed('collection.[]', function(){
    let sortedData = this.get('collection').sortBy('name');
    return sortedData.map((item) => {
      let selectLibrary;
        if (this.get('selected')) {
          selectLibrary = this.get('selected').get('id');
        } else {
          selectLibrary = 0;
        }
      return { library: item, isSelected: (item.get('id') === selectLibrary) }
    });
  }),
  change(event) {
    this.sendAction('action', event.target.value);
  }
});
