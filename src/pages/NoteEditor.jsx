import React, { useState } from 'react';

function NoteEditor() {
  const [text, setText] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleNewNote = () => {
    setText('');
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'note.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="note-editor-container">
      <textarea
        className="note-textarea"
        placeholder="Start typing your notes..."
        value={text}
        onChange={handleTextChange}
      ></textarea>

      <div className="note-actions">
        <button onClick={handleNewNote} className="note-button new-note">New Note</button>
        <label htmlFor="file-upload" className="note-button upload-label">
          Upload
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".txt"
          onChange={handleUpload}
          className="hidden-input"
        />
        <button onClick={handleDownload} className="note-button download-note">Download</button>
        <div className="note-stats">
          <span>Words: {wordCount}</span> &nbsp;|&nbsp;
          <span>Characters: {charCount}</span>
        </div>
      </div>
    </div>
  );
}

export default NoteEditor;
