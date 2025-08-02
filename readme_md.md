# Redix Healthcare Data Conversion SDK

A Node.js SDK for interacting with the Redix Healthcare Data Conversion REST API. This SDK provides a simple and intuitive interface for converting healthcare data between different formats, including EDI X12, HIPAA, and other healthcare standards.

## Features

- 🏥 **Healthcare Data Conversion**: Convert between EDI X12, HIPAA, and other healthcare formats
- 📁 **File Management**: Upload, download, and manage files in staging areas
- 🔄 **Batch Processing**: Process multiple files asynchronously with job tracking
- 📊 **Job Monitoring**: Track conversion status, logs, and detailed reports
- 🛡️ **Error Handling**: Comprehensive error handling with custom exception types
- 📝 **TypeScript Support**: Full TypeScript definitions included
- 🧪 **Well Tested**: Comprehensive test suite included

## Installation

```bash
npm install @redix/redix-client
```

## Quick Start

```javascript
const { RedixClient } = require('@redix/redix-client');

// Initialize the client
const client = new RedixClient({
    baseUrl: 'https://your-redix-api.com',
    apiKey: 'your-api-key'
});

// Check API health
async function checkHealth() {
    try {
        const response = await client.healthCheck();
        console.log('API is healthy:', response.data);
    } catch (error) {
        console.error('Health check failed:', error.message);
    }
}

// Convert a file from staging
async function convertFile() {
    try {
        const result = await client.convertStagingFile({
            stagedFilename: 'input.edi',
            configProfile: 'x12_837P_default_profile'
        });
        console.log('Conversion successful:', result.data);
    } catch (error) {
        console.error('Conversion failed:', error.message);
    }
}
```

## API Reference

### Client Initialization

```javascript
const client = new RedixClient({
    baseUrl: 'https://your-redix-api.com',
    apiKey: 'your-api-key'
});
```

### File Management

#### Upload file to staging
```javascript
await client.uploadToStaging('/path/to/file.edi');
```

#### List staging files
```javascript
const files = await client.listStagingFiles();
```

#### Delete file from staging
```javascript
await client.deleteFromStaging('filename.edi');
```

#### List available staging profiles
```javascript
const profiles = await client.listStagingProfiles();
```

### File Conversion

#### Convert file with direct upload
```javascript
const result = await client.convertFileUpload({
    inputFile: '/path/to/input.edi',
    ifdFile: '/path/to/input-format.ifd',
    ofdFile: '/path/to/output-format.ofd',
    conversionFlag: 'e',
    warningLevel: 1
});
```

#### Convert staged file
```javascript
const result = await client.convertStagingFile({
    stagedFilename: 'input.edi',
    configProfile: 'x12_837P_default_profile',
    userData: 'optional-user-data'
});
```

### Batch Processing

#### Start batch conversion
```javascript
const job = await client.batchConvertFolder({
    inputSubfolder: 'batch-input',
    configProfile: 'x12_837P_default_profile',
    outputSubfolder: 'batch-output'
});
console.log('Job ID:', job.data.job_id);
```

#### Monitor batch job status
```javascript
const status = await client.getBatchStatus('job-id-123');
console.log('Job status:', status.data.status);
```

#### List batch jobs
```javascript
const jobs = await client.listBatchJobs({
    status: 'COMPLETED',
    limit: 10,
    startDate: '2024-01-01'
});
```

#### Get batch job logs
```javascript
const logs = await client.getBatchJobLogs('job-id-123', {
    limit: 50,
    logLevel: 'ERROR'
});
```

#### Get file details from batch job
```javascript
const details = await client.getBatchFileDetail('job-id-123', 'filename.edi');
```

### File Access

#### Download generated file
```javascript
const fileData = await client.downloadGeneratedFile('output', 'converted-file.txt');
```

#### View file content
```javascript
const content = await client.viewGeneratedFile('output', 'converted-file.txt');
console.log(content.data.content);
```

### System Information

#### Get engine information
```javascript
const info = await client.getEngineInfo();
console.log('Engine version:', info.data);
```

#### Get form options
```javascript
const options = await client.getFormOptions();
console.log('Available options:', options.data);
```

## Configuration Profiles

The Redix API supports predefined configuration profiles for common conversion scenarios. These profiles are defined on the server and include settings like:

- Conversion flags
- Input/Output format definitions (IFD/OFD files)
- Segment terminators and separators
- Warning levels

Example profiles:
- `x12_837P_default_profile` - For X12 837P professional claims
- `rmap_834_to_834` - For 834 enrollment files
- `837i_to_ub04_pdf` - Convert institutional claims to PDF

## Error Handling

The SDK includes comprehensive error handling with custom exception types:

```javascript
const { RedixAPIError } = require('@redix/redix-client');

try {
    await client.getBatchStatus('invalid-job-id');
} catch (error) {
    if (error instanceof RedixAPIError) {
        console.error(`API Error ${error.status_code}: ${error.message}`);
    } else {
        console.error('Unexpected error:', error.message);
    }
}
```

## TypeScript Support

The SDK includes full TypeScript definitions:

```typescript
import { RedixClient, RedixAPIError, ConversionResponse } from '@redix/redix-client';

const client = new RedixClient({
    baseUrl: 'https://your-redix-api.com',
    apiKey: 'your-api-key'
});

const result: ConversionResponse = await client.convertStagingFile({
    stagedFilename: 'input.edi',
    configProfile: 'x12_837P_default_profile'
});
```

## File Types

The SDK supports various file types for download and viewing:

- `input` - Original input files
- `output` - Converted output files  
- `error` - Error reports and logs
- `ack` - Acknowledgment files
- `ta1` - TA1 interchange acknowledgments
- `staging` - Files in staging area
- `shared` - Shared directory files
- `archive` - Archived processed files

## Requirements

- Node.js >= 18.0.0
- Valid Redix API endpoint and API key

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Documentation

```bash
npm run docs
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT

## Support

For support with the Redix Healthcare Data Conversion API or this SDK:

- Visit: [Redix International](https://redix.com)
- Email: sales@redix.com
- Documentation: Check your API server's `/docs` endpoint for interactive API documentation

## Changelog

### 0.2.2
- Initial release
- Full API coverage for Redix Healthcare Data Conversion API
- TypeScript definitions included
- Comprehensive test suite
- Error handling with custom exceptions