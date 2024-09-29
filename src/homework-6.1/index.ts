// Визначте інтерфейс, який використовує сигнатуру індексу з типами об'єднання.
//Наприклад, тип значення для кожного ключа може бути число | рядок.
interface A {
  [key: string]: string | number;
}

// Створіть інтерфейс, у якому типи значень у сигнатурі індексу є функціями.
//  Ключами можуть бути рядки, а значеннями — функції, які приймають будь-які аргументи.
interface B {
  [key: string]: (...args: any[]) => any;
}

// Опишіть інтерфейс, який використовує сигнатуру індексу для опису об'єкта,
// подібного до масиву. Ключі повинні бути числами, а значення - певного типу.
interface IArray<T> {
  [key: number]: T;
}

// Створіть інтерфейс з певними властивостями та індексною сигнатурою.
// Наприклад, ви можете мати властивості типу name: string та індексну сигнатуру для додаткових динамічних властивостей.
interface Person {
  name: string;
  age: number;
  [key: string]: string | number;
}

// Створіть два інтерфейси, один з індексною сигнатурою,
// а інший розширює перший, додаючи специфічні властивості.

interface IAnimal {
  [name: string]: string | number;
}

interface IAnimelBreed extends IAnimal {
  breed: string;
  age: number;
}

// Напишіть функцію, яка отримує об'єкт з індексною сигнатурою і перевіряє, чи відповідають
// значення певних ключів певним критеріям (наприклад, чи всі значення є числами).
interface INumericValue {
  [key: string]: number;
}

function checkNunerickValues(obj: INumericValue): boolean {
  for (let key in obj) {
    if (typeof obj[key] !== 'number') {
      return false;
    }
  }
  return true;
}
