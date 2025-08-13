import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ClassesService } from './classes.service'

@Controller('classes')
export class ClassesController {
  constructor(private readonly classes: ClassesService) {}

  @Get()
  list() {
    return this.classes.list()
  }

  @Post()
  create(@Body() body: { name: string }) {
    return this.classes.create(body.name)
  }

  @Get(':id')
  byId(@Param('id') id: string) {
    return this.classes.byId(id)
  }
}