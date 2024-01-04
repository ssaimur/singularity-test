export const commonExcludes = ['createdAt', 'updatedAt', 'deletedAt'];
export const commonExcludesNoDeletedAt = ['createdAt', 'updatedAt'];
export const commonTrExclude = ['updatedAt', 'deletedAt'];
export const userExclueds = [...commonExcludes, 'password', 'otp', 'otpExpiredAt', 'refreshToken'];
export const urlPattern = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
export const EXCEL_HYPERLINK_COLOR = '000000FF';
export const DATE_FORMAT_FOR_DB = 'YYYY-MM-DD';
export const DATE_FORMAT_FROM_CLIENT = 'DD/MM/YYYY';
export const DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss';
export const DATE_FORMAT_WITH_AM = 'DD/MM/YYYY hh:mm:ss A';
export const DATE_FORMAT_TO_SHOW = 'DD MMMM YYYY';
export const WEEK_DAYS = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
export const ADMIN_ROLE_ID = 1;
export const SUPERVISOR_ROLE_ID = 2;
export const EMPLOYEE_ROLE_ID = 3;

export enum EUserUniqueFields {
  userName = 'userName',
  phoneNumber = 'phoneNumber',
  email = 'email',
}
