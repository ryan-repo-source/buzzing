import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Contacts() {
  return (
    <div className='bg-black'>
    
  <section>
  <div className="inner-contact-us-sec">
    <div className="container">
      <div className="row" style={{justifyContent: 'center'}}>
        <div className="col-lg-8 col-md-8 col-12">
          <div className="inner-contact-us-heading">
            <h2>Send Message</h2>
            <p>Welcome to Buzzing Universe! Send us a message with your name and email, and we’ll get back to you shortly!</p>
            <form>
              <div className="row">
                <div className="col-lg-6 col-md-6 col-12">
                  <input type="text" name="Your name" placeholder="Your name" />
                </div>
                <div className="col-lg-6 col-md-6 col-12">
                  <input type="text" name="your-email" placeholder="your email" />
                </div>
                <div className="col-lg-12 col-md-12 col-12">
                  <input type="text" name="Subject" placeholder="Subject" />
                </div>
                <div className="col-lg-12 col-md-12 col-12">
                  <textarea placeholder="Message" defaultValue={""} />
                </div>
                <div className="col-lg-12 col-md-12 col-12">
                  <div className="inner-contact-us-button">
                    <button type="submit">Send Message</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<Footer  />


    </div>
  )
}

export default Contacts
