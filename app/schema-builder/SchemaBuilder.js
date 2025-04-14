"use client";

import {
  Box,
  Button,
  FormControl,
  Icon,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useState } from "react";
import {
  AddBoxOutlined,
  AddCircleOutline,
  AddOutlined,
  DeleteForeverOutlined,
} from "@mui/icons-material";
import { v4 as generateGuid } from "uuid";
import SchemaViewer from "./SchemaViewer";
import {
  SimpleTreeView,
  TreeItem,
  treeItemClasses,
  useTreeViewApiRef,
} from "@mui/x-tree-view";
import { titleCaseFromCamelCase } from "../utils/test.js";

const jsonTypes = [
  "string",
  "number",
  "object",
  "array",
  "boolean",
  "null",
  "regularExpression",
];

function updateNode(tree, nodeId, updatedNode) {
  return tree.map((node) => {
    if (node.id === nodeId) {
      return { ...node, ...updatedNode };
    }
    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: updateNode(node.children, nodeId, updatedNode),
      };
    }
    return node;
  });
}

const SchemaBuilder = ({ initialItem }) => {
  const [json, setJson] = useState({
    items: [initialItem],
  });
  const apiRef = useTreeViewApiRef();

  const handleTypeChange = (item, propertyType) => {
    const updatedItem = { ...item };
    updatedItem.propertyType = propertyType;

    if (propertyType !== "object") {
      updatedItem.children = [];
    }

    const updated = { items: updateNode(json.items, item.id, updatedItem) };
    setJson(updated);
  };

  const handleInputChange = (event, item, key, value) => {
    console.log("event.key", event.key);
    if (event.key === "Space") {
    }
    const updatedItem = { ...item };
    updatedItem[key] = value;
    const updated = { items: updateNode(json.items, item.id, updatedItem) };
    setJson(updated);
  };

  const handleDeleteItem = (item) => {
    function deleteChildNode(tree, parentId, childId) {
      return tree.map((node) => {
        // If the current node is the parent
        if (node.id === parentId) {
          return {
            ...node,
            children: node.children.filter((child) => child.id !== childId),
          };
        }
        // Recurse into children
        if (node.children && node.children.length > 0) {
          return {
            ...node,
            children: deleteChildNode(node.children, parentId, childId),
          };
        }
        return node; // Return unchanged node
      });
    }
    setJson({ items: [...deleteChildNode(json.items, item.parent, item.id)] });
  };

  const handleAddSibling = (sibling) => {
    const newItem = {
      name: "Title",
      property: "title",
      propertyType: "object",
      description: "the title of the invoice",
      extractInstructions: "",
      exampleValue: "",
      id: generateGuid(),
      position: sibling.position + 1,
      depth: sibling.depth,
      parent: sibling.parent,
      children: [],
    };

    // recursivly find the parent node and add the new item to its children
    function addSibling(tree, parentId, newItem) {
      return tree.map((node) => {
        // If the current node is the parent
        if (node.id === parentId) {
          return {
            ...node,
            children: [...node.children, newItem],
          };
        }
        // Recurse into children
        if (node.children && node.children.length > 0) {
          return {
            ...node,
            children: addSibling(node.children, parentId, newItem),
          };
        }
        return node; // Return unchanged node
      });
    }
    const newItems = addSibling(json.items, sibling.parent, newItem);

    setJson({ items: newItems });
  };

  const handleAddChild = (item) => {
    const newChild = {
      name: "Title",
      property: "title",
      propertyType: "object",
      description: "the title of the invoice",
      extractInstructions: "",
      exampleValue: "",
      id: generateGuid(),
      position: item.children.length + 1,
      depth: item.depth + 1,
      parent: item.id,
      children: [],
    };

    const newItem = { ...item };
    newItem.children.push(newChild);

    const jsonItems = [...json.items];
    const newJson = { items: [...jsonItems] };

    setJson(newJson);
  };

  const renderItem = (item) => {
    return (
      <TreeItem
        key={item.id}
        itemId={item.id}
        label={titleCaseFromCamelCase(item.property)}
        className={`flex flex-col`}
        sx={{
          [`& .${treeItemClasses.content}`]: {
            borderLeft: `.25em solid gray`,
            borderRadius: "0px",
            position: "relative",
          },
          [`& .${treeItemClasses.content}:before`]: {
            // content: "''",
            // display: "inline-block",
            // width: "2em",
            // height: 0,
            // position: "relative",
            // left: "-.75em",
            // borderTop: ".25em solid gray",
          },
          [`& .${treeItemClasses.groupTransition}`]: {
            borderLeft: `.25em solid gray`,
            pl: 0,
          },
        }}
      >
        <div className={`flex flex-nowrap`}>
          <DragIndicatorIcon sx={{ alignSelf: "start", mt: 2, ml: 1 }} />
          <div className="flex flex-col grow">
            <TextField
              label={"Property Name"}
              variant="outlined"
              value={item.property}
              sx={{ m: 1, minWidth: 120 }}
              size="small"
              onKeyDownCapture={(e) => {
                if (e.code === "Space") {
                  e.preventDefault();
                }
                e.stopPropagation();
              }}
              onChange={(e) =>
                handleInputChange(e, item, "property", e.target.value)
              }
            />
          </div>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id={`select-label-${item.id}`}>Type</InputLabel>
            <Select
              labelId={`select-label-${item.id}`}
              id={`select-${item.id}`}
              value={item.propertyType}
              label="Type"
              onChange={(e) => handleTypeChange(item, e.target.value)}
            >
              {jsonTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <DeleteForeverOutlined
            onClick={() => handleDeleteItem(item)}
            sx={{
              alignSelf: "start",
              mt: "16px",
              ":hover": { scale: "1.2", cursor: "pointer" },
              ":active": { scale: "1" },
            }}
            color="error"
          />
        </div>
        <TextField
          multiline
          label={"Description"}
          variant="outlined"
          value={item.description}
          sx={{ m: 1, ml: 5, minWidth: "calc(100% - 72px)" }}
          size="small"
          onKeyDownCapture={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) =>
            handleInputChange(e, item, "description", e.target.value)
          }
        />
        <TextField
          multiline
          label={"Extract Instructions"}
          variant="outlined"
          value={item.extractInstructions}
          sx={{ m: 1, ml: 5, minWidth: "calc(100% - 72px)" }}
          size="small"
          onKeyDownCapture={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) =>
            handleInputChange(e, item, "extractInstructions", e.target.value)
          }
        />
        <TextField
          multiline
          label={"Example Value"}
          variant="outlined"
          value={item.exampleValue}
          sx={{ m: 1, ml: 5, minWidth: "calc(100% - 72px)" }}
          size="small"
          onKeyDownCapture={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) =>
            handleInputChange(e, item, "exampleValue", e.target.value)
          }
        />
        <>
          {item.propertyType === "object" ? (
            <Box
              className="flex"
              sx={{
                ":before": {
                  content: "''",
                  display: "inline-block",
                  position: "relative",
                  width: "2em",
                  height: 0,
                  left: "-0em",
                  borderTop: ".25em solid gray",
                },
              }}
            >
              <Button
                sx={{
                  lineHeight: "normal",
                  borderRadius: "0px",
                  ":not(last-child)": {
                    borderLeft: `.35em solid gray`,
                  },
                }}
                size="small"
                variant="text"
                startIcon={<AddBoxOutlined />}
                onClick={() => handleAddChild(item)}
              >
                {" "}
                Add Child
              </Button>
              {item.parent !== null && (
                <Button
                  sx={{
                    borderRadius: "4px",
                    lineHeight: "normal",
                  }}
                  size="small"
                  variant="text"
                  startIcon={<AddOutlined />}
                  onClick={() => handleAddSibling(item)}
                >
                  {" "}
                  Add Sibling
                </Button>
              )}
            </Box>
          ) : null}
        </>
        <div style={{ marginLeft: "32px" }}>
          {item.children &&
            item.children.length > 0 &&
            item.children.map((child) => {
              return renderItem(child);
            })}
        </div>
      </TreeItem>
    );
  };

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-1">
      <div>
        <span>Settings</span>
        <SimpleTreeView apiRef={apiRef}>
          {json.items &&
            json.items.map((item) => {
              return renderItem(item);
            })}
        </SimpleTreeView>
      </div>
      <div>
        <SchemaViewer json={json} />
      </div>
    </div>
  );
};

export default SchemaBuilder;
