export enum Api {
  SITE_HIRE = '/site/hire',

  AUTH_SIGN_IN_EMAIL = '/auth/sign-in/email',
  AUTH_SIGN_IN_CODE = '/auth/sign-in/code',
  AUTH_SIGN_OUT = '/auth/sign-out',
  AUTH_VERIFY_CODE = '/auth/verify-code',
  AUTH_VERIFY_USER_TOKEN = '/auth/verify-user-token',

  PERMISSION_VERIFY_PAGE_ACCESS = '/permission/verify-page-access',
  PERMISSION_ALL = '/permission/all',
  PERMISSION_CREATE = '/permission/create',
  PERMISSION_DELETE = '/permission/delete',
  PERMISSION_UPDATE = '/permission/update',

  // ADMIN_GRAL_MENU = '/admin-gral/menu',

  ORGANIZATION_CHANGE = '/organization/change',
  ORGANIZATION_ALL = '/organization/all',
  ORGANIZATION_CREATE = '/organization/create',
  ORGANIZATION_DELETE = '/organization/delete',
  ORGANIZATION_UPDATE = '/organization/update',

  ROLE_ALL = '/role/all',
  ROLE_CREATE = '/role/create',
  ROLE_CREATE_RELATION_PERMISSION = '/role/create-relation-permission',
  ROLE_DELETE = '/role/delete',
  ROLE_DELETE_RELATION_PERMISSION = '/role/delete-relation-permission',
  ROLE_UPDATE = '/role/update',
  ROLE_UPDATE_PERMISSION_POSITION = '/role/update-permission-position',

  USER_ALL = '/user/all',
  USER_CREATE = '/user/create',
  USER_CREATE_RELATION_ORGANIZATION_ROLE = '/user/create-relation-organization-role',
  USER_DELETE = '/user/delete',
  USER_DELETE_RELATION_ORGANIZATION_ROLE = '/user/delete-relation-organization-role',
  USER_UPDATE = '/user/update',
  USER_UPDATE_RELATION_ORGANIZATION_ROLE_VISIBILITY = '/user/update-relation-organization-role-visibility',

  MENU_PAGE_ALL = '/menu-page/all',
  MENU_PAGE_CREATE = '/menu-page/create',
  MENU_PAGE_DELETE = '/menu-page/delete',
  MENU_PAGE_UPDATE = '/menu-page/update',

  GRATITUDE_BY_USER = '/gratitude/by-user',
  GRATITUDE_CREATE = '/gratitude/create',
  GRATITUDE_DELETE = '/gratitude/delete',
  GRATITUDE_UPDATE = '/gratitude/update',
}
