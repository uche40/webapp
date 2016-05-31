import Ember from 'ember';
import Validations from 'webapp/validations/review';

const { computed } = Ember;

export default Ember.Controller.extend(Validations, {
  /**
   * Indicates whether the host contact info can be displayed to the current user.
   */
  canSeeContactInfo: computed.readOnly('sessionUser.user.hasNonExpiredMembership'),

  /**
   * Indicates whether the notes about the host should be displayed.
   * Only admin can see host notes.
   */
  showNote: computed.and('model.note', 'sessionUser.user.isAdmin'),

  /**
   * Indicates whether the authenticated user owns the current host profile.
   */
  isCurrentUserProfile: computed('sessionUser.user.id', 'model.user.id', function() {
    return this.get('sessionUser.user.id') === this.get('model.user.id');
  }),

  review: null,
  showReviewModal: false,

  /**
   * Indicates whether the edit profile buttons should be displayed.
   */
  showEditProfileButton: computed.or('sessionUser.user.isAdmin', 'isCurrentUserProfile'),

  /**
   * Disable new review button if the current wwoofer has already reviewed the host.
   */
  disableNewReview: computed('model.reviews.@each.wwoofer.id', 'sessionUser.user.wwoofer.id', function () {
    let wwooferIds = this.get('model.reviews').filterBy('isNew', false).mapBy('wwoofer.id');
    let wwooferId = this.get('sessionUser.user.wwoofer.id');

    return wwooferIds.contains(wwooferId);
  }),

  actions: {
    /**
     * Adds or removes the host to the user's favorites.
     */
    toggleFavorites(host, user) {
      if (host.get('isFavorite')) {
        this.send('removeUserFavorite', host, user);
      } else {
        this.send('addUserFavorite', host, user);
      }
    },
    /**
     * Submits a review for the current host.
     */
    submitReview(review) {
      
      this.validate().then(({ m, validations })=> {

        this.set('didValidate', true);
        if (validations.get('isValid')) {

          this.set('isSubmittingReview', true);

          let promise = review.save();

          promise.then(()=> {
            this.set('reviewText', null);
            this.set('showReviewModal', false);

            this.get('notify').success('Your review was submitted to our team for validation.');
          });

          promise.finally(() => {
            this.set('isSubmittingReview', false);
          });
        } else {
          this.get('notify').error(this.get('i18n').t('notify.submissionInvalid'));
        }
      });
    },
    /**
     * Opens the review modal.
     */
    openReviewModal() {
      let review = this.get('review');
      
      if (!review) {
        let host = this.get('model');
        let wwoofer = this.get('sessionUser.user.wwoofer');

        review = this.store.createRecord('review', {
          recipient: 'host',
          host,
          wwoofer
        });
        
        this.set('review', review);
      }
      
      this.set('showReviewModal', true);
    },

    closeReviewModal() {
      this.set('showReviewModal', false);
    }
  }
});
