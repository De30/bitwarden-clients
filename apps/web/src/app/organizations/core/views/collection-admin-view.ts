import { CollectionView } from "@bitwarden/common/models/view/collection.view";
import { CollectionAccessDetailsResponse } from "@bitwarden/common/src/models/response/collection.response";

import { CollectionAccessSelectionView } from "./collection-access-selection-view";

export class CollectionAdminView extends CollectionView {
  groups: CollectionAccessSelectionView[] = [];
  users: CollectionAccessSelectionView[] = [];

  constructor(response?: CollectionAccessDetailsResponse) {
    super(response);

    if (!response) {
      return;
    }

    this.groups = response.groups
      ? response.groups.map((g) => new CollectionAccessSelectionView(g))
      : [];

    this.users = response.users
      ? response.users.map((g) => new CollectionAccessSelectionView(g))
      : [];
  }
}
