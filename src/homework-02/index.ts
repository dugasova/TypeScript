// Name, surname, position, company, experience, courses, contacts
class Lecture {
  private _name: string;
  private _surname: string;
  private _position: string;
  private _company: string;
  private _experience: number;
  private _courses: string;
  private _contacts: string;

  constructor(
    name: string,
    surname: string,
    position: string,
    company: string,
    experience: number,
    courses: string,
    contacts: string
  ) {
    this._name = name;
    this._surname = surname;
    this._position = position;
    this._company = company;
    this._experience = experience;
    this._courses = courses;
    this._contacts = contacts;
  }
  get name(): string {
    return this.name;
  }
  get surname(): string {
    return this._surname;
  }
  get position(): string {
    return this._position;
  }
  get company(): string {
    return this._company;
  }
  get experience(): number {
    return this.experience;
  }
  get courses(): string {
    return this.courses;
  }
  get contacts(): string {
    return this.contacts;
  }
}

class School {
  private _areas: Area[] = [];
  private _lecturers: Lecture[] = [];

  get areas(): Area[] {
    return this._areas;
  }
  // implement 'add area' method
  addArrea(area: Area): void {
    this.areas.push(area);
  }
  // implement 'remove area' method
  removeArea(area: Area): void {
    this._areas = this.areas.filter(item => item !== area);
  }

  get lecturers(): Lecture[] {
    return this._lecturers;
  }

  //implement 'add lecturer' method
  addLecturer(lecturer: Lecture): void {
    this._lecturers.push(lecturer);
  }

  //implement 'remove lecturer' method
  removeLecturer(lecturer: Lecture): void {
    this._lecturers.filter(item => item !== lecturer);
  }
}

class Area {
  // implement getters for fields and 'add/remove level' methods
  private _levels: Level[] = [];
  private _name: string;

  constructor(name: string) {
    this._name = name;
  }

  get levels(): Level[] {
    return this._levels;
  }
  get name(): string {
    return this._name;
  }

  addLevel(level: Level): void {
    this._levels.push(level);
  }

  removeLevel(level: Level): void {
    this._levels.filter(item => item !== level);
  }
}

class Level {

  private _groups: Group[] = [];
  private _name: string;
  private _description: string;

  constructor(name: string, description: string) {
    this._name = name;
    this._description = description;
  }

  get groups(): Group[] {
    return this._groups;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  // implement getters for fields and 'add/remove group' methods
  addGroup(group: Group): void {
    this._groups.push(group);
  }

  removeGroup(group: Group): void {
    this._groups = this._groups.filter(item => item !== group);
  }
}

class Group {
  private _area: string;
  private _status: string;
  private _students: Student[] = [];
  private _level: string;

  constructor(area: string, status: string, level: string) {
    this._area = area;
    this._status = status;
    this._level = level;
  }

  get area(): string {
    return this._area;
  }

  get stattus(): string {
    return this.stattus;
  }

  get level(): string {
    return this.level;
  }

  // implement getters for fields and 'add student'
  addStudent(student: Student): void {
    this._students.push(student);
  }

  // implement getters for fields and 'remove student'
  removeStudent(student: Student): void {
    this._students = this._students.filter(person => person !== student);
  }

  showPerformance(): Student[] {
    const sortedStudents: Student[] = this._students.toSorted(
      (a: Student, b: Student): number => b.getPerformanceRating() - a.getPerformanceRating()
    );
    return sortedStudents;
  }
}

class Student {
  private _firstName: string;
  private _lastName: string;
  private _birthYear: number;
  private _grades: { [worName: string]: number } = {};
  private _visits: { [lessons: string]: boolean } = {}; 

  constructor(firstName: string, lastName: string, birthYear: number) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._birthYear = birthYear;
  }

  get fullName(): string {
    return `${this._lastName} ${this._firstName}`;
  }

  set fullName(value: string) {
    [this._lastName, this._firstName] = value.split(' ');
  }

  get age(): number {
    return new Date().getFullYear() - this._birthYear;
  }

  // implement 'set grade'
  setGrade(workName: string, mark: number): void {
    this._grades[workName] = mark;
  }

  // implement 'set visit'
  setAttendance(lesson: string, present: boolean): void {
    this._visits[lesson] = present;
  }

  getPerformanceRating(): number {
    const gradeValues = Object.values(this._grades);
    if (!gradeValues.length) return 0;

    const averageGrade: number =
      gradeValues.reduce((sum: number, grade: number): number => sum + grade, 0) / gradeValues.length;

    const attendancePercentage: number =
      (Object.values(this._visits).filter((present: boolean) => present).length / Object.values(this._visits).length) *
      100;

    return (averageGrade + attendancePercentage) / 2;
  }
}
