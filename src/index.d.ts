// index.d.ts

/**
 * Custom error for Redix API failures.
 */
declare class RedixAPIError extends Error {
    status_code: number;
    message: string;
    constructor(status_code: number, message: string);
}

/**
 * Represents the response from a batch job status request.
 */
interface BatchStatusResponse {
    job_id: string;
    status: string;
    start_time: string;
    end_time: string | null;
    total_files_found: number | null;
    files_processed: number | null;
    successful_files: number | null;
    failed_files: number | null;
    summary: string | null;
    details: any[];
    error: string | null;
}

/**
 * Represents a summary of a batch job.
 */
interface BatchJobSummary {
    job_id: string;
    status: string;
    profile: string;
    input_folder: string;
    output_folder: string;
    start_time: string;
    end_time: string | null;
    total_files_found: number;
    files_processed: number;
    successful_files: number;
    failed_files: number;
    error: string | null;
}

/**
 * Represents the response from a conversion request.
 */
interface ConversionResponse {
    success: boolean;
    conversion_id: string;
    filename_base: string;
    input_file_name: string | null;
    input_file_path: string | null;
    input_file_view_url: string | null;
    output_file_path: string | null;
    output_file_view_url: string | null;
    error_file_path: string | null;
    error_file_view_url: string | null;
    ack_file_path: string | null;
    ack_file_view_url: string | null;
    ta1_file_path: string | null;
    ta1_file_view_url: string | null;
    archived_file_path: string | null;
    archived_file_view_url: string | null;
    conversion_result_summary: string;
    warnings: string[];
    processing_time_ms: number;
}

/**
 * Represents the response from a file upload.
 */
interface UploadResponse {
    message: string;
    filename: string;
}

/**
 * Represents the response from a file deletion.
 */
interface FileDeleteResponse {
    message: string;
}

/**
 * Represents information about a file on the server.
 */
interface FileInfo {
    name: string;
    path: string;
    is_dir: boolean;
    size: number | null;
    last_modified: string;
}

/**
 * Represents the response from a file content view request.
 */
interface FileViewResponse {
    content: string;
}

/**
 * Represents a log entry for a batch job.
 */
interface BatchLog {
    timestamp: string;
    level: string;
    message: string;
}

/**
 * Represents details for a specific file within a batch job.
 */
interface BatchFileDetail {
    filename: string;
    status: string;
    success: boolean;
    summary: string;
    warnings: string[];
    output_url: string | null;
    error_url: string | null;
    ack_url: string | null;
    ta1_url: string | null;
    archive_path: string | null;
}

/**
 * Represents the aggregate summary of batch jobs.
 */
interface BatchSummaryResponse {
    total_jobs: number;
    total_successful_files: number;
    total_failed_files: number;
    average_files_processed: number;
}

/**
 * Represents the response for available staging profiles.
 */
interface StagingProfilesResponse {
    default_profile: string | null;
    available_profiles: string[];
}

/**
 * Types for common API parameters.
 */
type ConversionFlag = 'e' | 'x' | 'f' | 'c' | 't' | 'n' | 'h';
type WarningLevel = 0 | 1 | 2;
type SegmentTerminator = 'new line' | '!' | '"' | '$' | '%';
type ElementSeparator = '*' | ',' | '$' | '%';
type CompositeSeparator = ':' | '*' | ';' | '$' | '%';
type ReleaseCharacter = '?' | '|' | '!';
type BatchJobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'COMPLETED_WITH_ERRORS' | 'FAILED';
type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG' | 'CRITICAL';
type FileType = 'input' | 'output' | 'error' | 'ack' | 'ta1' | 'staging' | 'shared' | 'archive';


/**
 * A client for the Redix Healthcare Data Conversion REST API.
 */
declare class RedixClient {
    constructor(options: { baseUrl: string, apiKey: string });

    healthCheck(): Promise<any>;
    getFormOptions(): Promise<any>;
    listUserFiles(limit?: number): Promise<any>;
    listServerFiles(path?: string, include_dirs?: boolean): Promise<any>;
    listStagingFiles(): Promise<any>;
    listStagingProfiles(): Promise<StagingProfilesResponse>;
    uploadToStaging(filePath: string): Promise<UploadResponse>;
    deleteFromStaging(filename: string): Promise<FileDeleteResponse>;
    convertFileUpload(options: {
        inputFile: string;
        ifdFile: string;
        ofdFile: string;
        conversionFlag?: ConversionFlag;
        warningLevel?: WarningLevel;
        userData?: string;
        segmentTerminator?: SegmentTerminator;
        elementSeparator?: ElementSeparator;
        compositeSeparator?: CompositeSeparator;
        releaseCharacter?: ReleaseCharacter;
    }): Promise<ConversionResponse>;
    convertStagingFile(options: {
        stagedFilename: string;
        configProfile?: string | null;
        userData?: string | null;
    }): Promise<ConversionResponse>;
    batchConvertFolder(options: {
        inputSubfolder: string;
        configProfile: string;
        outputSubfolder?: string | null;
        userData?: string | null;
    }): Promise<any>;
    getBatchStatus(jobId: string): Promise<BatchStatusResponse>;
    listBatchJobs(options?: {
        status?: BatchJobStatus;
        configProfile?: string;
        startDate?: string;
        endDate?: string;
        limit?: number;
        offset?: number;
    }): Promise<BatchJobSummary[]>;
    getBatchJobsSummary(options?: {
        startDate?: string;
        endDate?: string;
        configProfile?: string;
    }): Promise<BatchSummaryResponse>;
    getBatchJobLogs(jobId: string, options?: {
        limit?: number;
        offset?: number;
        logLevel?: LogLevel;
    }): Promise<BatchLog[]>;
    getBatchFileDetail(jobId: string, filename: string): Promise<BatchFileDetail>;
    downloadGeneratedFile(fileType: FileType, filename: string): Promise<any>;
    viewGeneratedFile(fileType: FileType, filename: string): Promise<any>;
    getEngineInfo(): Promise<any>;
}

export { RedixClient, RedixAPIError };