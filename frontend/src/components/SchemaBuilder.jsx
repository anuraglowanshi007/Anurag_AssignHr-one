import React, { useState } from 'react';
import SchemaField from './SchemaField';
import JSONPreview from './JSONPreview';
import './SchemaBuilder.css';

const SchemaBuilder = () => {
  const [schema, setSchema] = useState([]);

  const updateField = (index, updatedField) => {
    const newSchema = [...schema];
    newSchema[index] = updatedField;
    setSchema(newSchema);
  };

  const addField = () => {
    setSchema([...schema, { key: '', type: 'String' }]);
  };

  const deleteField = (index) => {
    const newSchema = schema.filter((_, i) => i !== index);
    setSchema(newSchema);
  };

  return (
    <div className="builder-wrapper">
      <div className="form-builder">
        <div className="builder-header">
          {schema.length === 0 && (
            <button onClick={addField} className="add-btn">+ Add Items</button>
          )}
        </div>
        <div className="fields">
          {schema.map((field, index) => (
            <SchemaField
              key={index}
              field={field}
              onChange={(updatedField) => updateField(index, updatedField)}
              onDelete={() => deleteField(index)}
            />
          ))}
          {schema.length > 0 && (
            <button onClick={addField} className="add-btn add-btn-bottom">+ Add Items</button>
          )}
        </div>
      </div>
      <JSONPreview data={schema} />
    </div>
  );
};

export default SchemaBuilder; 