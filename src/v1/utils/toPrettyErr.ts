export default function toPrettyErr(err: Error) {
  return {
    name: err.name,
    message: err.message,
    stack: err.stack.split("\n"),
  };
}
