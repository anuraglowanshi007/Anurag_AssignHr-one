import React from 'react';
import './SchemaBuilder.css';

const getTypeString = (type) => {
  switch (type) {
    case 'String':
      return 'string';
    case 'Number':
      return 'number';
    case 'Boolean':
      return 'boolean';
    case 'Date':
      return 'date';
    default:
      return null;
  }
};

const buildSchema = (fields) => {
  const result = {};
  fields.forEach((field) => {
    if (!field.key) return;
    if (field.type === 'Nested') {
      result[field.key] = buildSchema(field.children || []);
    } else if (field.type === 'Array') {
      if (field.item) {
        if (field.item.type === 'Nested') {
          result[field.key] = [buildSchema(field.item.children || [])];
        } else if (field.item.type === 'Array') {
          // Support for nested arrays
          result[field.key] = [buildSchema([{...field.item, key: 'item'}])];
        } else {
          result[field.key] = [getTypeString(field.item.type)];
        }
      } else {
        result[field.key] = [];
      }
    } else {
      result[field.key] = getTypeString(field.type);
    }
  });
  return result;
};

const JSONPreview = ({ data }) => {
  return (
    <div className="json-preview">
      <pre>{JSON.stringify(buildSchema(data), null, 2)}</pre>
    </div>
  );
};

export default JSONPreview; 