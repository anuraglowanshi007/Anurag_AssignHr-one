import React, { useState } from 'react';
import './SchemaBuilder.css';

const defaultArrayItem = { key: '', type: 'String' };

const SchemaField = ({ field, onChange, onDelete }) => {
  const [toggled, setToggled] = useState(false);

  const handleKeyChange = (e) => {
    onChange({ ...field, key: e.target.value });
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    const newField = { ...field, type: newType };
    if (newType === 'Nested') {
      newField.children = field.children || [];
      delete newField.item;
    } else if (newType === 'Array') {
      newField.item = {
        type: 'Nested',
        children: [],
      };
      delete newField.children;
    } else {
      delete newField.children;
      delete newField.item;
    }
    onChange(newField);
  };

  // For Nested
  const addNestedField = () => {
    const newChildren = [...(field.children || []), { key: '', type: 'String' }];
    onChange({ ...field, children: newChildren });
  };
  const updateNestedField = (index, updatedField) => {
    const newChildren = [...field.children];
    newChildren[index] = updatedField;
    onChange({ ...field, children: newChildren });
  };
  const deleteNestedField = (index) => {
    const newChildren = field.children.filter((_, i) => i !== index);
    onChange({ ...field, children: newChildren });
  };

  // For Array of Objects (Nested)
  const addArrayObjectField = () => {
    const newChildren = [...((field.item && field.item.children) || []), { key: '', type: 'String' }];
    onChange({
      ...field,
      item: { ...field.item, type: 'Nested', children: newChildren },
    });
  };
  const updateArrayObjectField = (index, updatedField) => {
    const newChildren = [...field.item.children];
    newChildren[index] = updatedField;
    onChange({
      ...field,
      item: { ...field.item, type: 'Nested', children: newChildren },
    });
  };
  const deleteArrayObjectField = (index) => {
    const newChildren = field.item.children.filter((_, i) => i !== index);
    onChange({
      ...field,
      item: { ...field.item, type: 'Nested', children: newChildren },
    });
  };

  // For Array of primitives
  const handleArrayItemChange = (updatedItem) => {
    onChange({ ...field, item: updatedItem });
  };

  const handleSwitchToggle = () => {
    setToggled((prev) => !prev);
  };

  const isArrayOfObjects = field.type === 'Array' && field.item && field.item.type === 'Nested';

  return (
    <div className="field-container">
      <input
        type="text"
        placeholder="Field Name"
        value={field.key}
        onChange={handleKeyChange}
        className="input"
      />
      <select value={field.type} onChange={handleTypeChange} className="select">
        <option value="String">String</option>
        <option value="Number">Number</option>
        <option value="Boolean">Boolean</option>
        <option value="Date">Date</option>
        <option value="Array">Array</option>
        <option value="Nested">Nested</option>
      </select>
      <label className="switch">
        <input type="checkbox" checked={toggled} onChange={handleSwitchToggle} />
        <span className="slider round"></span>
      </label>
      <button onClick={onDelete} className="delete-btn cross-btn" title="Delete field">&#10005;</button>

      {field.type === 'Nested' && (
        <div className="nested-container">
          {field.children && field.children.map((child, index) => (
            <SchemaField
              key={index}
              field={child}
              onChange={(updatedChild) => updateNestedField(index, updatedChild)}
              onDelete={() => deleteNestedField(index)}
            />
          ))}
          <button onClick={addNestedField} className="add-btn add-btn-bottom">+ Add Items</button>
        </div>
      )}

      {isArrayOfObjects && (
        <div className="nested-container">
          {(field.item.children || []).map((child, index) => (
            <SchemaField
              key={index}
              field={child}
              onChange={(updatedChild) => updateArrayObjectField(index, updatedChild)}
              onDelete={() => deleteArrayObjectField(index)}
            />
          ))}
          <button onClick={addArrayObjectField} className="add-btn add-btn-bottom">+ Add Items</button>
        </div>
      )}

      {field.type === 'Array' && field.item && field.item.type !== 'Nested' && (
        <div className="nested-container">
          <div style={{ marginBottom: 8, fontWeight: 500 }}>Array Item Type:</div>
          <SchemaField
            field={field.item || { ...defaultArrayItem }}
            onChange={handleArrayItemChange}
            onDelete={() => handleArrayItemChange({ key: '', type: 'String' })}
          />
        </div>
      )}
    </div>
  );
};

export default SchemaField; 