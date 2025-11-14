import React from 'react';
import './JobDetailSkeleton.css';

const JobDetailSkeleton = () => {
  return (
    <div className="container-jobW">
      <div className="jobWrpert col-lg-8">
        {/* Header */}
        <div className="skeleton-header">
          <div className="skeleton-logo" />
          <div className="skeleton-header-text">
            <div className="skeleton-title" />
            <div className="skeleton-sub" />
            <div className="skeleton-sub thin" />
          </div>
        </div>

        {/* Job tags */}
        <div className="skeleton-meta-tags">
          <div className="skeleton-tag" />
          <div className="skeleton-tag wide" />
        </div>

        {/* Video */}
        <div className="skeleton-video" />

        {/* Description */}
        <div className="skeleton-block" />
        <div className="skeleton-line" />
        <div className="skeleton-line wide" />
        <div className="skeleton-line" />
        <div className="skeleton-line wide" />

        {/* Lists */}
        <div className="skeleton-section-title" />
        <div className="skeleton-bullet" />
        <div className="skeleton-bullet" />
        <div className="skeleton-bullet" />

        <div className="skeleton-section-title" />
        <div className="skeleton-bullet" />
        <div className="skeleton-bullet" />
        <div className="skeleton-bullet" />

        {/* Button */}
        <div className="skeleton-btn" />
      </div>

      {/* Sidebar */}
      <div className="jb-sidebar">
        <div className="skeleton-sidebar-card">
          <div className="skeleton-side-title" />
          <div className="skeleton-side-item" />
          <div className="skeleton-side-item" />
          <div className="skeleton-side-item" />
          <div className="skeleton-side-item" />
        </div>
      </div>
    </div>
  );
};

export default JobDetailSkeleton;
