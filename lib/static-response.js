const textSnippet = {
  message: `
Here's a for loop in javascript.
\`\`\`
for (let index = 0; index < array.length; index++) {
  const element = array[index];
}
\`\`\``,
  role: "assistant",
};

export const userTextSnippet = {
  message: `
write a for loop snippet in javascript.`,
  role: "user",
};

export default textSnippet;
