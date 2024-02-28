import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadService } from './upload.service';
import * as fs from 'fs';
import { Readable } from 'stream';
import { AssetCreate } from '../dtos/assets/asset-create.dto';
import { FileServiceProvider, FileUpload } from './uploads';
import { CreatePresignedUploadMetadata } from '../dtos/assets/create-presigned-upload-meta.dto';
import { CreatePresignedUploadMetadataResponse } from '../dtos/assets/create-presign-upload-meta-response.dto';
import { Asset } from '../dtos/assets/asset.dto';
import { PaginationQueryParams } from '../dtos/shared/pagination.dto';
import { PrismaService } from './prisma.service';
import { calculateSkip, calculateTake } from '../utilities/pagination-helpers';

@Injectable()
export class AssetService {
  constructor(
    private readonly uploadService: UploadService,
    private readonly fileServiceProvider: FileServiceProvider,
    private readonly prismaService: PrismaService,
  ) {}

  async create(assetCreateDto: AssetCreate) {
    await this.prismaService.assets.create({ data: assetCreateDto });
  }

  async upload(label: string, file: Express.Multer.File) {
    const fileService = this.fileServiceProvider.activeFileService;

    // convert the express File type to a package-specific interface
    const fileUpload: FileUpload = {
      name: file.originalname,
      contentType: file.mimetype,
      size: file.size,
      // create stream from the buffer if available in memory, otherwise use the path to the file
      contents: file.buffer
        ? Readable.from(file.buffer)
        : fs.createReadStream(file.path),
    };

    const result = await fileService.putFile('assets', label, fileUpload);
    return result;

    /*
      This method originally created an asset and returned an AssetCreateDto, 
      but the frontend isn't yet set up to handle that scenario. The benefit
      of that approach over just the upload is having a queryable inventory of
      all files.
    */

    /*
    const asset = {
      fileId: result.url,
      label: label,
    }

    return await this.repository.save(asset)
    */
  }

  createPresignedUploadMetadata(
    createUploadUrlDto: CreatePresignedUploadMetadata,
  ): Promise<CreatePresignedUploadMetadataResponse> {
    return Promise.resolve(
      this.uploadService.createPresignedUploadMetadata(
        createUploadUrlDto.parametersToSign,
      ),
    );
  }

  async list(queryParams: PaginationQueryParams) {
    const count = await this.prismaService.assets.count();
    let page = queryParams.page;
    if (count && queryParams.limit && queryParams.page > 1) {
      if (Math.ceil(count / queryParams.limit) < queryParams.page) {
        page = 1;
      }
    }
    const assets = await this.prismaService.assets.findMany({
      skip: calculateSkip(queryParams.limit, page),
      take: calculateTake(queryParams.limit),
    });
    return {
      items: assets,
      meta: {
        itemCount: count,
      },
    };
  }

  async findOne(id: string): Promise<Asset> {
    const asset = await this.prismaService.assets.findFirst({
      where: { id: id },
    });
    if (!asset) {
      throw new NotFoundException();
    }
    return asset;
  }
}
