import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return this.store.findAll('invitation');
	},
	
	actions: {
		deleteInvitation(invitation) {
			invitation.destroyRecord();
		}
	}
});
