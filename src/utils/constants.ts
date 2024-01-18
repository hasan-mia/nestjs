// common
export const jwtAccess = process.env.JWT_ACCESS_TOKEN;
export const jwtRefresh = process.env.JWT_REFRESH_TOKEN;
export const clientUrl = process.env.CLIENT_URL;
export const serverUrl = process.env.SERVER_URL;
// database
export const dbType = process.env.DB_TYPE;
export const dbHost = process.env.DB_HOST;
export const dbPort = parseInt(process.env.DB_PORT, 10);
export const dbUser = process.env.DB_USER;
export const dbPass = process.env.DB_PASS;
export const dbName = process.env.DB_NAME;
export const dbNode = process.env.NODE_ENV === 'development';
