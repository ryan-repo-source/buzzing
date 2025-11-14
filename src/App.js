import React from 'react';
import './css/main.css';
import './css/responsive.css';
import Home from './pages/Home';
import About from './pages/About';
import Brand from './pages/Brand';
import LostPassword from './pages/lostPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Faqs from './pages/faqs';
import TermServices from './pages/TermServices';
import Article from './pages/Article';
import Blog from './pages/Blog';
import DetailBlog from './pages/DetailBlog';
import Contacts from './pages/Contacts';
import Group from './pages/Group';
import Detailgroup from './pages/Detailgroup';
import Members from './pages/Members';
import Memberdetail from './pages/Memberdetail';
import Activity from './pages/Activity';
import Videos from './pages/Videos';
import Profile from './pages/Profile';
import Freinds from './pages/Freinds';
import Header from './components/Header';
import NoteEditor from './pages/NoteEditor';
import ScrollToTop from './components/ScrollTop';
import Questions from './pages/Questions';
import { useUserContext } from './context/UserContext';
import Forums from './pages/Forums';
import ForumTopics from './pages/ForumTopics';
import TopicReplies from './pages/TopicReplies';
import Gallery from './pages/Gallery';
import CreateGroup from './pages/CreateGroup';
import AddEvents from './pages/AddEvents';
import AddJob from './pages/Jobs/AddJob';
import Listing from './pages/Jobs/Listing';
import JobDetail from './pages/Jobs/JobDetail';
import EditJob from './pages/Jobs/EditJob';
import Mannage from './pages/Jobs/Mannage';
import AddAdvert from './pages/Adverts/AddAdvert';
import AdvertListing from './pages/Adverts/AdvertListing';
import ManageAdverts from './pages/Adverts/ManageAdverts';
import EditAdvert from './pages/Adverts/EditAdvert';
import AdvertDetail from './pages/Adverts/AdvertDetail';
import BrandPage from './pages/BrandPage';
import Activate_Account from './pages/Activate_Account';
import ShopListing from './pages/Shop/ShopListing';
import ProductDetail from './pages/Shop/ProductDetail';
import Cart from './pages/Shop/Cart';
import Checkout from './pages/Shop/Checkout';

function App() {

  const { auth_data } = useUserContext();

  if(auth_data === null){
    return false;
  }

  return (
    <Router>
      <div className="App">
        <Header />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/brand-and-attracting-customers" element={<BrandPage />} />
          <Route path="/event/:id" element={<Brand />} />
          <Route path="/lost-password" element={<LostPassword />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/register" element={<Register />} />
          <Route path="/activate-account/:token" element={<Activate_Account />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path='/term-services' element={<TermServices />}></Route>
          <Route path='/articles' element={<Article />}></Route>
          <Route path='/blogs' element={<Blog />}></Route>
          <Route path='/detail-blog' element={<DetailBlog />}></Route>
          <Route path='/contact' element={<Contacts />}></Route>
          <Route path='/groups' element={<Group />}></Route>
          <Route path='/create-group' element={<CreateGroup />}></Route>
          <Route path='/group-detail/:id' element={<Detailgroup />}></Route>
          <Route path='/videos' element={<Videos />}></Route>
          <Route path='/member' element={<Members />}></Route>
          <Route path='/member-detail' element={<Memberdetail />}></Route>
          <Route path='/text' element={<NoteEditor />}></Route>
          <Route path='/questions' element={<Questions />}></Route>
          <Route path='/forums' element={<Forums />}></Route>
          <Route path='/forums/:id/topics/' element={<ForumTopics />}></Route>
          <Route path='/forums/:id/topics/:topicID' element={<TopicReplies />}></Route>
          {/* Private Routes */}
          <Route path='/activity' element={<Activity />}></Route>
          <Route path='/gallery' element={<Gallery />}></Route>
          <Route path='/member/:userId/profile' element={<Profile />} />
          <Route path='/member/:userId/profile/post/:postId' element={<Profile />} />
          <Route path='/submit-article' element={<AddEvents />} />
          {/* Jobs */}
          <Route path='/job/submit-job' element={<AddJob />} />
          <Route path='/jobs' element={<Listing />} />
          <Route path='/job-detail/:id' element={<JobDetail />} />
          <Route path='/job-edit/:id' element={<EditJob />} />
          <Route path='/job/manage' element={<Mannage />} />
          {/* Jobs */}

          {/* Shop */}
          <Route path='/store' element={<ShopListing />} />
          <Route path='/store/:sku' element={<ProductDetail />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          {/* Shop */}
          <Route path='/advert/submit-advert' element={<AddAdvert />} />
          <Route path='/adverts' element={<AdvertListing />} />
          <Route path='/advert/manage' element={<ManageAdverts />} />
          <Route path='/advert/:id/edit' element={<EditAdvert />} />
          <Route path='/advert/:id/view' element={<AdvertDetail />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
