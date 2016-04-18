import Ember from 'ember';

export default Ember.Controller.extend({
	emailAddress: '',

	isValid: Ember.computed.match('emailAddress', /^.+@.+\..+$/),

	isDisabled: Ember.computed.not('isValid'),

	actualEmailAddress: Ember.computed('isDisabled', function() { 	
		return this.get('isDisabled');	
  }),

	actions: {
		saveInvitation(){
			const email = this.get('emailAddress');
			const newInvitation = this.store.createRecord('invitation', {email: email});
			newInvitation.save().then((response) => {
				this.set('responseMessage', `Thank you ! We saved you email with id ${response.get('id')} !`);
				this.set('emailAddress', '');
			}); 
		}
	}
});
