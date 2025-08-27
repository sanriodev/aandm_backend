import { DataSource, DataSourceOptions } from 'typeorm';
import dbconn from './dbconn';
const datasource = new DataSource(dbconn as any as DataSourceOptions);
datasource.initialize();
export default datasource;
