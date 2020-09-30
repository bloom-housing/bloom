import { Injectable } from "@nestjs/common"
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { Preference } from "../entity/preference.entity"

@Injectable()
export class PreferencesService extends TypeOrmCrudService<Preference> {
  constructor(@InjectRepository(Preference) repo) {
    super(repo)
  }
}
