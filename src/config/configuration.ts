export default () => ({
  port: parseInt(process.env.PORT, 10) || 5000,
  database: {
    type: process.env.DB_TYPE || 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'ezy',
    synchronize: process.env.NODE_ENV == 'development' ? true : false,
  },
});
