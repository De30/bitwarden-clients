import { ApiService } from "../abstractions/api.service";
import { FileUploadService as FileUploadServiceAbstraction } from "../abstractions/fileUpload.service";
import { LogService } from "../abstractions/log.service";
import { FileUploadType } from "../enums/fileUploadType";
import { EncArrayBuffer } from "../models/domain/enc-array-buffer";
import { EncString } from "../models/domain/enc-string";
import { AttachmentUploadDataResponse } from "../models/response/attachment-upload-data.response";
import { SendFileUploadDataResponse } from "../models/response/send-file-upload-data.response";

import { AzureFileUploadService } from "./azureFileUpload.service";
import { BitwardenFileUploadService } from "./bitwardenFileUpload.service";

export class FileUploadService implements FileUploadServiceAbstraction {
  private azureFileUploadService: AzureFileUploadService;
  private bitwardenFileUploadService: BitwardenFileUploadService;

  constructor(private logService: LogService, private apiService: ApiService) {
    this.azureFileUploadService = new AzureFileUploadService(logService);
    this.bitwardenFileUploadService = new BitwardenFileUploadService();
  }

  async uploadSendFile(
    uploadData: SendFileUploadDataResponse,
    fileName: EncString,
    encryptedFileData: EncArrayBuffer
  ) {
    try {
      switch (uploadData.fileUploadType) {
        case FileUploadType.Direct:
          await this.bitwardenFileUploadService.upload(
            fileName.encryptedString,
            encryptedFileData,
            (fd) =>
              this.apiService.postSendFile(
                uploadData.sendResponse.id,
                uploadData.sendResponse.file.id,
                fd
              )
          );
          break;
        case FileUploadType.Azure: {
          const renewalCallback = async () => {
            const renewalResponse = await this.apiService.renewSendFileUploadUrl(
              uploadData.sendResponse.id,
              uploadData.sendResponse.file.id
            );
            return renewalResponse.url;
          };
          await this.azureFileUploadService.upload(
            uploadData.url,
            encryptedFileData,
            renewalCallback
          );
          break;
        }
        default:
          throw new Error("Unknown file upload type");
      }
    } catch (e) {
      await this.apiService.deleteSend(uploadData.sendResponse.id);
      throw e;
    }
  }

  async uploadCipherAttachment(
    admin: boolean,
    uploadData: AttachmentUploadDataResponse,
    encryptedFileName: EncString,
    encryptedFileData: EncArrayBuffer
  ) {
    const response = admin ? uploadData.cipherMiniResponse : uploadData.cipherResponse;
    try {
      switch (uploadData.fileUploadType) {
        case FileUploadType.Direct:
          await this.bitwardenFileUploadService.upload(
            encryptedFileName.encryptedString,
            encryptedFileData,
            (fd) => this.apiService.postAttachmentFile(response.id, uploadData.attachmentId, fd)
          );
          break;
        case FileUploadType.Azure: {
          const renewalCallback = async () => {
            const renewalResponse = await this.apiService.renewAttachmentUploadUrl(
              response.id,
              uploadData.attachmentId
            );
            return renewalResponse.url;
          };
          await this.azureFileUploadService.upload(
            uploadData.url,
            encryptedFileData,
            renewalCallback
          );
          break;
        }
        default:
          throw new Error("Unknown file upload type.");
      }
    } catch (e) {
      if (admin) {
        await this.apiService.deleteCipherAttachmentAdmin(response.id, uploadData.attachmentId);
      } else {
        await this.apiService.deleteCipherAttachment(response.id, uploadData.attachmentId);
      }
      throw e;
    }
  }
}
