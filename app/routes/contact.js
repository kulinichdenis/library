	import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return this.store.createRecord('contact');
	},

	actions: {
		saveContact(contact) {
 			contact.save().then((response) => {
				
				this.controller.set('saveContact', true);
				this.controller.set('model', this.store.createRecord('contact'));
				
				Ember.run.later(() => {
					this.controller.set('saveContact', false);
				}, 3000);	
 			});		
		}
	},

	willTransition() {
    let model = this.controller.get('model');

    if (model.get('isNew')) {
      model.destroyRecord();
    }
  } 
});
