// Cтворити умовний тип, що служить для встановлення типу,
// що повертається з функції. Як параметр типу повинен обов'язково виступати функціональний тип.

type ReturnTypeOfFunction<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : never;
const exampleOfFuncton = (x: string, y: string) => {
  return x + y;
};
type ResultTypy = ReturnTypeOfFunction<typeof exampleFunction>; //string

// Cтворити умовний тип, який приймає функціональний тип з одним
// параметром (або задовільним) та повертає кортеж, де перше значення - це тип, що функція повертає,
// а другий - тип її параметр

type TypeReturned<T extends (param: any) => any> = T extends (arg: infer P) => infer U ? [U, P] : never;

const exampleFunction = (x: number): string => {
  return x.toString();
};

type ExampleFunctionInfo = TypeReturned<typeof exampleFunction>; //[string, number]
