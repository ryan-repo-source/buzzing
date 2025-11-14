import React from 'react';

const AdvertDetailSkeleton = () => {
  return (
    <div className="container-jobW">
      <div className="jobWrpert col-lg-9 m-0">
        {/* Title & Price */}
        <div className="skeleton-title mb-3" />
        <div className="skeleton-price mb-4" />

        {/* Image Slider */}
        <div className="skeleton-video" style={{ height: '260px' }} />

        {/* Meta Grid */}
        <div className="skeleton-meta-tags">
          <div className="skeleton-tag" />
          <div className="skeleton-tag wide" />
        </div>

        {/* Description */}
        <div className="skeleton-section-title mt-4" />
        <div className="skeleton-line" />
        <div className="skeleton-line wide" />
        <div className="skeleton-line" />
        <div className="skeleton-line wide" />

        {/* Feature List */}
        <div className="skeleton-section-title mt-4" />
        <div className="skeleton-bullet" />
        <div className="skeleton-bullet" />
        <div className="skeleton-bullet" />

        {/* CTA Buttons */}
        <div className="skeleton-btn mt-5" style={{ width: '180px' }} />
        <div className="skeleton-btn mt-3" style={{ width: '220px' }} />
      </div>
    </div>
  );
};

export default AdvertDetailSkeleton;
