import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import axios from 'axios';

function renderHTML(html) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function Article() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 5;

  const getEvents = async () => {
    try {
      const res = await axios.get(`https://buzzinguniverse.com/backend/api/get-article`);
      setEvents(res.data.data);
      setFilteredEvents(res.data.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const formattedDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = events.filter(evt =>
      evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    getEvents();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  return (
    <div>
      <div className="articles-search-bar-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-8 col-12">
              <div className="articles-search-bar-form-serach-bar">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    name="search"
                    placeholder="Search by title or description"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="articles-search-bar-btn">
                    <button type="submit"><FaSearch /></button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="articles-main-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-8 col-12">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div className="mb-4" key={index}>
                    <div className="skeleton-cards">
                      <div className="skeleton-title"></div>
                      <div className="skeleton-meta"></div>
                      <div className="skeleton-description"></div>
                      <div className="skeleton-button"></div>
                    </div>
                  </div>
                ))
              ) : currentItems.length > 0 ? (
                currentItems.map(evt => (
                  <article className="holiday-dessert-card" key={evt.id}>
                    <Link to={`/event/${evt.id}`}><h3 className="holiday-dessert-title">{evt.title}</h3></Link>
                    <p className="holiday-dessert-meta">
                      {evt.category} &nbsp;
                      <span className="holiday-dessert-date">{formattedDate(evt.created_at)}</span>
                    </p>
                    <div className="holiday-dessert-description">
                      {evt.description.length > 150 ? (
                        <>
                          {renderHTML(evt.description.substring(0, 150))}
                          ...
                        </>
                      ) : (
                        renderHTML(evt.description)
                      )}
                    </div>
                    <Link to={`/event/${evt.id}`} className="holiday-dessert-readmore">Read More »</Link>
                  </article>
                ))
              ) : (
                <div className="col-12"><p>No articles found.</p></div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && !isLoading && (
                <div className="pagination-controls text-center mt-4">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="col-lg-4 col-md-4 col-12">
              <div className="articles-main-img">
                <img src="images/inner-articles-1.jpg" alt="img" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
