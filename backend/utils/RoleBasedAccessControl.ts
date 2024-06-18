interface RolePermissions {
    [permission: string]: boolean;
  }
  
  interface UserRoles {
    [role: string]: RolePermissions;
  }
  
  export class RoleBasedAccessControl {
    private static instance: RoleBasedAccessControl;
    private userRoles: UserRoles;
  
    private constructor() {
      this.userRoles = {
        admin: {
          createProposal: true,
          voteOnProposal: true,
          manageUsers: true,
          manageRoles: true,
        },
        user: {
          createProposal: true,
          voteOnProposal: true,
          manageUsers: false,
          manageRoles: false,
        },
      };
    }
  
    public static getInstance(): RoleBasedAccessControl {
      if (!RoleBasedAccessControl.instance) {
        RoleBasedAccessControl.instance = new RoleBasedAccessControl();
      }
      return RoleBasedAccessControl.instance;
    }
  
    public grantPermission(role: string, permission: string): void {
      if (!this.userRoles[role]) {
        this.userRoles[role] = {};
      }
      this.userRoles[role][permission] = true;
    }
  
    public revokePermission(role: string, permission: string): void {
      if (this.userRoles[role] && this.userRoles[role][permission]) {
        delete this.userRoles[role][permission];
      }
    }
  
    public checkPermission(role: string, permission: string): boolean {
      return !!this.userRoles[role]?.[permission];
    }
  
    public getUserRoles(): UserRoles {
      return this.userRoles;
    }
  }
  