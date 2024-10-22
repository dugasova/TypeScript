// Створити тип DeepReadonly який буде робити доступними тільки 
// для читання навіть властивості вкладених обʼєктів.
type DeepReadonly<T> = {
    readonly [K in keyof T]: DeepReadonly<T[K]>
}

interface NeastedObject {
  a: number;
    b: {
      c: string;
        d: {
          e: boolean
        }
    }
}
const example1: DeepReadonly<NeastedObject> = {
  a: 1,
    b: {
      c: "hello",
        d: {
          e: true
        }
    }
}

// Створити тип DeepRequireReadonly який буде робити доступними тільки для читання 
// навіть властивості вкладених обʼєктів та ще й робити їх обовʼязковими.
type DeepRequireReadonly<T> = {
    readonly [K in keyof T]-?: DeepRequireReadonly<T[K]>
}

const example2: DeepReadonly<NeastedObject> = {
  a?: 1, // error
    b?: {  // error
      c: "hello",
        d: {
          e: true
        }
    }
}

// Створити тип UpperCaseKeys, який буде приводити всі ключі до верхнього регістру.
type UpperCaseKeys<T> = {
  [K in keyof T as Uppercase<K & string>] : T[K];
}

type ExampleUpperCaseKeys = UpperCaseKeys<IUser>

interface IUser {
  firstName: string; 
  lastName: string;
  age: number;
}
// const example3: ExampleUpperCaseKeys = {
//   FIRSTNAME: string;
//   LASTNAME: string;
//   AGE: number
// }

// Створіть тип ObjectToPropertyDescriptor, який перетворює звичайний
//  обʼєкт на обʼєкт де кожне value є дескриптором.

type ObjectToPropertyDescriptor<T> = {
  [K in keyof T]: PropertyDescriptor
}
interface IExample {
  name: string;
  age: number;
}
type ExamplePropertyDescriptor = ObjectToPropertyDescriptor<IExample>
const example4: ExamplePropertyDescriptor =
{
  name: {
    configurable: true,
    enumerable: true,
    writable: false,
    value: "Kate",

  },
  age: {
    configurable: false,
    enumerable: true,
    writable: false,
    value: 20,
    
  }
}
