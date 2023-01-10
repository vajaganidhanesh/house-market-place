import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import SwiperCore,{Navigation,Pagination,Scrollbar,Ally} from 'swiper';
import {Swiper,SwiperSlide} from 'swiper/react'
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const navigate = useNavigate();
  const param = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listening", param.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log(docSnap.data());
        setListing(docSnap.data());
        setLoading(false);
      }
    };

    fetchListing();
  }, [navigate, param.listingId]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      <main>
        {/* slider */}
        {/* <Helmet>
        <title>{listing.name}</title>
      </Helmet> */}
        <Swiper slidesPerView={1} pagination={{ clickable: true }}>
          {listing.imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              {console.log(listing.imageUrls[index])}
              {console.log(url)}
              <div
              style={{
                background: `url(${listing.imageUrls[index]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className='swiperSlideDiv'
            >sdfsdf</div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div
          className="shareIconDiv"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setShareLinkCopied(true);
            setTimeout(() => {
              setShareLinkCopied(false);
            }, 2000);
          }}
        >
          <img src={shareIcon} alt="shareIcon" />
        </div>

        {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}

        <div className="listingDetails">
          <p className="listingName">
            {listing.name} - $
            {listing.offer
              ? listing.discountPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
          <p className="listingLocation">{listing.address}</p>
          <p className="listingType">
            For {listing.type === "rent" ? "Rent" : "Sale"}
          </p>
          {listing.offer && (
            <p className="discountPrice">
              ${listing.regularPrice - listing.discountPrice} dicount
            </p>
          )}

          <ul className="listingDetailsList">
            <li>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Bedrooms`
                : "1 Bedroom"}
            </li>

            <li>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Bathrooms`
                : "1 Bathroom"}
            </li>
            <li>{listing.parking && "Parking Spot"}</li>
            <li>{listing.furnished && "Furnished Spot"}</li>
          </ul>

          <p className="listingLocationTitle">Location</p>

          <div className="leafletContainer">
            <MapContainer
              style={{ height: "100%", width: "100%" }}
              center={[listing.latitude, listing.longitude]}
              zoom={13}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
              />

              <Marker position={[listing.latitude, listing.longitude]}>
                <Popup>{listing.address}</Popup>
              </Marker>
            </MapContainer>
          </div>

          {auth.currentUser?.uid !== listing.userRef && (
            <Link
              to={`/contact/${listing.userRef}?listingName=${listing.name}`}
              className="primaryButton"
            >
              Contact LandLord
            </Link>
          )}
        </div>
      </main>
    </>
  );
}

export default Listing;
