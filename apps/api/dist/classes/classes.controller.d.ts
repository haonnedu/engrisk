import { ClassesService } from './classes.service';
export declare class ClassesController {
    private readonly classes;
    constructor(classes: ClassesService);
    list(): import("./class.types").ClassItem[];
    create(body: {
        name: string;
    }): import("./class.types").ClassItem;
    byId(id: string): import("./class.types").ClassItem | undefined;
}
