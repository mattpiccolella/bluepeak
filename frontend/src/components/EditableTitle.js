import React, { useState } from 'react';

function EditableTitle({ initialTitle, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(initialTitle); // [state, setState

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event) => {
    setCurrentTitle(event.target.value);
  };

  const handleSaveClick = () => {
    onSave(currentTitle); // You would pass this updated title to a parent component or API call
    setIsEditing(false);
  };

  return (
    <div>
    {isEditing ? (
      <div>
        <input
          type="text"
          value={currentTitle}
          onChange={handleInputChange}
        />
        <button onClick={handleSaveClick}>Save</button>
      </div>
    ) : (
      <div>
      <h2 onClick={handleTitleClick}>{currentTitle}</h2>
      </div>
    )}
  </div>
  );
}

export default EditableTitle;
