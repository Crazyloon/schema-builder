"use server";

import SchemaBuilder from "./SchemaBuilder";

const initialItem = {
  name: "Title",
  property: "title",
  propertyType: "object",
  description: "the title of the invoice",
  extractInstructions: "",
  exampleValue: "",
  id: "41991b87-cc71-493e-bec6-28cd369ac6be",
  position: 0,
  depth: 0,
  parent: null,
  children: [],
};

const Page = () => {
  return <SchemaBuilder initialItem={initialItem} />;
};

export default Page;
