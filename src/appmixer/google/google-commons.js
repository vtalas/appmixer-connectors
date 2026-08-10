'use strict';
const Promise = require('bluebird');
const GoogleApi = require('googleapis');
const gmail = GoogleApi.gmail('v1');
const list = Promise.promisify(gmail.users.messages.list, { context: gmail.users.messages });

module.exports = {
  get GoogleApi() {
    return GoogleApi;
  },

  ERROR_MAP: {
    'Invalid query parameter value for grid_id.':
      'Invalid worksheet id! ' +
      'Possible solution, stop the flow, select valid existing worksheet in NewRow component, start flow again.'
  },

  getOauth2Client(auth) {
    let { clientId, clientSecret, callback, accessToken } = auth;
    let OAuth2 = GoogleApi.auth.OAuth2;
    let oauth2Client = new OAuth2(clientId, clientSecret, callback);

    oauth2Client.credentials = {
      access_token: accessToken
    };

    return oauth2Client;
  },

  /**
   * Function compares two hexadecimal numbers (used as ID in gmail messages), this
   * function can be used for Array.prototype.sort() method.
   * Use Array.prototype.sort(commons.compareIds(a, b)) for ASC and
   * Array.prototype.sort(commons.compareIds(a, b)) for DESC.
   * @param {string} a - hexadecimal number
   * @param {string} b - hexadecimal number
   * @returns {number} - returns -1 if a < b, 1, if a > b and 0 if numbers are equal
   */
  compareIds(a, b) {
    let ax = parseInt(a, 16);
    if (isNaN(ax)) {
      throw new Error('First value: ' + a + ' is not a hexadecimal number');
    }

    let bx = parseInt(b, 16);
    if (isNaN(bx)) {
      throw new Error('Second value ' + b + ' is not a hexadecimal number');
    }

    if (ax < bx) {
      return -1;
    }
    if (ax > bx) {
      return 1;
    }

    return 0;
  },

  /**
   * This is used in NewEmail and NewAttachment component to compare email(message)
   * ids and return list of new emails(messages).
   * @param {string} latestMessageId
   * @param {Array} messages
   * @return {Array}
   */
  getNewMessages(latestMessageId, messages) {
    let differences = [];

    messages.sort((a, b) => {
      // sort the messages according to id DESC. It should already be sorted that
      // way, but docs does not say anything about it so just to be sure
      return -this.compareIds(a.id, b.id);
    });

    for (let i = 0; i < messages.length; i++) {
      let message = messages[i];
      if (this.compareIds(message.id, latestMessageId) === 1) {
        differences.push(message);
      } else {
        return differences;
      }
    }

    return differences;
  },

  /**
   * Return true when email is new email. It skips plain SENT and DRAFT messages - messages with
   * only one label and SENT or DRAFT being that label.
   * @param {Array} labelIds
   * @return {boolean}
   * @throws Error
   */
  isNewInboxEmail(labelIds) {
    if (!Array.isArray(labelIds)) {
      throw new Error('Invalid label IDs array.');
    }

    return labelIds.length !== 1 || (labelIds.indexOf('SENT') === -1 && labelIds.indexOf('DRAFT') === -1);
  },

  /**
   * Get recursively all message IDs based on options.
   * @param {Object} options
   * @param {Object} options.auth - checkout google doc
   * @param {string} options.userId - checkout google doc
   * @param {string} options.quotaUser - checkout google doc
   * @param {number} [options.maxResults] - how many messages per page (request)
   * @param {Array} [options.labelIds]
   * @param result
   * @return {Array} [{
   *    id,
   *    threadId
   * }]
   */
  getAllMessageIds(options, result = []) {
    options.maxResults = options.maxResults || 300;
    return list(options).then((response) => {
      if (!response.messages) {
        return result;
      }
      result = result.concat(response.messages);
      if (response.nextPageToken) {
        return this.getAllMessageIds(Object.assign(options, { pageToken: response.nextPageToken }), result);
      }
      return result;
    });
  },

  /**
   * Convert google's date|dateTime object into Date.
   * @param {Object} dateObject - containing either date or dateTime
   * @return {Date|*}
   */
  formatDate(dateObject) {
    if (!dateObject) {
      return dateObject;
    }
    return new Date(dateObject.date ? dateObject.date : dateObject.dateTime);
  }
};
