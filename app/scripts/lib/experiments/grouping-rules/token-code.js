/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(function(require, exports, module) {
  'use strict';

  const BaseGroupingRule = require('./base');
  const GROUPS = ['control', 'treatment'];

  module.exports = class TokenCodeGroupingRule extends BaseGroupingRule {
    constructor () {
      super();
      this.name = 'tokenCode';
    }

    choose (subject) {
      if (! subject || ! subject.uniqueUserId || ! subject.experimentGroupingRules) {
        return false;
      }
      return this.uniformChoice(GROUPS, subject.uniqueUserId);
    }
  };
});
