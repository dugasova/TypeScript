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

interface Movie {
  title: string;
  releaseYear: number;
  rating: number;
  awards: string[];
}

interface Category {
  name: string;
  movies: Movie[];
}

interface MovieFilter {
  titleFilter?: GridFilterValue<string>;
  releaseYearFilter?: GridFilterValue<number>;
  ratingFilter?: GridFilterValue<number>;
  awardsFilter?: GridFilterSetValues<string>;
}

interface CategoryFilter {
  nameFilter?: GridFilterValue<string>;
  moviesFilter?: MovieFilter;
}

abstract class BaseList<T, F> {
  protected items: T[];
  protected currentFilter: F;

  constructor(items: T[]) {
    this.items = items;
    this.currentFilter = {} as F;
  }

  abstract applySearchValue(query: string): T[];
  abstract applyFiltersValue(filter: F): T[];
}

class MovieList extends BaseList<Movie, MovieFilter> {
  applySearchValue(title: string) {
    return this.items.filter(movie => movie.title.toLowerCase().includes(title.toLowerCase()));
  }

  applyFiltersValue(filter: MovieFilter) {
    let filteredMovies = this.items;

    if (filter.titleFilter) {
      const { filter: titleFilter } = filter.titleFilter;
      filteredMovies = filteredMovies.filter(movie => movie.title.toLowerCase().includes(titleFilter.toLowerCase()));
    }

    if (filter.releaseYearFilter) {
      const { filter: yearFilter, filterTo } = filter.releaseYearFilter;
      filteredMovies = filteredMovies.filter(movie =>
        filterTo ? movie.releaseYear >= yearFilter && movie.releaseYear <= filterTo : movie.releaseYear === yearFilter
      );
    }

    if (filter.ratingFilter) {
      const { filter: ratingFilter, filterTo } = filter.ratingFilter;
      filteredMovies = filteredMovies.filter(movie =>
        filterTo ? movie.rating >= ratingFilter && movie.rating <= filterTo : movie.rating === ratingFilter
      );
    }

    if (filter.awardsFilter) {
      const { values } = filter.awardsFilter;
      filteredMovies = filteredMovies.filter(movie => values.some(award => movie.awards.includes(award)));
    }

    return filteredMovies;
  }
}

class CategoryList extends BaseList<Category, CategoryFilter> {
  applySearchValue(name: string) {
    return this.items.filter(category => category.name.toLowerCase().includes(name.toLowerCase()));
  }

  applyFiltersValue(filter: CategoryFilter) {
    let filteredCategories = this.items;

    if (filter.nameFilter) {
      const { filter: nameFilter } = filter.nameFilter;
      filteredCategories = filteredCategories.filter(category =>
        category.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (filter.moviesFilter) {
      const movieFilter = filter.moviesFilter;
      filteredCategories = filteredCategories.filter(category =>
        category.movies.some(movie => {
          const movieList = new MovieList(category.movies);
          return movieList.applyFiltersValue(movieFilter).length > 0;
        })
      );
    }

    return filteredCategories;
  }
}

const movies: Movie[] = [
  { title: 'Top Gun', releaseYear: 2022, rating: 8.2, awards: ['Oscar', 'BAFTA'] },
  { title: 'The Wolf of Wall Street', releaseYear: 2013, rating: 8.8, awards: ['Oscar'] },
  { title: 'Oppenheimer', releaseYear: 2023, rating: 8.6, awards: ['Oscar'] },
];

const categories: Category[] = [{ name: 'Sci-Fi', movies: movies }];

const movieList = new MovieList(movies);
const categoryList = new CategoryList(categories);

const searchedMovies = movieList.applySearchValue('The Wolf of Wall Street');

const searchedCategories = categoryList.applySearchValue('Sci-Fi');

const filteredMovies = movieList.applyFiltersValue({
  titleFilter: { type: GridFilterTypeEnum.ExactMatch, filter: 'The Wolf of Wall Street' },
  releaseYearFilter: { type: GridFilterTypeEnum.Range, filter: 2010, filterTo: 2014 },
  ratingFilter: { type: GridFilterTypeEnum.ExactMatch, filter: 8.2 },
  awardsFilter: { values: ['Oscar'] },
});

const filteredCategories = categoryList.applyFiltersValue({
  nameFilter: { type: GridFilterTypeEnum.ExactMatch, filter: 'Sci-Fi' },
  moviesFilter: {
    titleFilter: { type: GridFilterTypeEnum.ExactMatch, filter: 'The Wolf of Wall Street' },
  },
});
