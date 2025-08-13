interface LessonItem {
    id: string;
    classId: string;
    title: string;
    lessonCode: string;
}
export declare class LessonsService {
    private store;
    list(): LessonItem[];
    create(classId: string, title: string): {
        id: string;
        classId: string;
        title: string;
        lessonCode: string;
    };
    byId(id: string): LessonItem;
    private generateCode;
}
export {};
