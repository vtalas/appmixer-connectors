'use strict';
const axios = require('axios');
const google = require('googleapis');
const commons = require('../../drive-commons');

module.exports = {
  async receive(context) {
    let { isToken, file } = context.messages.in.content;

    if (isToken) {
      return context.sendJson(commons.getCredentials(context.auth), 'out');
    }

    const auth = commons.getOauth2Client(context.auth);
    const drive = google.drive({ version: 'v3', auth });

    if (typeof file === 'string') {
      const { data } = await drive.files.get({
        fileId: file,
        fields: 'id, name, mimeType'
      });

      file = data;
    }

    let response;
    let { id, name, mimeType } = file;

    if (mimeType.indexOf('vnd.google-apps') !== -1) {
      let format = commons.defaultExportFormats[file.mimeType] || {
        extension: 'pdf',
        mimeType: 'application/pdf'
      };
      format.extension = 'csv';
      format.mimeType = 'text/csv';

      const extension = format.extension;
      mimeType = format.mimeType;

      name += `.${extension}`;

      response = await drive.files.export(
        {
          fileId: id,
          mimeType
        },
        { responseType: 'stream' }
      );
      const stream = await axios({
        method: 'get',
        url: response.uri.href,
        headers: response.headers,
        responseType: 'stream'
      });

      const { fileId } = await context.saveFileStream(name, stream.data);
      return context.sendJson(
        {
          fileId,
          fileName: name,
          mimeType
        },
        'out'
      );
    }
  }
};
