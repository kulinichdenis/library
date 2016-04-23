import Ember from 'ember';

export default Ember.Controller.extend({
	emailAddress: '',
	emailText: '',
	
	isValidEmail: Ember.computed.match('emailAddress', /^.+@.+\..+$/),
	
	isValidText: Ember.computed.gte('emailText.length', 5),
	
	isDisabled: Ember.computed('isValidText', 'isValidEmail', function(){
		return !((this.get('isValidText') && this.get('isValidEmail')));
	}),

	actions: {
		saveContact(){
			let newContact = this.store.createRecord('contact', { email: this.get('emailAddress'), message: this.get('emailText')});
 			newContact.save().then((response) => {
 				this.set('emailAddress', '');
 				this.set('emailText', '');
 				this.set('saveContact', true);
 				Ember.run.later(() => {
 					this.set('saveContact', false)
 				}, 3000);	
 			});		
		}
	}
});
