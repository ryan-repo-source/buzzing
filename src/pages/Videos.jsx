import React from 'react'
import GlobalSearch from '../components/GlobalSearch'

const Videos = () => {
    return (
        <>
            <GlobalSearch />
            <section>
                <div className="inner-groups-sec video-sec">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 col-md-8 col-12 offset-md-2">
                                <div className="inner-groups-box">
                                    <div className="all-groups">
                                        <ul>
                                            <li>
                                                <p>All Videos</p>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="search-groups-row">
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-12">
                                                <div className="search-groups-box">
                                                    <form>
                                                        <input type="text" name placeholder="Search Groups..." />
                                                        <div className="search-groups-box-icon">
                                                            <button type="submit"><i className="fas fa-search" /></button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="video-wrap">
                                                    <h2>Coming Soon!</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Videos
