import React, { useState } from 'react'
import axios from 'axios'
import NavBarr from './Comp/NavBarr'
import { useUserContext } from '../../context/UserContext'
import { motion } from 'framer-motion'
import { Editor } from '@tinymce/tinymce-react'

const AddJob = () => {
    const { auth_data } = useUserContext()
    const auth = auth_data

    const [formData, setFormData] = useState({
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
        company_logo: null
    })

    const [loading, setLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }))
    }

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            company_logo: e.target.files[0],
            company_logo_preview: URL.createObjectURL(e.target.files[0])
        }))
    }

    const resetForm = () => {
        setFormData({
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
            company_logo: null
        })
    }

    const showMessage = (type, message) => {
        if (type === 'success') setSuccessMsg(message)
        else setErrorMsg(message)

        setTimeout(() => {
            setSuccessMsg('')
            setErrorMsg('')
        }, 5000)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!auth || !auth.id) {
            showMessage('error', 'Please log in to submit a job.')
            return
        }

        setLoading(true)
        try {
            const data = new FormData()
            for (const key in formData) {
                if (formData[key] !== null) {
                    data.append(key, formData[key])
                }
            }

            data.append('user_id', auth.id)

            const response = await axios.post(
                'https://buzzinguniverse.com/backend/api/job/create',
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )

            showMessage('success', 'Job submitted successfully!')
            resetForm()
        } catch (error) {
            console.error('Submission error:', error);
            const err = Object.keys(error.response.data.errors)[0];
            showMessage('error', error.response.data.errors[err] || 'Submission failed. Try again later.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='container py-5'>
            <motion.div
                className='jobWrpert col-lg-8'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <NavBarr />

                <div className="jb-account-box">
                    <p>Your account<br /><span>You are currently signed in as {auth?.fname}. <a href="#">Sign out</a></span></p>
                </div>
                <form className="jb-form mb-4" onSubmit={handleSubmit}>
                    <section className="jb-section">
                        <h2 className="jb-section-title">Job details</h2>

                        <label className="jb-label">Job Title
                            <input type="text" name="job_title" className="jb-input" value={formData.job_title} onChange={handleChange} required />
                        </label>

                        <label className="jb-label">Location <span className="jb-optional">(optional)</span>
                            <input type="text" name="location" className="jb-input" placeholder='e.g. "London"' value={formData.location} onChange={handleChange} />
                        </label>

                        <label className="jb-label jb-checkbox-label">
                            <input type="checkbox" name="is_remote" checked={formData.is_remote === 1} onChange={handleChange} />
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
                                plugins: [
                                    'advlist autolink lists link charmap preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste help wordcount'
                                ],
                                toolbar:
                                    'undo redo | formatselect | bold italic underline | bullist numlist outdent indent | removeformat | help'
                            }}
                            onEditorChange={(content) =>
                                setFormData(prev => ({ ...prev, description: content }))
                            }
                        />

                        <label className="jb-label mt-4">Application email/URL
                            <input type="text" name="application" className="jb-input" value={formData.application} onChange={handleChange} required />
                        </label>
                    </section>

                    <section className="jb-section">
                        <h2 className="jb-section-title">Company details</h2>

                        <label className="jb-label">Company name
                            <input type="text" name="company_name" className="jb-input" value={formData.company_name} onChange={handleChange} required />
                        </label>

                        <label className="jb-label">Website <span className="jb-optional">(optional)</span>
                            <input type="text" name="company_website" className="jb-input" value={formData.company_website} onChange={handleChange} />
                        </label>

                        <label className="jb-label">Tagline <span className="jb-optional">(optional)</span>
                            <input type="text" name="company_tagline" className="jb-input" value={formData.company_tagline} onChange={handleChange} />
                        </label>

                        <label className="jb-label">Video <span className="jb-optional">(optional)</span>
                            <input type="text" name="company_video" className="jb-input" value={formData.company_video} onChange={handleChange} />
                        </label>

                        <label className="jb-label">Twitter username <span className="jb-optional">(optional)</span>
                            <input type="text" name="company_twitter" className="jb-input" value={formData.company_twitter} onChange={handleChange} />
                        </label>

                        <div className="jb-logo-upload">
                            <label className="jb-label">Logo <span className="jb-optional">(optional)</span></label>
                            {formData.company_logo_preview && (
                                <img src={formData.company_logo_preview} alt="Preview" className="jb-logo-preview-img" />
                            )}
                            {formData.company_logo && (
                                <div>
                                    <p>{formData.company_logo.name}</p>
                                    <a href="#" className="jb-remove-logo" onClick={() => setFormData({ ...formData, company_logo: null })}>[remove]</a>
                                </div>
                            )}
                            <input type="file" className="jb-file" onChange={handleFileChange} />
                        </div>
                    </section>

                    <div className="jb-buttons">
                        <button type="submit" className="jb-btn jb-btn-primary" disabled={loading}>
                            {loading ? 'Posting...' : 'Post Job'}
                        </button>
                    </div>
                </form>
                {successMsg && <div className="jb-msg jb-msg-success">{successMsg}</div>}
                {errorMsg && <div className="jb-msg jb-msg-error">{errorMsg}</div>}
            </motion.div>
        </div>
    )
}

export default AddJob
