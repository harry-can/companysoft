import {stringMap} from '../utils/stringsmap';

export const SortFiles = (files: Array<any>) => {
  return quickSort(files, 0, files.length - 1);
};

const extractFileNumber = (name: string) => {
  return name.replace(/[^(१|२|३|४|५|६|७|८|९|०|1|2|3|4|5|6|7|8|9|0)]+/g, '');
};

export const quickSort = (arr: Array<any>, left: number, right: number) => {
  var pivot, partitionIndex;

  if (left < right) {
    pivot = right;
    partitionIndex = partition(arr, pivot, left, right);

    //sort left and right
    quickSort(arr, left, partitionIndex - 1);
    quickSort(arr, partitionIndex + 1, right);
  }
  return arr;
};

const partition = (
  arr: Array<any>,
  pivot: number,
  left: number,
  right: number,
) => {
  var pivotValue =
      stringMap[extractFileNumber(arr[pivot].name.substring(0, 4))],
    partitionIndex = left;

  for (var i = left; i < right; i++) {
    if (
      stringMap[extractFileNumber(arr[i].name.substring(0, 4))] < pivotValue
    ) {
      swap(arr, i, partitionIndex);
      partitionIndex++;
    }
  }
  swap(arr, right, partitionIndex);
  return partitionIndex;
};

const swap = (arr: Array<any>, i: number, j: number) => {
  var temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};
