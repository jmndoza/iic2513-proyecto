// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage');

module.exports.uploadStorage = (bucketName, filename, usermMail) => {
  // [START storage_upload_file]
  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const bucketName = 'Name of a bucket, e.g. my-bucket';
  // const filename = 'Local file to upload, e.g. ./local/path/to/file.txt';

  // Creates a client
  const storage = new Storage();
  async function uploadFile() {
    // Uploads a local file to the bucket
    const upload = await storage.bucket(bucketName).upload(filename, {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      destination: `profile-${usermMail}`,
      // By setting the option `destination`, you can change the name of the
      // object you are uploading to a bucket.
      metadata: {
        // Enable long-lived HTTP caching headers
        // Use only if the contents of the file will never change
        // (If the contents will change, use cacheControl: 'no-cache')
        cacheControl: 'public, max-age=31536000',
        contentType: 'image/jpeg',
      },
    });
    const [file] = upload;
    file.makePublic();
    return file.metadata;
  }

  // eslint-disable-next-line no-console
  return uploadFile().catch(console.error);
  // [END storage_upload_file]
};
