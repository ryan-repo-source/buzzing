import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import NavBarr from './Comp/NavBarr';
import { FaMapMarkerAlt, FaClock, FaGlobe, FaTwitter, FaBriefcase, FaBoxes } from 'react-icons/fa';
import RenderHtml from '../../helpers/RenderHtml';
import JobDetailSkeleton from './Comp/JobDetailSkeleton';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: '' });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(
          `https://buzzinguniverse.com/backend/api/job/detail/${id}`
        );
        if (res.data.status) {
          setJob(res.data.data);
        } else {
          setStatus(prev => ({ ...prev, error: 'Job not found.' }));
        }
      } catch {
        setStatus(prev => ({ ...prev, error: 'Failed to fetch job.' }));
      } finally {
        setStatus(prev => ({ ...prev, loading: false }));
      }
    };
    fetchJob();
  }, [id]);

  if (status.loading) {
    return <JobDetailSkeleton />;
  }

  if (status.error || !job) {
    return <p className="error">{status.error || 'Job doesn’t exist.'}</p>;
  }

  return (
    <div className="container-jobW">
      <motion.div
        className="jobWrpert col-lg-9"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >

        <div className="jb-job-header">
          <div className="jb-header-left">
            <img
              src={`https://buzzinguniverse.com/backend/${job.company_logo}`}
              alt={job.company_name}
              className="jb-company-logo"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/b.png';
              }}
            />
            <div className="jb-header-text">
              <h1 className="jb-job-title">{job.job_title}</h1>
              <a href={job.company_website || '#'} target="_blank" rel="noopener noreferrer" className="jb-company-name">
                {job.company_name}
              </a>
              {job.company_tagline && (
                <p className="jb-company-tagline">{job.company_tagline}</p>
              )}
            </div>
          </div>
          <div className="jb-header-icons">
            {job.company_website && (
              <a href={job.company_website} target="_blank" rel="noopener noreferrer" className="jb-icon-circle">
                <FaGlobe />
              </a>
            )}
            {job.company_twitter && (
              <a href={`https://twitter.com/${job.company_twitter.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" className="jb-icon-circle">
                <FaTwitter />
              </a>
            )}
          </div>
        </div>

        <section className="jb-key-points">
          <div><strong>Job Type:</strong> {job.job_type}</div>
          <div><strong>Location:</strong> {job.location} {job.is_remote ? '• Remote' : ''}</div>
        </section>

        {job.company_video && (
          <section className="jb-video">
            {job.company_video.includes('youtube.com') || job.company_video.includes('youtu.be') ? (
              <iframe width={560} height={315} src={job.company_video} title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />

            ) : job.company_video.match(/\.(mp4|webm|ogg)$/i) ? (
              <video controls className="jb-native-video">
                <source src={job.company_video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="jb-video-error">
                ⚠️ Unable to display video. Unsupported format.
              </div>
            )}
          </section>
        )}


        <section className="jb-description">
          <h4><strong>Job Description:</strong></h4>
          {RenderHtml(job.description)}

          {job.responsibilities && (
            <>
              <h3>Responsibilities:</h3>
              <ul>
                {job.responsibilities.split('\n').map((line, i) => <li key={i}>{line}</li>)}
              </ul>
            </>
          )}

          {job.requirements && (
            <>
              <h3>Requirements:</h3>
              <ul>
                {job.requirements.split('\n').map((line, i) => <li key={i}>{line}</li>)}
              </ul>
            </>
          )}
        </section>

        {job.application && (
          <a
            href={
              job.application.includes('@')
                ? `mailto:${job.application}`
                : job.application.startsWith('http')
                  ? job.application
                  : '#'
            }
            className="jb-apply-btn"
            target={job.application.startsWith('http') ? '_blank' : '_self'}
            rel="noopener noreferrer"
          >
            Apply for job
          </a>
        )}
      </motion.div>

      <aside className="jb-sidebar">
        <div className="jb-overview">
          <h3>Job Overview</h3>
          <ul className="jb-overview-list">
            <li>
              <span className="jb-icon"><FaClock /></span>
              <div className="jb-meta">
                <label>Date Posted</label>
                <p className="jb-muted">Posted 5 years ago</p>
              </div>
            </li>
            <li>
              <span className="jb-icon"><FaMapMarkerAlt /></span>
              <div className="jb-meta">
                <label>Location</label>
                <p>{job.location}</p>
              </div>
            </li>
            <li>
              <span className="jb-icon"><FaBriefcase /></span>
              <div className="jb-meta">
                <label>Job Type</label>
                <p>{job.job_type}</p>
              </div>
            </li>
            <li>
              <span className="jb-icon"><FaBoxes /></span>
              <div className="jb-meta">
                <label>Category</label>
                <p>{job.category || 'Uncategorized'}</p>
              </div>
            </li>
          </ul>
        </div>
      </aside>

    </div>
  );
}

export default JobDetail;
