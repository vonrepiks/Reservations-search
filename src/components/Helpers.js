export default {
  dateDiffInDays(firstDate, secondDate) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    const utc1 = Date.UTC(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());
    const utc2 = Date.UTC(secondDate.getFullYear(), secondDate.getMonth(), secondDate.getDate());
    
    return Math.abs(Math.floor((utc2 - utc1) / _MS_PER_DAY));
  },

  uniqueArr(arr) {
    const uniqueArrayElements = arr.reduce((a, c) => {
      !a.hash[c] && a.result.push(c);
      a.hash[c] = true;
      return a;
    }, { result: [], hash: {} });
    return uniqueArrayElements.result;
  }
}