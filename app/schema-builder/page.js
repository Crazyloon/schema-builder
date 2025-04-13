import { v4 as generateGuid } from "uuid";
import SchemaBuilder from "./SchemaBuilder";

const initialItem = {
  name: "Title",
  property: "title",
  propertyType: "object",
  description: "the title of the invoice",
  extractInstructions: "",
  exampleValue: "",
  id: generateGuid(),
  position: 0,
  depth: 0,
  children: [],
};

const Page = () => {
  return <SchemaBuilder initialItem={initialItem} />;
};

export default Page;
