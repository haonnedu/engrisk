import { ClassItem } from './class.types';
export declare class ClassesService {
    private classes;
    list(): ClassItem[];
    create(name: string): ClassItem;
    byId(id: string): ClassItem | undefined;
}
