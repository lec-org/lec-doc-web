export interface IWorkspace {
  id: string;
  name: string;
  description: string;
  logo: string;
  hostname: string;
  defaultSpaceId: string;
  customDomain: string;
  enableInvite: boolean;
  settings: IWorkspaceSettings;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  emailDomains: string[];
  memberCount?: number;
  disablePublicSharing?: boolean;
  allowPublicSpaces?: boolean;
  publicSpacesDirectory?: boolean;
  trashRetentionDays?: number;
  defaultPageEditMode?: string;
}

export interface IWorkspaceSettings {
  sharing?: IWorkspaceSharingSettings;
  publicSpaces?: IWorkspacePublicSpacesSettings;
  defaultPageEditMode?: string;
}

export interface IWorkspaceSharingSettings {
  disabled?: boolean;
}

export interface IWorkspacePublicSpacesSettings {
  enabled?: boolean;
  directory?: boolean;
}

export interface ICreateInvite {
  role: string;
  emails: string[];
  groupIds: string[];
}

export interface IInvitation {
  id: string;
  role: string;
  email: string;
  workspaceId: string;
  invitedById: string;
  createdAt: Date;
}

export interface IInvitationLink {
  inviteLink: string;
}

export interface IAcceptInvite {
  invitationId: string;
  name: string;
  password: string;
  token: string;
}

export interface IPublicWorkspace {
  id: string;
  name: string;
  logo: string;
  hostname: string;
}
