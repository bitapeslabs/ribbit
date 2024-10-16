export const functionSubmit = (
  e: React.FormEvent<HTMLFormElement>,
  callback: () => void
) => {
  e.preventDefault();
  console.log("calling");
  callback();
};
