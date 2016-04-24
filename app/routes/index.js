import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return this.store.createRecord('invitation');
	},

	actions: {
		saveInvitation(newInvitation){
			newInvitation.save().then((response) => {
				this.controller.set('responseMessage', `Thank you ! We saved you email with id ${response.get('id')} !`);			
			});
			this.controller.set('model', this.store.createRecord('invitation'));
			Ember.run.later(() => {
				this.controller.set('responseMessage', false); 
			}, 2000);
		},

		willTransition() {
			let model = this.controller.get('model');
			if (model.get('isNew')) {
				model.destroyRecord();		
			}
		}
	}
});
