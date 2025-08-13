import { LessonsService } from './lessons.service';
import { LessonItem } from './lessons.type';
export declare class LessonsController {
    private readonly lessons;
    constructor(lessons: LessonsService);
    list(): LessonItem[];
    create(body: {
        classId: string;
        title: string;
    }): {
        id: string;
        classId: string;
        title: string;
        lessonCode: string;
    };
    byId(id: string): LessonItem;
}
