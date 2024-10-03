interface ICalculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
  multiply(a: number, b: number): number;
  divide(a: number, b: number): number;
}

class Calculator implements ICalculator {
  public add(a: number, b: number): number {
    return a + b;
  }
  public subtract(a: number, b: number): number {
    return a - b;
  }
  public multiply(a: number, b: number): number {
    return a * b;
  }
  public divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Division by zero is not allowed');
    }
    return a / b;
  }
}

type Opetation = 'add' | 'subtract' | 'multiply' | 'divide';

function calculate(calculator: ICalculator, operation: Opetation, a: number, b: number): number {
  switch (operation) {
    case 'add':
      return calculator.add(a, b);
    case 'subtract':
      return calculator.subtract(a, b);
    case 'multiply':
      return calculator.multiply(a, b);
    case 'divide':
      return calculator.divide(a, b);
    default:
      throw new Error('Ivalide operation');
  }
}

interface IBook {
  id: number;
  title: string;
  authorId: number;
  publishedYear: number;
}

interface IAutor {
  id: number;
  name: string;
  birthYear: number;
}
interface IBookService {
  getBookById(id: number): IBook | undefined;
  getAuthorById(id: number): IAutor | undefined;
  getAllBooks(): IBook[];
  getAllAuthors(): IAutor[];
}
const books: IBook[] = [
  { id: 1, title: 'My Brilliant Friend', authorId: 1, publishedYear: 2018 },
  { id: 2, title: 'Madly, Deeply', authorId: 2, publishedYear: 2015 },
  { id: 3, title: 'The Gates of Europe', authorId: 3, publishedYear: 2021 },
];

const authors: IAutor[] = [
  { id: 1, name: 'Elena Ferante', birthYear: 1943 },
  { id: 2, name: 'Alan Rickman', birthYear: 1946 },
  { id: 3, name: 'Serhii Plokhiy', birthYear: 1957 },
];
const bookService: IBookService = {
  getBookById: id => books.find(book => book.id === id),
  getAuthorById: id => authors.find(author => author.id === id),
  getAllBooks() {
    return books;
  },
  getAllAuthors() {
    return authors;
  },
};
