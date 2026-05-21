import type {
  OperatorFilterEnum,
  SearchFieldEnum,
  SearchOperatorEnum,
  SortOrderEnum,
} from "../enum";
import type {
  FilterFieldType,
  FilterValueType,
  LimitType,
  OffSetType,
  SearchValueType,
  SortByType,
} from "../types";

export interface QueryInterface {
  searchValue?: SearchValueType;
  searchField?: SearchFieldEnum;
  searchOperator?: SearchOperatorEnum;
  limit?: LimitType;
  offset?: OffSetType;
  sortBy?: SortByType;
  sortDirection?: SortOrderEnum;
  filterField?: FilterFieldType;
  filterValue?: FilterValueType;
  filterOperator?: OperatorFilterEnum;
}
