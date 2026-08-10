'use strict';
const Promise = require('bluebird');
const deepObjectDiff = require('deep-object-diff');
const google = require('googleapis');
const _ = require('lodash');
const commons = require('../../google-commons');

/**
 * Add headers to row cells.
 * @param {Array} headers - first row in sheet.
 * @param {Array} row
 * @return {Object}
 */
function addHeaders(headers, row) {
  let res = {};
  headers.forEach((header, index) => {
    res[header] = row[index] || '';
  });
  return res;
}

module.exports = {
  async tick(context) {
    const sheets = google.sheets('v4');
    const newRow = Promise.promisify(sheets.spreadsheets.values.get, { context: sheets.spreadsheets.values });
    const res = await newRow({
      auth: commons.getOauth2Client(context.auth),
      spreadsheetId: context.properties.sheetId,
      range: context.properties.worksheetId.split('/')[1],
      majorDimension: 'ROWS'
    });
    const allAtOnce = context.properties.allAtOnce;

    let data = res['values'] || [];

    let known = Array.isArray(context.state.known) ? context.state.known : [];

    const diff = deepObjectDiff.detailedDiff(known, data);
    //data.forEach(processRows.bind(null, known, current, diff));

    await context.saveState({ known: data });

    if (allAtOnce && (!_.isEmpty(diff.updated) || !_.isEmpty(diff.added) || !_.isEmpty(diff.deleted))) {
      return context.sendJson(diff, 'changed');
    }

    if (!_.isEmpty(diff.updated)) {
      delete diff.updated['0'];
      // we need to get the full row not only the changed cells
      const rows = _.map(diff.updated, (v, k) => {
        return data[k];
      });
      await Promise.map(rows, (row) => {
        return context.sendJson(addHeaders(res['values'][0], row), 'updated');
      });
      await Promise.map(rows, (row) => {
        return context.sendJson(addHeaders(res['values'][0], row), 'changed');
      });
    }
    if (!_.isEmpty(diff.added)) {
      // ignore the first row
      delete diff.added['0'];
      const rows = _.map(diff.added, (v) => v);
      await Promise.map(rows, (row) => {
        return context.sendJson(addHeaders(res['values'][0], row), 'added');
      });
      await Promise.map(rows, (row) => {
        return context.sendJson(addHeaders(res['values'][0], row), 'changed');
      });
    }
    if (!_.isEmpty(diff.deleted)) {
      delete diff.deleted['0'];
      // we need to get the full row that was deleted
      const rows = _.map(diff.deleted, (v, k) => {
        return known[k];
      });
      await Promise.map(rows, (row) => {
        return context.sendJson(addHeaders(res['values'][0], row), 'deleted');
      });
    }
  }
};
