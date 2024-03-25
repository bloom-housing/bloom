import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SingleUseCodeAuthGuard extends AuthGuard('single-use-code') {}
