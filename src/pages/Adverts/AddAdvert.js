import React, { useState } from 'react'
import axios from 'axios'
import NavBarr from './Comp/NavBarr'
import { useUserContext } from '../../context/UserContext'
import { motion } from 'framer-motion'
import { Editor } from '@tinymce/tinymce-react'

const AddAdvert = () => {
    const { auth_data } = useUserContext()
    const auth = auth_data

    const [formData, setFormData] = useState({
        contact_person: auth?.fname || '',
        email: auth?.email || '',
        phone_number: '',
        title: '',
        category: '',
        gallery: [],
        description: '',
        price: '',
        location: ''
    })

    const [previewImages, setPreviewImages] = useState([])
    const [loading, setLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files)
        setFormData(prev => ({
            ...prev,
            gallery: [...prev.gallery, ...files]
        }))
        setPreviewImages(prev => ([
            ...prev,
            ...files.map(file => ({ file, url: URL.createObjectURL(file) }))
        ]))
    }

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }))
        setPreviewImages(prev => prev.filter((_, i) => i !== index))
    }

    const showMessage = (type, message) => {
        if (type === 'success') setSuccessMsg(message)
        else setErrorMsg(message)

        setTimeout(() => {
            setSuccessMsg('')
            setErrorMsg('')
        }, 5000)
    }

    const validateForm = () => {
        const requiredFields = ['contact_person', 'email', 'phone_number', 'title', 'category', 'description', 'price', 'location']
        for (let field of requiredFields) {
            if (!formData[field] || formData[field].toString().trim() === '') {
                showMessage('error', `Please fill in the ${field.replace('_', ' ')} field.`)
                return false
            }
        }

        // Basic email and phone validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const phoneRegex = /^[0-9+\-\s]{7,15}$/

        if (!emailRegex.test(formData.email)) {
            showMessage('error', 'Please enter a valid email address.')
            return false
        }

        if (!phoneRegex.test(formData.phone_number)) {
            showMessage('error', 'Please enter a valid phone number.')
            return false
        }

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!auth || !auth.id) {
            showMessage('error', 'Please log in to post an advert.')
            return
        }

        if (!validateForm()) return

        setLoading(true)
        try {
            const data = new FormData()
            for (const key in formData) {
                if (key === 'gallery') {
                    formData.gallery.forEach((file, index) => data.append(`gallery[]`, file))
                } else if (formData[key]) {
                    data.append(key, formData[key])
                }
            }
            data.append('user_id', auth.id)

            await axios.post(
                'https://buzzinguniverse.com/backend/api/advert/create',
                data,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            )

            showMessage('success', 'Advert posted successfully!')
            setFormData({
                contact_person: auth?.fname || '',
                email: auth?.email || '',
                phone_number: '',
                title: '',
                category: '',
                gallery: [],
                description: '',
                price: '',
                location: ''
            })
            setPreviewImages([])
        } catch (error) {
            console.error('Submission error:', error);
            const err = Object.keys(error.response?.data?.errors || {})[0]
            showMessage('error', error.response?.data?.errors[err] || 'Submission failed.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='container py-5'>
            <motion.div className='jobWrpert col-lg-8' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <NavBarr />
                <div className="jb-account-box">
                    <p>Your account<br /><span>You are currently signed in as {auth?.fname}. <a href="#">Sign out</a></span></p>
                </div>
                <form className='jb-form mb-4' onSubmit={handleSubmit}>
                    <section className='jb-section'>
                        <h2 className='jb-section-title'>Contact Information</h2>

                        <label className='jb-label'>Contact Person
                            <input type='text' name='contact_person' className='jb-input' value={formData.contact_person} onChange={handleChange} required />
                        </label>

                        <label className='jb-label'>Email
                            <input type='email' name='email' className='jb-input' value={formData.email} onChange={handleChange} required />
                        </label>

                        <label className='jb-label'>Phone Number
                            <input type='text' name='phone_number' className='jb-input' value={formData.phone_number} onChange={handleChange} required />
                        </label>
                    </section>

                    <section className='jb-section'>
                        <h2 className='jb-section-title'>Item Information</h2>

                        <label className='jb-label'>Title
                            <input type='text' name='title' className='jb-input' value={formData.title} onChange={handleChange} required />
                        </label>

                        <label className='jb-label'>Category
                            <select name='category' className='jb-select' value={formData.category} onChange={handleChange} required>
                                <option value=''>Select options</option>
                                <option value='Electronics'>Electronics</option>
                                <option value='Fashion'>Fashion</option>
                                <option value='Vehicles'>Vehicles</option>
                            </select>
                        </label>

                        <label className='jb-label mb-0'>Gallery</label>
                        <div className='jb-gallery-dropbox mb-3'>
                            <div className='jb-gallery-preview'>
                                {previewImages.map((img, index) => (
                                    <div className='jb-gallery-thumb' key={index}>
                                        <img src={img.url} alt={`preview-${index}`} />
                                        <button type='button' className='jb-remove-btn' onClick={() => removeImage(index)}>×</button>
                                    </div>
                                ))}
                            </div>
                            <input
                                type='file'
                                multiple
                                onChange={handleFileChange}
                                className='jb-gallery-input'
                            />
                            <div className='input-file-boxxs'>
                                <h4>Drop files here to add them.</h4>
                                <span>Browse File</span>
                            </div>
                        </div>

                        <label className='jb-label'>Description</label>
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

                        <label className='jb-label mt-4'>Price
                            <input type='text' name='price' className='jb-input' value={formData.price} onChange={handleChange} required />
                        </label>

                        <label className='jb-label'>Location
                            <input type='text' name='location' className='jb-input' value={formData.location} onChange={handleChange} required />
                        </label>
                    </section>

                    <div className='jb-buttons'>
                        <button type='submit' className='jb-btn jb-btn-primary' disabled={loading}>
                            {loading ? 'Posting...' : 'Post Advert'}
                        </button>
                    </div>
                </form>
                {successMsg && <div className='jb-msg jb-msg-success'>{successMsg}</div>}
                {errorMsg && <div className='jb-msg jb-msg-error'>{errorMsg}</div>}
            </motion.div>
        </div>
    )
}

export default AddAdvert
