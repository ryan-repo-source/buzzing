import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { useUserContext } from '../context/UserContext';

const AddEvents = () => {
  const { auth_data } = useUserContext();
  const auth = auth_data;

  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    tags: '',
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const categories = [
    'Business', 'Fashion', 'Finance', 'Food', 'Fun', 'Health', 'Hobbies',
    'Jobs', 'Lifestyle', 'Marketing', 'Sports', 'Technology', 'Traveling',
    'Uncategorized', 'Weather'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setForm(prev => ({ ...prev, description: content }));
  };

  const handleImageChange = (e) => {
    setForm(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required.';
    if (!form.category) newErrors.category = 'Category is required.';
    if (!form.description.trim()) newErrors.description = 'Description is required.';
    if (!form.image) newErrors.image = 'Featured image is required.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const tagArray = form.tags.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    setLoading(true);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('category', form.category);
    formData.append('description', form.description);
    formData.append('picture', form.image);
    formData.append('user_id', auth.id);
    tagArray.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    try {
      const res = await axios.post(
        'https://buzzinguniverse.com/backend/api/add-article',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setAlert({ type: 'success', message: 'Post created successfully!' });
      setForm({ title: '', category: '', description: '', tags: '', image: null });
      setErrors({});
    } catch (err) {
      setAlert({ type: 'error', message: 'Error creating post. Please try again later.' });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert({ type: '', message: '' }), 4000);
    }
  };

  const renderAlert = () => {
    if (!alert.message) return null;
    return (
      <div className={`custom-alert ${alert.type}`}>
        {alert.message}
      </div>
    );
  };

  return (
    <div className="add-post-container">
      <h2 className="form-title">Create New Event</h2>
      {renderAlert()}
      <form onSubmit={handleSubmit} className="add-post-form" encType="multipart/form-data">
        <div className="form-group">
          <label>Title</label>
          <input type="text" name="title" value={form.title} onChange={handleInputChange} />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label>Category</label>
          <select name="category" value={form.category} onChange={handleInputChange}>
            <option value="">-- select --</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <span className="error-text">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label>Article Description</label>
          <Editor
            value={form.description}
            onEditorChange={handleEditorChange}
            apiKey='jjoezv7zjhdqr8rlsyfxlcrfp36kxt1fx0aaeboyoucksasy'
            init={{
              height: 300,
              menubar: false,
              plugins: ['link', 'lists', 'image', 'media', 'table', 'code'],
              toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link image | code',
            }}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label>Featured Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {errors.image && <span className="error-text">{errors.image}</span>}
        </div>

        <div className="form-group">
          <label>Tags</label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleInputChange}
            placeholder="e.g. music, tech, sports"
          />
        </div>

        <button type="submit" className='btncs' disabled={loading}>
          {loading ? 'Publishing...' : 'Add Event'}
        </button>
      </form>
    </div>
  );
};

export default AddEvents;
