import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from '../../context/UserContext';
import { motion } from 'framer-motion';
import { Editor } from '@tinymce/tinymce-react';
import { useParams, useNavigate } from 'react-router-dom';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth_data } = useUserContext();
  const auth = auth_data;

  const initial = {
    job_title: '',
    location: '',
    is_remote: 0,
    job_type: 'Full Time',
    description: '',
    application: '',
    company_name: '',
    company_website: '',
    company_tagline: '',
    company_video: '',
    company_twitter: '',
    company_logo: null,
    company_logo_preview: ''
  };

  const [formData, setFormData] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    axios.get(`https://buzzinguniverse.com/backend/api/job/detail/${id}`)
      .then(res => {
        if (res.data.status) {
          const j = res.data.data;
          setFormData({
            job_title: j.job_title || '',
            location: j.location || '',
            is_remote: j.is_remote || 0,
            job_type: j.job_type || 'Full Time',
            description: j.description || '',
            application: j.application || '',
            company_name: j.company_name || '',
            company_website: j.company_website || '',
            company_tagline: j.company_tagline || '',
            company_video: j.company_video || '',
            company_twitter: j.company_twitter || '',
            company_logo: null,
            company_logo_preview: j.company_logo
              ? `https://buzzinguniverse.com/backend/${j.company_logo}`
              : ''
          });
        } else {
          setMsg({ type: 'error', text: 'Job not found.' });
        }
      })
      .catch(() => setMsg({ type: 'error', text: 'Failed to load job.' }));
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        company_logo: file,
        company_logo_preview: URL.createObjectURL(file)
      }));
    }
  };

  const showTempMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 4000);
  };

  const handleUpdate = async e => {
    e.preventDefault();
    if (!auth?.id) return showTempMsg('error', 'Please log in.');

    setLoading(true);
    const data = new FormData();
    for (const key in formData) {
      const val = formData[key];
      if (val !== null) data.append(key, val);
    }
    data.append('user_id', auth.id);

    try {
      await axios.post(
        `https://buzzinguniverse.com/backend/api/job/update/${id}`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      showTempMsg('success', 'Job updated successfully!');
    } catch {
      showTempMsg('error', 'Failed to update job.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure?')) return;
    setLoading(true);
    try {
      await axios.delete(`https://buzzinguniverse.com/backend/api/job/delete/${id}`);
      navigate('/');
    } catch {
      showTempMsg('error', 'Failed to delete job.');
      setLoading(false);
    }
  };

  return (
    <div className="container-jobW">
      <motion.div
        className="jobWrpert col-lg-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {msg.text && (
          <div className={msg.type === 'success' ? 'jb-msg jb-msg-success' : 'jb-msg jb-msg-error'}>
            {msg.text}
          </div>
        )}

        <form className="jb-form" onSubmit={handleUpdate}>
          {/* Job Details */}
          <section className="jb-section">
            <h2 className="jb-section-title">Job details</h2>
            <label className="jb-label">Job Title
              <input name="job_title" className="jb-input" value={formData.job_title} onChange={handleChange} required />
            </label>
            <label className="jb-label">Location <span className="jb-optional">(optional)</span>
              <input name="location" className="jb-input" value={formData.location} onChange={handleChange} />
            </label>
            <label className="jb-label jb-checkbox-label">
              <input name="is_remote" type="checkbox" checked={formData.is_remote === 1} onChange={handleChange} />
              Remote Position <span className="jb-optional">(optional)</span>
            </label>
            <label className="jb-label">Job type
              <select name="job_type" className="jb-select" value={formData.job_type} onChange={handleChange}>
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Freelance</option>
              </select>
            </label>
            <label className="jb-label">Description</label>
            <Editor
              apiKey="jjoezv7zjhdqr8rlsyfxlcrfp36kxt1fx0aaeboyoucksasy"
              value={formData.description}
              init={{
                height: 300,
                menubar: false,
                plugins: ['advlist autolink lists link charmap searchreplace visualblocks code fullscreen insertdatetime media table paste help'],
                toolbar: 'undo redo | formatselect | bold italic underline | bullist numlist outdent indent | removeformat | help'
              }}
              onEditorChange={content => setFormData(prev => ({ ...prev, description: content }))}
            />
            <label className="jb-label mt-4">Application email/URL
              <input name="application" className="jb-input" value={formData.application} onChange={handleChange} required />
            </label>
          </section>

          {/* Company Details */}
          <section className="jb-section">
            <h2 className="jb-section-title">Company details</h2>
            <label className="jb-label">Company name
              <input name="company_name" className="jb-input" value={formData.company_name} onChange={handleChange} required />
            </label>
            <label className="jb-label">Website <span className="jb-optional">(optional)</span>
              <input name="company_website" className="jb-input" value={formData.company_website} onChange={handleChange} />
            </label>
            <label className="jb-label">Tagline <span className="jb-optional">(optional)</span>
              <input name="company_tagline" className="jb-input" value={formData.company_tagline} onChange={handleChange} />
            </label>
            <label className="jb-label">Video <span className="jb-optional">(optional)</span>
              <input name="company_video" className="jb-input" value={formData.company_video} onChange={handleChange} />
            </label>
            <label className="jb-label">Twitter username <span className="jb-optional">(optional)</span>
              <input name="company_twitter" className="jb-input" value={formData.company_twitter} onChange={handleChange} />
            </label>

            <div className="jb-logo-upload">
              <label className="jb-label">Logo <span className="jb-optional">(optional)</span></label>
              {formData.company_logo_preview && (
                <img src={formData.company_logo_preview} alt="Preview" className="jb-logo-preview-img" />
              )}
              {formData.company_logo && (
                <div>
                  <p>{formData.company_logo.name}</p>
                  <a href="#" className="jb-remove-logo" onClick={e => { e.preventDefault(); setFormData(prev => ({ ...prev, company_logo: null })); }}>[remove]</a>
                </div>
              )}
              <input type="file" className="jb-file" onChange={handleFileChange} />
            </div>
          </section>

          <div className="jb-buttons">
            <button type="submit" disabled={loading} className="jb-btn jb-btn-primary">
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
            <button type="button" onClick={handleDelete} disabled={loading} className="jb-btn jb-btn-secondary">
              Delete Job
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditJob;
