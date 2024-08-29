export function isFetching(isFetchingRef) {
  if (!isFetchingRef.current) {
    isFetchingRef.current = true;
  }
}
