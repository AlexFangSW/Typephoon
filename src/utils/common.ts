export function debounce<T extends any[], R>(
  callback: (...args: T) => R | Promise<R>,
  wait: number
): (...args: T) => Promise<R> {
  let timeoutId: NodeJS.Timeout | undefined = undefined;
  
  return (...args: T): Promise<R> => {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(async () => {
        try {
          const result = await callback(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, wait);
    });
  };
}