import Ember from 'ember';

export default Ember.Controller.extend({
	emailAddress: '',

	// isValid: Ember.computed.match('emailAddress', /^.+@.+\..+$/),

	// isDisabled: Ember.computed.not('isValid'),

	actualEmailAddress: Ember.computed('emailAddress', function() { 
    console.log('dsadasd');
    console.log('actualEmailAddress function is called: ', this.get('emailAddress'));
  }),

	// emailAddressChanged: Ember.observer('emailAddress', function(){
	// 	console.log('observer is called', this.get('emailAddress'))
	// }),

	actions: {
		saveInvitation(){
			alert('test')
			this.set('responseMessage', 'error')
			this.set('emailAddress', '')
		}
	}

});
