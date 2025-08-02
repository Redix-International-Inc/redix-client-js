// index.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { RedixAPIError } = require('./exceptions');

/**
 * @class RedixClient
 * @description A client for the Redix Healthcare Data Conversion REST API.
 */
class RedixClient {
  /**
     * @param {Object} options
     * @param {string} options.baseUrl The base URL of the Redix API.
     * @param {string} options.apiKey The API key for authentication.
     */
  constructor({ baseUrl, apiKey }) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          const { status, data } = error.response;
          const message = data.detail || data.message || 'An unknown error occurred.';
          throw new RedixAPIError(status, message);
        }
        throw error;
      }
    );
  }

  async healthCheck() {
    return this.client.get('/');
  }

  async getFormOptions() {
    return this.client.get('/api/v1/form-options');
  }

  async listUserFiles(limit = 50) {
    return this.client.get('/api/v1/files', { params: { limit } });
  }

  async listServerFiles(path = '', include_dirs = false) {
    return this.client.get('/api/v1/server-files', { params: { path, include_dirs } });
  }

  async listStagingFiles() {
    return this.client.get('/api/v1/staging-files');
  }

  async listStagingProfiles() {
    return this.client.get('/api/v1/staging-profiles');
  }

  async uploadToStaging(filePath) {
    const formData = new FormData();
    const filename = path.basename(filePath);
    formData.append('file', fs.createReadStream(filePath), filename);
    return this.client.post('/api/v1/staging/upload', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
  }

  async deleteFromStaging(filename) {
    return this.client.delete(`/api/v1/staging/${filename}`);
  }

  async convertFileUpload({
    inputFile,
    ifdFile,
    ofdFile,
    conversionFlag = 'e',
    warningLevel = 1,
    userData = '',
    segmentTerminator = 'new line',
    elementSeparator = '*',
    compositeSeparator = ':',
    releaseCharacter = '?'
  }) {
    const formData = new FormData();
    formData.append('Input_File', fs.createReadStream(inputFile), path.basename(inputFile));
    formData.append('IFD_File', fs.createReadStream(ifdFile), path.basename(ifdFile));
    formData.append('OFD_File', fs.createReadStream(ofdFile), path.basename(ofdFile));
    formData.append('Conversion_Flag', conversionFlag);
    formData.append('WarningLevel', warningLevel);
    formData.append('User_Data', userData);
    formData.append('Segment_Terminator', segmentTerminator);
    formData.append('Element_Separator', elementSeparator);
    formData.append('Composite_Separator', compositeSeparator);
    formData.append('Release_Character', releaseCharacter);

    return this.client.post('/api/v1/convert/file-upload', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
  }

  async convertStagingFile({ stagedFilename, configProfile = null, userData = null }) {
    const formData = new FormData();
    formData.append('Staged_Filename', stagedFilename);
    if (configProfile) formData.append('Config_Profile', configProfile);
    if (userData !== null) formData.append('User_Data', userData);

    return this.client.post('/api/v1/convert/staging-file', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
  }

  async batchConvertFolder({ inputSubfolder, configProfile, outputSubfolder = null, userData = null }) {
    const formData = new FormData();
    formData.append('Input_Subfolder', inputSubfolder);
    formData.append('Config_Profile', configProfile);
    if (outputSubfolder) formData.append('Output_Subfolder', outputSubfolder);
    if (userData) formData.append('User_Data', userData);
    return this.client.post('/api/v1/batch-convert/folder', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
  }

  async getBatchStatus(jobId) {
    return this.client.get(`/api/v1/batch-status/${jobId}`);
  }

  async listBatchJobs({ status = null, configProfile = null, startDate = null, endDate = null, limit = 10, offset = 0 } = {}) {
    const params = { Limit: limit, Offset: offset };
    if (status) params.Status = status;
    if (configProfile) params.Config_Profile = configProfile;
    if (startDate) params.Start_Date = startDate;
    if (endDate) params.End_Date = endDate;
    return this.client.get('/api/v1/batch-jobs', { params });
  }

  async getBatchJobsSummary({ startDate = null, endDate = null, configProfile = null } = {}) {
    const params = {};
    if (startDate) params.Start_Date = startDate;
    if (endDate) params.End_Date = endDate;
    if (configProfile) params.Config_Profile = configProfile;
    return this.client.get('/api/v1/batch-jobs/summary', { params });
  }

  async getBatchJobLogs(jobId, { limit = 50, offset = 0, logLevel = null } = {}) {
    const params = { Limit: limit, Offset: offset };
    if (logLevel) params.Log_Level = logLevel;
    return this.client.get(`/api/v1/batch-jobs/${jobId}/logs`, { params });
  }

  async getBatchFileDetail(jobId, filename) {
    return this.client.get(`/api/v1/batch-jobs/${jobId}/files/${filename}/details`);
  }

  async downloadGeneratedFile(fileType, filename) {
    return this.client.get(`/api/v1/download-file/${fileType}/${filename}`, { responseType: 'arraybuffer' });
  }

  async viewGeneratedFile(fileType, filename) {
    return this.client.get(`/api/v1/view-file/${fileType}/${filename}`);
  }

  async getEngineInfo() {
    return this.client.get('/engine/info');
  }
}

module.exports = { RedixClient, RedixAPIError };