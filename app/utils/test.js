export const titleCaseFromCamelCase = (name) => {
  if (!name) return "";
  const words = name.replace(/([a-z])([A-Z])/g, "$1 $2").split(" ");
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return capitalizedWords.join(" ");
};
