import { Cipher as CipherDomain } from "../domain/cipher";
import { CipherView } from "../view/cipher.view";

import { CipherExport } from "./cipher.export";

export class CipherWithIdExport extends CipherExport {
  id: string;
  collectionIds: string[];

  // Use build method instead of ctor so that we can control order of JSON stringify for pretty print
  build(o: CipherView | CipherDomain) {
    this.id = o.id;
    super.build(o);
    this.collectionIds = o.collectionIds;
  }
}
