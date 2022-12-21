export class User {
    _id: string;
    name: string;
    age: number;
    createdAt: Date;
    lastModified: Date;

    constructor(user?: User) {
        if (!user) return;
        this._id = user._id;
        this.name = user.name;
        this.age = user.age;
        this.createdAt = user.createdAt;
        this.lastModified = user.lastModified;
    }
}