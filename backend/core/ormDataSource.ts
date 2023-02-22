import { DataSource } from "typeorm"
import connectionConfig from "./ormconfig"
const ormDataSource = new DataSource({
  ...connectionConfig,
})

export default ormDataSource
