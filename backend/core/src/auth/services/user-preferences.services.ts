import { UserPreferences } from "../entities/user-preferences.entity"
import { UserPreferencesDto } from "../dto/user-preferences.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { AuthContext } from "../types/auth-context"

export class UserPreferencesService {
  constructor(
    @InjectRepository(UserPreferences)
    private readonly repository: Repository<UserPreferences>
  ) {}

  async update(dto: UserPreferencesDto, authContext: AuthContext) {
    await this.repository.save({
      user: authContext.user,
      ...dto,
    })
    return dto
  }
}
