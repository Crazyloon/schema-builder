"use client";

const SchemaViewer = ({ json }) => {
  return (
    <pre>
      <code className="language-json">{JSON.stringify(json, null, 2)}</code>
    </pre>
  );
};

export default SchemaViewer;
