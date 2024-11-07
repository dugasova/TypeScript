type Uuid = string;
interface ITodoItem {
  id: Uuid;
  title: string;
  content: string;
  createdAt: Date;
  editedAt?: Date | null;
  isDone: boolean;
  editItem: (payload: ITodoItemEdited) => void;
}

interface ITodoItemEdited {
  title: ITodoItem['title'];
  content: ITodoItem['content'];
}

interface ITodoList {
  addItem: (item: BaseTodoItem) => ITodoItem;
  removeItem: (id: Uuid) => ITodoItem | null;
  editItem: (id: Uuid, payload: ITodoItemEdited) => ITodoItem;
  getItemById: (id: Uuid) => ITodoItem | null;
  getAllItems: () => ITodoItem[];
  numberOfTasks: number;
  itemInProgress: number;
  setTaskDone: (id: Uuid) => void;
}

abstract class BaseTodoItem implements ITodoItem {
  readonly id: Uuid = Math.random().toString(36).substring(2, 9);
  readonly createdAt = new Date();
  public editedAt?: Date | null = null;
  public isDone: boolean = false;

  constructor(
    public title: string,
    public content: string
  ) {
    if (!title.trim() || !content.trim()) {
      throw new Error('Todo item cannot be empty');
    }
  }

  public complete(): void {
    this.isDone = true;
  }

  public abstract editItem({ title, content }: ITodoItemEdited): void;
}

class TodoItem extends BaseTodoItem {
  public override editItem({ title, content }: ITodoItemEdited): void {
    throw new Error('TodoItem cannot be edited');
  }
}

class ConfirmedTodoItem extends BaseTodoItem {
  public editItem({ title, content }: ITodoItemEdited): void {
    if (this.title.trim()) {
      this.title = title;
    }

    if (this.content.trim()) {
      this.content = content;
    }

    this.editedAt = new Date();
  }
}

class TodoList implements ITodoList {
  protected items: ITodoItem[] = [];

  public addItem(item: BaseTodoItem): ITodoItem {
    this.items.push(item);
    return { ...item } as BaseTodoItem;
  }

  public getItemById(id: Uuid): ITodoItem {
    const item = this.items[this.findByIndexItem(id)];
    if (!item) {
      throw new Error('Task not found');
    }
    return item;
  }

  public get numberOfTasks(): number {
    return this.items.length;
  }

  public get itemInProgress(): number {
    return this.items.filter(item => !item.isDone).length;
  }

  public editItem(id: Uuid, payload: ITodoItemEdited): ITodoItem {
    const itemIndex = this.findByIndexItem(id);
    if (itemIndex < 0) {
      throw new Error(`${id} is not found`);
    }

    const item = this.items[itemIndex];
    item.editItem(payload);

    return { ...item };
  }

  public setTaskDone(id: Uuid): void {
    const itemIndex = this.findByIndexItem(id);
    const item = this.items[itemIndex];
    item.isDone;
  }

  public removeItem(id: Uuid): ITodoItem {
    const itemIndex = this.findByIndexItem(id);
    return this.items.splice(itemIndex, 1)[0];
  }

  public getAllItems(): ITodoItem[] {
    return this.items;
  }

  private findByIndexItem(id: Uuid): number {
    const itemIndex = this.items.findIndex(item => item.id === id);
    if (itemIndex < 0) {
      throw new Error(`${id} is not found`);
    }

    return itemIndex;
  }
}

class SortedTodoList extends TodoList {
  public sortByStatus(): ITodoItem[] {
    let result = this.items.sort((a, b) => Number(b.isDone) - Number(a.isDone));
    return result;
  }
  public sortByDateCreated(): ITodoItem[] {
    return this.getAllItems().sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
}

class SearchableTodoList extends TodoList {
  public searchByTitle(title: string): ITodoItem[] {
    return this.getAllItems().filter(item => item.title.includes(title));
  }

  public searchByContent(content: string): ITodoItem[] {
    return this.getAllItems().filter(item => item.content.includes(content));
  }
}

const todoList = new SearchableTodoList();

const task1 = new TodoItem('Task 1', 'Task 1 content');
todoList.addItem(task1);

const task2 = new TodoItem('Task 2', 'Task 2 content');
task2.complete();
todoList.addItem(task2);

const task3 = new ConfirmedTodoItem('Task 3', 'Task 3 content');
todoList.addItem(task3);
const editedItem = todoList.editItem(task3.id, { title: 'Task 3 edited', content: 'Task 3 content edited' });

const allItems = todoList.searchByContent('Task 3 content edited');
console.log(allItems);
console.log(todoList.numberOfTasks);
