"use client";

import {
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

const jsonTypes = ["string", "number", "object", "array"];

const SchemaBuilder = ({ initialItem }) => {
  const [json, setJson] = useState({
    items: [initialItem],
  });

  const handleTypeChange = (item, propertyType) => {
    item.propertyType = propertyType;

    const newItems = json.items.splice(
      json.items.indexOf((itm) => itm.id === item.id),
      1,
      item
    );
    const newJson = json;
    newJson.items = newItems;
    setJson(newJson);
  };

  const handleDeleteItem = (item) => {
    const newItems = json.items.splice(
      json.items.indexOf((itm) => itm.id === item.id),
      1
    );
    const newJson = json;
    newJson.items = newItems;
    setJson(newJson);
  };

  const handleAddSibling = () => {
    const newItem = {
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

    const jsonItems = json.items;
    const newJson = { items: [...jsonItems, newItem] };

    setJson(newJson);
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
      children: [],
    };

    const newItem = {
      name: "Title",
      property: "title",
      propertyType: "object",
      description: "the title of the invoice",
      extractInstructions: "",
      exampleValue: "",
      id: generateGuid(),
      position: 0,
      depth: 0,
      children: [...item.children, newChild],
    };

    const jsonItems = json.items;
    const parent = json.items.find((itm) => itm.id === item.id);
    const newJson = { items: [...jsonItems, newItem] };

    console.log("new Json", newJson);
    setJson(newJson);
  };

  return (
    <div>
      <span>Settings</span>
      {json.items &&
        json.items.map((item) => {
          return (
            <div key={item.id} className="flex flex-col">
              <div className="flex flex-nowrap">
                <DragIndicatorIcon sx={{ alignSelf: "center" }} />
                <TextField
                  label={item.name}
                  variant="outlined"
                  value={item.property}
                  sx={{ m: 1, minWidth: 120 }}
                  size="small"
                />
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
                  onClick={handleDeleteItem}
                  sx={{
                    alignSelf: "center",
                    ":hover": { scale: "1.2", cursor: "pointer" },
                    ":active": { scale: "1" },
                  }}
                  color="red"
                />
              </div>
              <>
                {item.propertyType === "object" ? (
                  <div className="flex flex-col items-start">
                    <Button
                      sx={{
                        borderRadius: "4px",
                        margin: "8px",
                        marginLeft: `${(item.depth + 1) * 32}px`,
                        lineHeight: "normal",
                      }}
                      size="small"
                      variant="text"
                      startIcon={<AddBoxOutlined />}
                      onClick={() => handleAddChild(item)}
                    >
                      {" "}
                      Add Child Element
                    </Button>
                    {json.items &&
                      json.items.indexOf(item) === json.items.length - 1 && (
                        <Button
                          sx={{
                            borderRadius: "4px",
                            margin: "8px",
                            lineHeight: "normal",
                          }}
                          size="small"
                          variant="text"
                          startIcon={<AddOutlined />}
                          onClick={handleAddSibling}
                        >
                          {" "}
                          Add Sibling Element
                        </Button>
                      )}
                  </div>
                ) : null}
              </>
            </div>
          );
        })}
    </div>
  );
};

export default SchemaBuilder;
