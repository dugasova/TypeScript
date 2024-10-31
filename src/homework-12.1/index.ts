enum GridFilterTypeEnum {
  ExactMatch,
  Range,
  ValueSearch,
}

type GridFilterValue<T> = {
  type: GridFilterTypeEnum;
  filter: Extract<T, string | number>;
  filterTo?: Extract<T, string | number>;
};

type GridFilterSetValues<T> = {
  values: T[];
};

interface IMovie {
  title: string;
  releaseYear: number;
  rating: number;
  awards: string[];
}

interface ICategory {
  name: string;
  movies: IMovie[];
}

interface IMovieFilter {
  titleFilter?: GridFilterValue<string>;
  releaseYearFilter?: GridFilterValue<number>;
  ratingFilter?: GridFilterValue<number>;
  awardsFilter?: GridFilterSetValues<string>;
}

interface ICategoryFilter {
  nameFilter: GridFilterSetValues<string>;
}

class MovieList {
  private movies: IMovie[];
  private filters: IMovieFilter;

  public constructor(movies: IMovie[]) {
    this.movies = movies;
    this.filters = {
      titleFilter: { type: GridFilterTypeEnum.ExactMatch, filter: '' },
      releaseYearFilter: { type: GridFilterTypeEnum.Range, filter: 0, filterTo: 0 },
      ratingFilter: { type: GridFilterTypeEnum.Range, filter: 0, filterTo: 0 },
      awardsFilter: { values: [] },
    };
  }

  applySearchValue(title: string): void {
    this.filters.titleFilter = {
      type: GridFilterTypeEnum.ExactMatch,
      filter: title,
    };
  }

  applyFiltersValue(
    filter: keyof IMovieFilter,
    value: GridFilterSetValues<string> | GridFilterValue<number> | GridFilterValue<string>
  ): void {
    switch (filter) {
      case 'titleFilter':
        this.filters[filter] = value as GridFilterValue<string>;
        break;

      case 'releaseYearFilter':
      case 'ratingFilter':
        this.filters[filter] = value as GridFilterValue<number>;
        break;

      case 'awardsFilter':
        this.filters[filter] = value as GridFilterSetValues<string>;
    }
  }

  public getMovies(): IMovie[] {
    let filteredMovies = this.movies;

    let titleFilter = this.filters.titleFilter?.filter as string;
    if (titleFilter !== '') {
      filteredMovies = filteredMovies.filter(movie => movie.title.toLowerCase().includes(titleFilter.toLowerCase()));
    }

    let fromFilter = this.filters.releaseYearFilter?.filter as number;
    let toFilter = this.filters.releaseYearFilter?.filterTo as number;
    if (toFilter >= fromFilter && fromFilter + toFilter > 0) {
      filteredMovies = filteredMovies.filter(movie => movie.releaseYear >= fromFilter && movie.releaseYear <= toFilter);
    }

    fromFilter = this.filters.ratingFilter?.filter as number;
    toFilter = this.filters.ratingFilter?.filterTo as number;
    if (toFilter >= fromFilter && fromFilter + toFilter > 0) {
      filteredMovies = filteredMovies.filter(movie => movie.rating >= fromFilter && movie.rating <= toFilter);
    }

    let awards = this.filters.awardsFilter?.values;
    filteredMovies = filteredMovies.filter(
      movie => this.filters.awardsFilter?.values.some(i => movie.awards.includes(i))
    );

    return filteredMovies;
  }
}

class CategoryList {
  private categories: ICategory[];
  private filter: ICategoryFilter;

  public constructor(categories: ICategory[]) {
    this.categories = categories;
    this.filter = { nameFilter: { values: [] } };
  }

  applySearchValue(names: string[]): void {
    this.filter = { nameFilter: { values: names } };
  }

  public getCategories(): ICategory[] {
    return this.categories.filter(category => this.filter.nameFilter.values.includes(category.name));
  }
}

const movies: IMovie[] = [
  { title: 'Top Gun', releaseYear: 2022, rating: 8.2, awards: ['Oscar', 'BAFTA'] },
  { title: 'The Wolf of Wall Street', releaseYear: 2013, rating: 8.8, awards: ['Oscar'] },
  { title: 'Oppenheimer', releaseYear: 2023, rating: 8.6, awards: ['Oscar'] },
];

const categories: ICategory[] = [{ name: 'Sci-Fi', movies: movies }];
const movieList = new MovieList(movies);
const categoryList = new CategoryList(categories);
movieList.applySearchValue('Oppenheimer');
movieList.applyFiltersValue('titleFilter', { type: GridFilterTypeEnum.ExactMatch, filter: 'The Wolf of Wall Street' });
movieList.applyFiltersValue('releaseYearFilter', { type: GridFilterTypeEnum.Range, filter: 2010, filterTo: 2014 });
movieList.applyFiltersValue('ratingFilter', { type: GridFilterTypeEnum.Range, filter: 3.6, filterTo: 8.8 });
movieList.applyFiltersValue('awardsFilter', { values: ['Oscar'] });

categoryList.applySearchValue(['Sci-Fi']);
console.log(movieList.getMovies());
console.log(categoryList.getCategories());
