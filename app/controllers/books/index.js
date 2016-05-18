import Ember from 'ember';

export default Ember.Controller.extend({
	filtering: '',
	value: Ember.computed('model.@each.title', 'filtering', function(){
		let result = this.get('model');
		let filtering = this.get('filtering');
		const regex = new RegExp((filtering), 'ig');
		if (filtering.length != 0) {
			return result.filter((item) => item.get('title').match(regex));
		} else {
			return result;
		}
	})
});
