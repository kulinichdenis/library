import Ember from 'ember';

export default Ember.Controller.extend({
	emailAddress: '',
	
	emailText: '',
	
	isValidEmail: Ember.computed.match('emailAddress', /^.+@.+\..+$/),
	
	isValidText: Ember.computed.notEmpty('emailText'),
	
	isDisabled: Ember.computed('isValidText', 'emailAddress', function(){
		console.log(this.get('isValidText'))
		//return !(this.get('isValidText') && this.get('isValidEmail'));
		//sada
	})
});
