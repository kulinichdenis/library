import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  message: DS.attr('string'),

  isValidEmail: Ember.computed.match('email', /^.+@.+\..+$/),
	
	isValidText: Ember.computed.gte('message.length', 5),
	
	isDisabled: Ember.computed('isValidText', 'isValidEmail', function(){
		return !((this.get('isValidText') && this.get('isValidEmail')));
	})
});
