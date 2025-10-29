import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ApiEnvironment, LeafTypes, Leaves } from 'envs/api-environment';

@Injectable()
export class TypedConfigService {
  constructor(private readonly configService: ConfigService) {}

  get<T extends Leaves<ApiEnvironment>>(propertyPath: T): LeafTypes<ApiEnvironment, T> {
    return this.configService.get(propertyPath) as LeafTypes<ApiEnvironment, T>;
  }
}
