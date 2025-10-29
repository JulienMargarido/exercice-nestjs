import { ChatServiceModule } from '@/service';
import { Module } from '@nestjs/common';
import { IngestService } from './service/ingest.service';

@Module({
  imports: [ChatServiceModule],
  controllers: [],
  providers: [IngestService],
  exports: [],
})
export class IngestModule {}
