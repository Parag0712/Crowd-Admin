import { User } from "next-auth";
import { UserRole } from "./next-auth";

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
export interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: User | null;
}

export interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: RazorpayOrdersResponse | p | object | null | string;
  errors: string[];
}

export interface UserPayload {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  isActive?: UserStatus;
}

export interface ExtendedUser extends User {
  id: string | number;
  name: string;
  email: string;
  createdAt: string;
  created_at: string;
  isActive: UserStatus;
  phoneNumber: string;
  role: UserRole;
}

// University

export interface UniversityPayload {
  name: string;
  address: string;
  phoneNumber: string;
  isActive?: UserStatus;
}

export interface University {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  isActive?: UserStatus;
  createdAt: string;
  updatedAt: string;
}

// Guard
export interface GuardPayload {
  name: string;
  universityId: number;
  gateId?: number;
  email: string;
  employeeId: string;
  password: string;
  isActive?: UserStatus;
}

export interface Guard {
  id: number;
  name: string;
  email: string;
  employeeId: string;
  phoneNumber: string;
  isActive?: UserStatus;
  gateId?: number;
  createdAt: string;
  updatedAt: string;
  gate: {
    gateId: number;
    location: string;
    description: string;
    university: {
      id: number;
      name: string;
    };
  };
}

// GATE
export interface GatePayload {
  universityId: number;
  location: string;
  gateId: string;
  description: string;
}

export interface Gate {
  id: number;
  gateId: string;
  location: string;
  isActive: Status;
  description: string;
  createdAt: string;
  securityGuards: [];
  university: {
    name: string;
    id: number;
    isActive: string;
  };
  updatedAt: string;
}

// OrganizationPayload

export interface OrganizationPayload {
  name: string;
  description: string;
  universityId: number;
  isActive?: Status;
}

export interface Organization {
  id: number;
  name: string;
  description: string;
  isActive: Status;
  createdAt: string;
  updatedAt: string;
  university: {
    name: string;
    id: number;
    isActive: string;
  };
  updatedAt: string;
}

// Principal

export interface PrincipalPayload {
  name: string;
  email: string;
  phoneNumber: string;
  password?: string;
  orgId: number;
  isActive?: Status;
}

export interface Principal {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  isActive: Status;
  createdAt: string;
  updatedAt: string;
  organizationsAsPrincipal: {
    id: number;
    name: string;
    description: string;
    isActive: string;
    createdAt: string;
    updatedAt: string;
  };
  principalApprovals: [];
}
// Branch

export interface BranchPayload {
  orgId: number;
  name: string;
  description: string;
  isActive?: Status;
}

export interface Branch {
  id: number;
  name: string;
  isActive: Status;
  description: string;
  faculties: [];
  createdAt: string;
  updatedAt: string;
}

// HOD

export interface HodPayload {
  branchId: number;
  employeeId: string;
  name: string;
  email: string;
  phoneNumber: string;
  password?: string;
  isActive?: Status;
}

export interface Hod {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  employeeId: string;
  isActive: Status;
  createdAt: string;
  updatedAt: string;
  branch: {
    id: number;
    name: string;
  };
}

export interface ApprovalListType {
  id: number;
  approverType: string;
  approvedName: string;
  approvedEmail: string;
  approvedByName: string;
  approvedByEmail: string;
  status: string;
  approvedAt: string;
  createdAt: string;
  updatedAt: string;
  studentId: number;
  securityguardId: string;
  principalId: number;
  hodId: number;
  facultyId: number;
  adminId: number;
  branch: {
    id: number;
    name: string;
    orgId: number;
  };
}

export interface FacultyPayload {
  branchId: number;
  employeeId: string;
  name: string;
  email: string;
  phoneNumber: string;
  password?: string;
  isActive?: Status;
}

export interface Faculty {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  employeeId: string;
  isActive: Status;
  createdAt: string;
  updatedAt: string;
  branch: {
    id: number;
    name: string;
  };
}

export interface StundetPayload {
  branchId: number;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  facultyId: number;
  studentId: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  studentId: string;
  phoneNumber: string;
  isActive: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
  branch: Branch;
}

export type Approve_Status = "APPROVED" | "REJECTED" | "PENDING";

export const SMS_TEMPLATE_VARIABLES = {
  user_reg_001: ["user_name", "registration_date"],
  user_reg_002: ["email_address", "password"],
  user_verified: ["user_name"],
  bill_001: ["bill_amount", "due_date"],
  bill_002: ["bill_amount", "due_date"],
  bill_003: ["payment_amount", "payment_date"],
  bill_004: ["bill_amount", "due_date"],
  bill_005: ["overdue_amount", "overdue_days"],
  bill_006: ["payment_amount", "late_fee"],
  bill_gen_001: ["user_name"],
  bill_gen_002: ["user_name", "due_date"],
  bill_gen_003: ["user_name", "due_date"],
  bill_gen_004: ["user_name"],
  bill_pay_001: ["user_name", "bill_amount"],
  bill_pay_002: ["user_name", "bill_amount"],
  bill_pay_003: ["user_name", "bill_amount"],
  bill_pay_004: ["user_name", "bill_amount"],
  admin_forgot_password: ["user_name", "url_link"],
  mobile_forgot_password: ["user_name", "otp"],
};

export enum EMAILTypeEnum {
  USER_REG_001 = "user_reg_001",
  USER_REG_002 = "user_reg_002",
  USER_VERIFIED = "user_verified",
  BILL_001 = "bill_001",
  BILL_002 = "bill_002",
  BILL_003 = "bill_003",
  BILL_004 = "bill_004",
  BILL_005 = "bill_005",
  BILL_006 = "bill_006",
  BILL_GEN_001 = "bill_gen_001",
  BILL_GEN_002 = "bill_gen_002",
  BILL_GEN_003 = "bill_gen_003",
  BILL_GEN_004 = "bill_gen_004",
  BILL_PAY_001 = "bill_pay_001",
  BILL_PAY_002 = "bill_pay_002",
  BILL_PAY_003 = "bill_pay_003",
  BILL_PAY_004 = "bill_pay_004",
  ADMIN_FORGET_PASSWORD = "admin_forgot_password",
  MOBILE_FORGET_PASSWORD = "mobile_forgot_password",
}

export const EMAIL_TEMPLATE_VARIABLES = {
  user_reg_001: ["user_name", "registration_date"],
  user_reg_002: ["email_address", "password"],
  user_verified: ["user_name"],
  bill_001: ["bill_amount", "due_date"],
  bill_002: ["bill_amount", "due_date"],
  bill_003: ["payment_amount", "payment_date"],
  bill_004: ["bill_amount", "due_date"],
  bill_005: ["overdue_amount", "overdue_days"],
  bill_006: ["payment_amount", "late_fee"],
  bill_gen_001: ["user_name"],
  bill_gen_002: ["user_name", "due_date"],
  bill_gen_003: ["user_name", "due_date"],
  bill_gen_004: ["user_name"],
  bill_pay_001: ["user_name", "bill_amount"],
  bill_pay_002: ["user_name", "bill_amount"],
  bill_pay_003: ["user_name", "bill_amount"],
  bill_pay_004: ["user_name", "bill_amount"],
  admin_forgot_password: ["user_name", "url_link"],
  mobile_forgot_password: ["user_name", "otp"],
};

export interface EmailPayload {
  identifier: string;
  description: string;
  subject: string;
  htmlBody: string;
  type: EMAILTypeEnum;
  variables: string;
}

export interface Email {
  id: number;
  identifier: string;
  description: string;
  subject: string;
  body: string;
  htmlBody: string;
  type: EMAILTypeEnum;
  variables: string;
}

export enum RazorpayStatus {
  PAYMENTS = "PAYMENTS",
  ORDER = "ORDER",
  SETTLEMENT = "SETTLEMENT",
}

export interface RazorpayInvoice {
  id: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  notes: {
    email?: string;
  };
  status: string;
  month: string;
}

export enum RevenueRange {
  Yearly = "Yearly",
  Monthly = "Monthly",
}

export interface RazorpayOrdersResponse {
  count: number;
  entity: "collection";
  items: RazorpayInvoice[];
}

interface YearlyRevenueResponse {
  data: {
    yearlyRevenues: YearlyRevenue[];
  };
}

interface YearlyRevenue {
  year: number;
  revenue: number;
  // add other properties if they exist
}

export interface importDataPayload {
  file: File;
  projectId: string;
}

export interface Report {
  id: number;
  report_type: string;
  filters: Record<string, unknown>;
  file_path: string;
  created_at: string;
}

export interface ReportResponse {
  statusCode: number;
  data: Report[];
}

export interface AddAgentPayload {
  agent_ids: number[];
}

export type ActivityLog = {
  id: number;
  user_id: number | null;
  action: string;
  created_at: string;
  customer?: {
    app_registered_fee: boolean;
    approved_by: number;
    approved_time: string;
    created_at: string;
    disabled: boolean;
    email_address: string;
    first_name: string;
    last_name: string;
    login_ip: string;
    role: string;
    phone: string;
    id: number;
  };
};

export type UserLog = {
  id: number;
  timestamp: string;
  category: string;
  method: string;
  email: string | null;
  role: string | null;
  userId: number | null;
  statusCode: number;
};
