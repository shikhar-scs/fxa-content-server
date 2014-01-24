/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

define([
  'underscore',
  'views/base',
  'stache!templates/settings',
  'lib/fxa-client',
  'lib/session',
  'lib/password-mixin'
],
function (_, BaseView, Template, FxaClient, Session, PasswordMixin) {
  var View = BaseView.extend({
    // user must be authenticated to see Settings
    mustAuth: true,

    template: Template,
    className: 'settings',

    context: function () {
      return {
        email: Session.email
      };
    },

    events: {
      'submit form': 'changePassword',
      'keyup input': 'enableButtonWhenValid',
      'change input': 'enableButtonWhenValid',
      'click #signout': 'signOut',
      'change .show-password': 'onPasswordVisibilityChange'
    },

    isValid: function () {
      if (! (this.isElementValid('#old_password') &&
             this.isElementValid('#new_password'))) {
        return false;
      }

      // require the passwords to be different
      return this._getOldPassword() !== this._getNewPassword();
    },

    changePassword: function (event) {
      if (event) {
        event.preventDefault();
      }

      if (! this.isValid()) {
        return;
      }

      var email = Session.email;
      var oldPassword = this._getOldPassword();
      var newPassword = this._getNewPassword();

      var self = this;
      var client = new FxaClient();
      client.changePassword(email, oldPassword, newPassword)
            .then(function () {
              self.$('.success').show();
              // used for testing.
              self.trigger('password-changed');
            }, function (err) {
              self.displayError(err.msg || err.message);
            });
    },

    _getOldPassword: function () {
      return this.$('#old_password').val();
    },

    _getNewPassword: function () {
      return this.$('#new_password').val();
    },

    signOut: function (event) {
      if (event) {
        event.preventDefault();
      }

      var client = new FxaClient();
      var self = this;
      client.signOut()
            .then(function () {
              self.router.navigate('signin', { trigger: true });
            }, function (err) {
              self.displayError(err.msg || err.message);
            });
    }
  });

  _.extend(View.prototype, PasswordMixin);

  return View;
});
