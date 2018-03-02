import { CipherType } from '../../enums/cipherType';

import { AttachmentData } from './attachmentData';
import { CardData } from './cardData';
import { FieldData } from './fieldData';
import { IdentityData } from './identityData';
import { LoginData } from './loginData';
import { SecureNoteData } from './secureNoteData';

import { CipherResponse } from '../response/cipherResponse';

export class CipherData {
    id: string;
    organizationId: string;
    folderId: string;
    userId: string;
    edit: boolean;
    organizationUseTotp: boolean;
    favorite: boolean;
    revisionDate: string;
    type: CipherType;
    sizeName: string;
    name: string;
    notes: string;
    login?: LoginData;
    secureNote?: SecureNoteData;
    card?: CardData;
    identity?: IdentityData;
    fields?: FieldData[];
    attachments?: AttachmentData[];
    collectionIds?: string[];

    constructor(response: CipherResponse, userId: string, collectionIds?: string[]) {
        this.id = response.id;
        this.organizationId = response.organizationId;
        this.folderId = response.folderId;
        this.userId = userId;
        this.edit = response.edit;
        this.organizationUseTotp = response.organizationUseTotp;
        this.favorite = response.favorite;
        this.revisionDate = response.revisionDate;
        this.type = response.type;
        this.name = response.name;
        this.notes = response.notes;

        if (collectionIds != null) {
            this.collectionIds = collectionIds;
        } else {
            this.collectionIds = response.collectionIds;
        }

        switch (this.type) {
            case CipherType.Login:
                this.login = new LoginData(response.login);
                break;
            case CipherType.SecureNote:
                this.secureNote = new SecureNoteData(response.secureNote);
                break;
            case CipherType.Card:
                this.card = new CardData(response.card);
                break;
            case CipherType.Identity:
                this.identity = new IdentityData(response.identity);
                break;
            default:
                break;
        }

        if (response.fields != null) {
            this.fields = [];
            response.fields.forEach((field) => {
                this.fields.push(new FieldData(field));
            });
        }

        if (response.attachments != null) {
            this.attachments = [];
            response.attachments.forEach((attachment) => {
                this.attachments.push(new AttachmentData(attachment));
            });
        }
    }
}
