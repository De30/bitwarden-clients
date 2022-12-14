import { ImportDirectoryRequestUser } from "./import-directory-request-user";

export class OrganizationImportMemberRequest {
  email: string;
  externalId: string;
  deleted: boolean;

  constructor(model: Required<OrganizationImportMemberRequest> | ImportDirectoryRequestUser) {
    this.email = model.email;
    this.externalId = model.externalId;
    this.deleted = model.deleted;
  }
}
