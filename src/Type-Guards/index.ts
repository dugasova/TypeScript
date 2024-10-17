interface IBudget {
  debit: number;
  credit: number;
}
const ZERO_BUDGET_VALUE = 0;
enum EmployeeStatusEnum {
  Active = 'active',
  Inactive = 'inactive',
  UnpaidLeave = 'unpaid_leave',
}

interface IDepartmentInfo {
  name: string;
  domain: string;
}
interface IPaymentInfo {
  iban: string;
  code: number;
}

class Company {
  public name: string = 'Company Name';
  public departments: Department[] = [];
  public preHiredEmployee: PreHiredEmployee[] = [];
  public allEmployees: (Employee | PreHiredEmployee)[] = [];

  get staff(): (PreHiredEmployee | Employee)[] {
    return [...this.departments.flatMap(item => item.employees), ...this.preHiredEmployee];
  }
}

class Department {
  public name: string;
  public domain: string;
  public employees: Employee[] = [];
  public budget: IBudget = {
    debit: ZERO_BUDGET_VALUE,
    credit: ZERO_BUDGET_VALUE,
  };
  constructor(name: string, domain: string, employees: Employee[]) {
    this.name = name;
    this.domain = domain;
    this.employees = employees;
  }

  get balance(): number {
    return this.budget.debit - this.budget.credit;
  }

  public addEmployee(someEmployee: Employee | PreHiredEmployee, paymentInfo: IPaymentInfo): void {
    if (isEmployee(someEmployee)) {
      someEmployee.department = this;
      this.employees.push(someEmployee);
    } else {
      const newEmployee = new Employee(someEmployee.firstName, someEmployee.lastName, someEmployee.salary, paymentInfo);
      this.employees.push(newEmployee);
    }
    this.budget.credit -= someEmployee.salary;
  }
  public removeEmployee(employeeLastName: string, employeeFirstName: string): void {
    const employeeToRemove = employeeLastName + employeeFirstName;
    this.employees = this.employees.filter(employee => employee.lastName + employee.firstName !== employeeToRemove);
  }
}
class PreHiredEmployee {
  constructor(
    public firstName: string,
    public lastName: string,
    public salary: number,
    public bankAccountNumber: string
  ) {}
}
class Employee {
  firstName: string;
  lastName: string;
  paymentInfo: IPaymentInfo;
  salary: number;
  status: EmployeeStatusEnum = EmployeeStatusEnum.UnpaidLeave;
  department: Department | null = null;
  constructor(firstName: string, lastName: string, salary: number, paymentInfo: IPaymentInfo) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.salary = salary;
    this.paymentInfo = paymentInfo;
  }
}

class AccountingDepartment extends Department {
  salaryBalance: (Department | Employee | PreHiredEmployee)[] = [];

  constructor(name: string, domain: string, employees: Employee[]) {
    super(name, domain, employees);
  }

  public takeOnBalance(entity: Department | Employee | PreHiredEmployee): void {
    if (isDepartment(entity)) {
      this.salaryBalance.push(...entity.employees);
    } else {
      this.salaryBalance.push(entity);
    }
  }

  public removeFromBalance(entity: Employee | Department): void {
    if (isEmployee(entity)) {
      this.employees = this.employees.filter(e => e !== entity);
      this.budget.credit += entity.salary;
    }
    // if (isDepartment(entity)) {
    //   this.salaryBalance += entity.balance;
    // }
  }
  public paySalaries(): void {
    for (const entity of this.salaryBalance) {
      if (isPreHiredEmployee(entity)) {
        this.externalPayment(entity);
      } else if (isEmployee(entity)) {
        if (entity.status !== EmployeeStatusEnum.Active) continue;
        this.internalPayment(entity);
      }
    }
  }
  internalPayment(employee: Employee): void {
    console.log(`${employee.firstName} ${employee.lastName} - Internal Payment`);
  }
  externalPayment(preHired: PreHiredEmployee): void {
    console.log(`${preHired.firstName} ${preHired.lastName} - Internal Payment`);
  }
}

function isPreHiredEmployee(entity: unknown): entity is PreHiredEmployee {
  return entity instanceof PreHiredEmployee;
}
function isEmployee(entity: unknown): entity is Employee {
  return entity instanceof Employee;
}
function isDepartment(entity: unknown): entity is Department {
  return entity instanceof Department;
}
