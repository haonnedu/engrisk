import { Injectable } from '@nestjs/common';
import { ClassItem } from './class.types';

@Injectable()
export class ClassesService {
  private classes: ClassItem[] = [];

  list(): ClassItem[] {
    return this.classes;
  }

  create(name: string): ClassItem {
    const newClass: ClassItem = { id: Date.now().toString(), name };
    this.classes.push(newClass);
    return newClass;
  }

  byId(id: string): ClassItem | undefined {
    return this.classes.find(c => c.id === id);
  }
}