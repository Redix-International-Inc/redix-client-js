# Redix Client SDK for Node.js

**Node.js SDK for the Redix Healthcare Data Conversion REST API**

The Redix Client SDK for Node.js provides a powerful interface to interact with the Redix Healthcare Data Conversion REST API. Convert EDI, HL7, XML, CSV, PDF, and other healthcare data formats into standardized outputs. It supports batch processing, file staging, management, and job tracking, requiring a running Redix Engine/REST API backend.

## Quick Start

Get started with a simple file conversion:

```javascript
const { RedixClient } = require('@redix/redix-client');

async function quickStart() {
  const client = new RedixClient({ baseUrl: 'https://redix.com/api/v1', apiKey: 'your-api-key' });
  const result = await client.convertFileUpload({ 
    inputFile: '/path/to/claim.txt', 
    ifdFile: '/path/to/rule.ifd', 
    ofdFile: '/path/to/rule.ofd', 
    conversionFlag: 'x', 
    warningLevel: 1 
  });
  console.log('Result:', result);
}
quickStart().catch(console.error);
```

*Note*: All SDK methods are asynchronous and return Promises. Use `async/await` or `.then().catch()` for handling responses.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage Example](#usage-example)
- [File Upload Example (cURL)](#file-upload-example-curl)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [TypeScript Support](#typescript-support)
- [Support](#support)
- [License](#license)
- [Version](#version)

## Prerequisites

- **Node.js**: Version 18.0.0 or higher.
- **Redix Backend**: A running Redix Engine/REST API instance (e.g., at `https://redix.com/api/v1`) with a valid API key. See [Redix Developer Portal](https://redix.com/developer) for setup instructions.
- **Dependencies**: Automatically installed via npm, including `axios` and `form-data`.

## Installation

Install the SDK via npm:

```bash
npm install @redix/redix-client
```

## Usage Example

### CommonJS

```javascript
const { RedixClient } = require('@redix/redix-client');

async function main() {
  const client = new RedixClient({
    baseUrl: 'https://redix.com/api/v1',
    apiKey: 'your-api-key-here',
  });

  try {
    const result = await client.convertFileUpload({
      inputFile: '/path/to/claim.txt',
      ifdFile: '/path/to/rule.ifd',
      ofdFile: '/path/to/rule.ofd',
      conversionFlag: 'x', // X12
      warningLevel: 1,     // Continue with warnings
      userData: 'user123',
      segmentTerminator: 'new line',
      elementSeparator: '*',
      compositeSeparator: ':',
      releaseCharacter: '?',
    });
    console.log('Conversion Result:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

### ES Modules

Add `"type": "module"` to your `package.json`, then:

```javascript
import { RedixClient } from '@redix/redix-client';

async function main() {
  const client = new RedixClient({
    baseUrl: 'https://redix.com/api/v1',
    apiKey: 'your-api-key-here',
  });

  // Usage remains the same
}

main();
```

*Note*: All SDK methods are asynchronous and return Promises. Use `async/await` or `.then().catch()` for handling responses.

## File Upload Example (cURL)

```bash
curl -X POST http://localhost:8000/api/v1/convert/file-upload \
  -F "Input_File=@/path/to/input.txt" \
  -F "IFD_File=@/path/to/map.ifd" \
  -F "OFD_File=@/path/to/map.ofd" \
  -F "conversionFlag=x" \
  -F "warningLevel=1" \
  -H "X-API-Key: secret"
```

*Note*: This cURL command targets the Redix Engine/REST API backend endpoint, not the SDK itself. Ensure the backend is running at the specified URL. Parameter names (`Input_File`, etc.) match the server expectation based on `index.js`.

## API Reference

The Redix Client SDK provides the following methods via the `RedixClient` class:

- **`healthCheck()`**: Performs a health check on the Redix API.
  - **Returns**: Promise resolving to an object with API status.
  - **Example**:
    ```javascript
    const status = await client.healthCheck();
    console.log('API Status:', status);
    ```

- **`getFormOptions()`**: Gets dynamic options for the conversion form.
  - **Returns**: Promise resolving to an object with form options.
  - **Example**:
    ```javascript
    const options = await client.getFormOptions();
    console.log('Form Options:', options);
    ```

- **`listUserFiles(limit)`**: Lists recent conversion files.
  - **Parameters**: `limit` (number, optional, default: 50).
  - **Returns**: Promise resolving to an object with files array.
  - **Example**:
    ```javascript
    const files = await client.listUserFiles(50);
    console.log('User Files:', files);
    ```

- **`listServerFiles(path, include_dirs)`**: Lists files and directories in SHARED_DIR.
  - **Parameters**: `path` (string, optional, default: ''), `include_dirs` (boolean, optional, default: false).
  - **Returns**: Promise resolving to an object with files array.
  - **Example**:
    ```javascript
    const files = await client.listServerFiles('', false);
    console.log('Server Files:', files);
    ```

- **`listStagingFiles()`**: Lists files in the staging directory.
  - **Returns**: Promise resolving to an object with files array.
  - **Example**:
    ```javascript
    const files = await client.listStagingFiles();
    console.log('Staging Files:', files);
    ```

- **`listStagingProfiles()`**: Lists available staging profiles.
  - **Returns**: Promise resolving to a `StagingProfilesResponse` object.
  - **Example**:
    ```javascript
    const profiles = await client.listStagingProfiles();
    console.log('Staging Profiles:', profiles);
    ```

- **`uploadToStaging(filePath)`**: Uploads a file to the staging directory.
  - **Parameters**: `filePath` (string).
  - **Returns**: Promise resolving to an `UploadResponse` object.
  - **Example**:
    ```javascript
    const result = await client.uploadToStaging('/path/to/file.txt');
    console.log('Upload Result:', result);
    ```

- **`deleteFromStaging(filename)`**: Deletes a file from the staging directory.
  - **Parameters**: `filename` (string).
  - **Returns**: Promise resolving to a `FileDeleteResponse` object.
  - **Example**:
    ```javascript
    const result = await client.deleteFromStaging('file.txt');
    console.log('Delete Result:', result);
    ```

- **`convertFileUpload(options)`**: Uploads and converts a single file.
  - **Options**: `inputFile` (string path), `ifdFile` (string path), `ofdFile` (string path), `conversionFlag` (e.g., 'x' for X12), `warningLevel` (0-2), `userData` (optional), `segmentTerminator`, `elementSeparator`, `compositeSeparator`, `releaseCharacter`.
  - **Returns**: Promise resolving to a `ConversionResponse` object.
  - **Example**: See "Usage Example" above.

- **`convertStagingFile(options)`**: Converts a file in staging.
  - **Options**: `stagedFilename` (string), `configProfile` (string, optional), `userData` (string, optional).
  - **Returns**: Promise resolving to a `ConversionResponse` object.
  - **Example**:
    ```javascript
    const result = await client.convertStagingFile({ stagedFilename: 'staged.txt', configProfile: 'x12_837P_default_profile' });
    console.log('Conversion Result:', result);
    ```

- **`batchConvertFolder(options)`**: Initiates batch processing.
  - **Options**: `inputSubfolder` (string), `configProfile` (string), `outputSubfolder` (optional), `userData` (optional).
  - **Returns**: Promise resolving to `{ job_id: string; status?: string }`.
  - **Example**:
    ```javascript
    const result = await client.batchConvertFolder({ inputSubfolder: 'batch_input', configProfile: 'x12_837_default_profile' });
    console.log('Batch Job ID:', result.job_id);
    ```

- **`getBatchStatus(jobId)`**: Retrieves batch job status.
  - **Parameters**: `jobId` (string).
  - **Returns**: Promise resolving to a `BatchStatusResponse` object.
  - **Example**:
    ```javascript
    const status = await client.getBatchStatus('123');
    console.log('Status:', status.status);
    ```

- **`listBatchJobs(options)`**: Lists batch jobs with filters.
  - **Options**: `status`, `configProfile`, `startDate`, `endDate`, `limit`, `offset`.
  - **Returns**: Promise resolving to an array of `BatchJobSummary` objects.
  - **Example**:
    ```javascript
    const jobs = await client.listBatchJobs({ limit: 10 });
    console.log('Batch Jobs:', jobs);
    ```

- **`getBatchJobsSummary(options)`**: Provides aggregate batch job statistics.
  - **Options**: `startDate`, `endDate`, `configProfile`.
  - **Returns**: Promise resolving to a `BatchSummaryResponse` object.
  - **Example**:
    ```javascript
    const summary = await client.getBatchJobsSummary();
    console.log('Batch Summary:', summary);
    ```

- **`getBatchJobLogs(jobId, options)`**: Retrieves logs for a batch job.
  - **Options**: `limit`, `offset`, `logLevel`.
  - **Returns**: Promise resolving to an array of `BatchLog` objects.
  - **Example**:
    ```javascript
    const logs = await client.getBatchJobLogs('123', { limit: 50 });
    console.log('Batch Logs:', logs);
    ```

- **`getBatchFileDetail(jobId, filename)`**: Gets details for a specific file in a batch job.
  - **Returns**: Promise resolving to a `BatchFileDetail` object.
  - **Example**:
    ```javascript
    const detail = await client.getBatchFileDetail('123', 'claim.txt');
    console.log('File Detail:', detail);
    ```

- **`downloadGeneratedFile(fileType, filename)`**: Downloads a generated file.
  - **Returns**: Promise resolving to a `Buffer`.
  - **Example**:
    ```javascript
    const buffer = await client.downloadGeneratedFile('output', 'claim.txt');
    fs.writeFile('downloaded.txt', buffer, (err) => console.log(err || 'Saved'));
    ```

- **`viewGeneratedFile(fileType, filename)`**: Views the content of a generated file as plain text.
  - **Returns**: Promise resolving to a `FileViewResponse` object.
  - **Example**:
    ```javascript
    const content = await client.viewGeneratedFile('output', 'claim.txt');
    console.log('File Content:', content.content);
    ```

- **`getEngineInfo()`**: Gets information about the Redix engine installation.
  - **Returns**: Promise resolving to an object with engine details.
  - **Example**:
    ```javascript
    const info = await client.getEngineInfo();
    console.log('Engine Info:', info);
    ```

- **More Details**: See the [generated API documentation](./docs/index.html) (generated with `npm run docs`).

## Error Handling

The SDK throws `RedixAPIError` for API failures. Handle it as follows:

```javascript
const { RedixAPIError } = require('@redix/redix-client');

try {
  await client.getBatchStatus('invalid-id');
} catch (error) {
  if (error instanceof RedixAPIError) {
    console.error(`API Error ${error.status_code}: ${error.message}`);
  }
}
```

## TypeScript Support

This SDK includes TypeScript definitions in `src/index.d.ts`. Use with TypeScript projects:

```typescript
import { RedixClient } from '@redix/redix-client';

const client: RedixClient = new RedixClient({
  baseUrl: 'https://redix.com/api/v1',
  apiKey: 'your-key',
});

const result = await client.convertFileUpload({
  inputFile: '/path/to/claim.txt',
  ifdFile: '/path/to/rule.ifd',
  ofdFile: '/path/to/rule.ofd',
  conversionFlag: 'x',
  warningLevel: 1,
});
```

## Support

- **Email**: [support@redix.com](mailto:support@redix.com)
- **Issues**: [GitHub Issues](https://github.com/Redix-International-Inc/redix-client-js/issues)

## License

This project is licensed under the [MIT License](LICENSE). See the `LICENSE` file for details.

## Version

- Current Version: 0.2.2
- [![npm version](https://img.shields.io/npm/v/@redix/redix-client.svg)](https://www.npmjs.com/package/@redix/redix-client)
- Check the [npm package page](https://www.npmjs.com/package/@redix/redix-client) for updates.


