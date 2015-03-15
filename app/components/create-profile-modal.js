/**
 * Ember component for create profile modal
 */
import Ember from 'ember';

export default Ember.Component.extend({
    hasBeendisplayed : false,

    displayed: function () {
        if (this.get('session.user.wwoofer.id') == null && this.get('session.user.host.id') == null && this.get('hasBeendisplayed') === false)
        {
            $('#createprofileModal').modal('show');
            this.set('hasBeendisplayed', true);
            return true;
        }
    }.observes('session.user.wwoofer.id', 'session.user.host.id'),

    actions : {
        close: function () {
            $('#createprofileModal').modal('hide');
        }
    }
});
