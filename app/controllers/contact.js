import Ember from 'ember';

export default Ember.Controller.extend({
	emailAddress: '',
	emailText: '',
	
	isValidEmail: Ember.computed.match('emailAddress', /^.+@.+\..+$/),
	
	isValidText: Ember.computed.gte('emailText.length', 5),
	
	isDisabled: Ember.computed('isValidText', 'isValidEmail', function(){
		return !((this.get('isValidText') && this.get('isValidEmail')));
	})
});
