export function print() {
  let args = [1, 2, 3, 4];
  let sum = args.reduce((prev, next) => prev + next, 5);
  console.log(sum());
}
