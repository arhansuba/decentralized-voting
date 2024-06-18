interface BugReport {
    id: number;
    title: string;
    description: string;
    reportedBy: string;
    status: 'pending' | 'in-progress' | 'resolved';
  }
  
  export class BugBountyProgram {
    private static instance: BugBountyProgram;
    private bugReports: BugReport[];
  
    private constructor() {
      this.bugReports = [];
    }
  
    public static getInstance(): BugBountyProgram {
      if (!BugBountyProgram.instance) {
        BugBountyProgram.instance = new BugBountyProgram();
      }
      return BugBountyProgram.instance;
    }
  
    public getAllBugReports(): BugReport[] {
      return this.bugReports;
    }
  
    public getBugReportById(id: number): BugReport | undefined {
      return this.bugReports.find(report => report.id === id);
    }
  
    public addBugReport(report: BugReport): void {
      this.bugReports.push(report);
    }
  
    public updateBugReportStatus(id: number, status: 'in-progress' | 'resolved'): void {
      const report = this.getBugReportById(id);
      if (report) {
        report.status = status;
      }
    }
  
    public deleteBugReport(id: number): void {
      this.bugReports = this.bugReports.filter(report => report.id !== id);
    }
  }
  