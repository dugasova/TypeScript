enum ItemStatusEnum {
  New,
  InProgress,
  Done,
}

interface ITodoItem {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  editedAt?: Date;
  isDone: boolean;
  status: ItemStatusEnum;
}

class TodoItem implements ITodoItem {
  readonly id: string = Math.random().toString(36).substring(2, 9);
  public title: string = "";
  public content: string = "";
  readonly createdAt = new Date();
  public editedAt?: Date | undefined;
  public isDone: boolean = false;
  public status: ItemStatusEnum = ItemStatusEnum.New;

  constructor(title: string, content: string, status: ItemStatusEnum) {
    if (!title.trim() || !content.trim()) {
        throw new Error('Task cannot be empty!');
      }
  
    this.status = status;
    this.content = content;
    this.title = title;
    this.isDone = false;
  }

  public editItem(newTitle: string, newContent: string): void {
    if (this.title.trim()) {
      this.title = newTitle;
    }

    if (this.content.trim()) {
      this.content = newContent;
    }

    this.editedAt = new Date();
  }

  public changeStatus(): void {
    this.status = ItemStatusEnum.Done;
  }
}

class ConfirmeedTodoItem extends TodoItem {
    private isConfirmed: boolean = false;

    constructor(content: string, title: string) {
        super(title, content, ItemStatusEnum.New);
    }

    public confirm(): void {
        this.isConfirmed = true;
    }

    public editItem(newTitle: string, newContent: string): void {
        if (!this.isConfirmed)
            throw new Error('Task is not confirmed!');
        
        super.editItem(newTitle, newContent);
    }
}

class TodoList {
  items: { [id: string]: TodoItem } = {};

  public addNewItem(item: TodoItem): void {
    this.items[item.id] = item;
  }

  public get numberOfTasks(): number {
    return Object.keys(this.items).length;
  }

  public get itemInProgress(): number {
    return Object.entries(this.items).filter(([, item]) => item.isDone === false).length;
  }

  public getItem(id: string): TodoItem | undefined {
    return this.items[id];
  }

  public editTask(id: string, newTitle: string, newContent: string): void {
    this.items[id].editItem(newTitle, newContent);
  }

  public setTaskDone(id: string): void { 
    this.items[id].isDone = true;
  }

  public removeItem(id: string): void {
    delete this.items[id];
  }

  public get allItems(): TodoItem[] {
    return Object.values(this.items);
  }  
}

enum sortByEnum {
    date,
    status
}
  
class SortedTodoList extends TodoList {
  protected sortBy: sortByEnum;

  constructor(sortBy: sortByEnum) {
    super();
    this.sortBy = sortBy;
  }

  public get allItems(): TodoItem[] {
    switch( this.sortBy ) {
      case sortByEnum.date:
        return super.allItems.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      case sortByEnum.status:
        return super.allItems.sort((a, b) => b.status - a.status);
    }
  }
}

class SearchableTodoList extends TodoList {
    public searchByTitle(title: string): TodoItem[] {
        return Object.values(this.items).filter((item) => item.title.includes(title));
    }

    public searchByContent(content: string): TodoItem[] {
        return Object.values(this.items).filter((item) => item.content.includes(content));
    }
  }
  
const todoList = new SortedTodoList(sortByEnum.status);

const task1 = new TodoItem('Task 1', 'Task 1 content', ItemStatusEnum.New);
todoList.addNewItem(task1);

const task2 = new TodoItem('Task 2', 'Task 2 content', ItemStatusEnum.InProgress);
todoList.addNewItem(task2);
todoList.setTaskDone(task2.id);

const task3 = new ConfirmeedTodoItem('Task 3', 'Task 3 content');
todoList.addNewItem(task3);
task3.confirm();
todoList.editTask(task3.id, 'Task 3 edited', 'Task 3 content edited');

console.log(todoList.numberOfTasks);
console.log(todoList.itemInProgress);
console.log(todoList.allItems);

