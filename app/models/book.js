import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  createdAt: DS.attr('number', {
    defaultValue: function() { return new Date(); }
  }),	
  library: DS.belongsTo('library')
  // author: DS.belongsTo('author')
});
