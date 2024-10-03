interface IBudget {
  debit: number;
  credit: number;
}

interface IDepartmentInfo {
  name: string;
  domain: string;
}

interface IDepartment {
  name: string;
  domain: string;
  employees: IEmployee[];
  budget: IBudget;
  culculateBalance(): number;
  addEmployee(employee: IEmployee): void;
  removeEmployee(employeeId: number): void;
  promoteToEmployee(preHired: IPreHiredEmployee): void;
}

interface IEmployee {
  id: number;
  firstName: string;
  lastName: string;
  paymentInfo: {
    bankAccountNumber: string;
    salary: number;
  };
  status: 'active' | 'inactive' | 'unpaid_leave';
  department: IDepartmentInfo;
}

interface IPreHiredEmployee {
  firstName: string;
  lastName: string;
  salary: number;
  bankAccountNumber: string;
}

interface ICompany {
  name: string;
  departments: Department[];
  preHiredEmployee: IPreHiredEmployee[];
  allEmployees: IEmployee[];
}

class Company implements ICompany {
  constructor(
    public name: string,
    public departments: Department[],
    public preHiredEmployee: IPreHiredEmployee[],
    public allEmployees: IEmployee[]
  ) {}
}

class Department implements IDepartment {
  constructor(
    public name: string,
    public domain: string,
    public employees: IEmployee[],
    public budget: IBudget
  ) {}
  public culculateBalance(): number {
    return this.budget.credit - this.budget.debit;
  }
  public addEmployee(employee: IEmployee): void {
    this.employees.push(employee);
    this.budget.debit += employee.paymentInfo.salary;
  }
  public removeEmployee(employeeId: number): void {
    this.employees = this.employees.filter(employee => employee.id !== employeeId);
  }
  public promoteToEmployee(preHired: IPreHiredEmployee): void {
    const newEmployee: IEmployee = {
      id: this.employees.length + 1,
      firstName: preHired.firstName,
      lastName: preHired.lastName,
      paymentInfo: {
        bankAccountNumber: preHired.bankAccountNumber,
        salary: preHired.salary,
      },
      status: 'active',
      department: { name: this.name, domain: this.domain },
    };
    this.employees.push(newEmployee);
    this.budget.debit += preHired.salary;
  }
}

class AccountingDepartment extends Department {
  constructor(
    public name: string,
    public domain: string,
    public employees: IEmployee[],
    public budget: IBudget,
    public balance: number
  ) {
    super(name, domain, employees, budget);
    this.balance = balance;
  }

  public takeOnBalance(entity: IEmployee | IDepartment): void {
    if ('paymentInfo' in entity) {
      this.balance += entity.paymentInfo.salary;
    } else {
      this.balance += entity.culculateBalance();
    }
  }

  public removeFromBalance(entity: IEmployee | IDepartment): void {
    if ('paymentInfo' in entity) {
      this.balance -= entity.paymentInfo.salary;
    }
  }
  public paySalaries(): void {
    this.employees.forEach(employee => {
      if (employee.status === 'active') {
        this.balance -= employee.paymentInfo.salary;
      }
    });
  }
}

