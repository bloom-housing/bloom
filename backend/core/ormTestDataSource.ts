import { DataSource } from "typeorm"
import connectionConfig from "./ormconfig.test"
const ormDataSource = new DataSource({
  ...connectionConfig,
})

export default ormDataSource
