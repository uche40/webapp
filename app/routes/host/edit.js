import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  titleToken() {
    return this.get('i18n').t('titles.host.edit');
  },

  renderTemplate: function() {
    this.render('host/form', { controller: 'host.edit' });
  }
});
