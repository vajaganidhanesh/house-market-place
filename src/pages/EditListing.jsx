import { useState, useRef, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import {
  doc,
  updateDoc,
  getDoc,
  serverTimestamp 
} from "firebase/firestore";

import {db} from '../firebase.config'
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import {toast} from 'react-toastify';
import {v4 as uuidv4} from 'uuid'

function EditListing() {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [listing,setListing] = useState(null)
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    offer: false,
    regularPrice: 0,
    discountPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountPrice,
    images,
    latitude,
    longitude,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const params = useParams();
  const isMounted = useRef(true);
  const geodata = useRef({});

  //  Redirect if listing is not user's
  useEffect(()=>{
    if(listing && listing.userRef !== auth.currentUser.uid){
        toast.error('You can not edit that listing')
        navigate('/explore')
    }
  })
  

  // Fetching listing data from user
  useEffect(()=>{
    setLoading(true)
    const fetchListing = async()=>{
        const docRef = doc(db,'listening',params.listingId)
        const docSnap = await getDoc(docRef)

        if(docSnap.exists()){
            setListing(docSnap.data())
            setFormData({...docSnap.data(),address:docSnap.data().address})
            setLoading(false)
        }
        else{
            navigate('/explore')
            toast.error('Listing does not exist')
        }
    }

    fetchListing()
  },[])

  // Sets userRef when login
  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/sign-in");
        }
      });
    }

    navigator.geolocation.getCurrentPosition(position=>{
      geodata.current = position
    })

    return () => {
      isMounted.current = false;
    };
  }, [isMounted,geodata.current]);

  console.log(geodata.current.coords);

  const onSubmit = async(e) => {
    e.preventDefault();

    setLoading(true)
    if(name.trim().length < 4 ){
      setLoading(false)
      toast.error('Could not find the Name')
    }

    if(discountPrice >= regularPrice){
      setLoading(false)
      toast.error('Discounted price needs to be less than regular price')
    }

    if(images.length > 6){
      setLoading(false)
      toast.error('Max 6 images')
      return
    }
  
    // Store images in firebase
    const storeImage = async (image)=>{
      return new Promise((resolve,reject)=>{
        const storage = getStorage()
        const fileName = `${auth.currentUser.uid}-${images.name}-${uuidv4()}`

        const storageRef = ref(storage,'images/' + fileName)

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on('state_changed', 
        (snapshot) => {
         
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, 
          (error) => {
            reject(error)
          }, 
          () => {
            
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL)
              console.log('File available at', downloadURL);
            })
          }
        )

      })
    }

    

    const imageUrls = await Promise.all(
      [...images].map((image)=>storeImage(image))
    ).catch(()=>{
      setLoading(false)
      toast.error('Images not Uploaded')
      return
    })

    const formDataCopy = {
      ...formData,
      imageUrls,
      latitude :geodata.current.coords.latitude,
      longitude :geodata.current.coords.longitude,
      timestamp:serverTimestamp()
    }
    console.log(formDataCopy);

    console.log(geodata.current.coords.latitude);

    delete formDataCopy.images
    !formDataCopy.offer && delete formDataCopy.discountPrice

    // const docRef = await addDoc(collection(db,'listening'),formDataCopy)

    // Update listing
    const docRef = doc(db,'listening',params.listingId)
    await updateDoc(docRef, formDataCopy)
    setLoading(false)

    toast.success('Listing saved')
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)
  }

  const onMutate = (e) => {
    let boolean = null;

    if(e.target.value === 'true'){
      boolean = true
    }

    if(e.target.value === 'false'){
      boolean = false
    }

    // Files
    if(e.target.files){
      setFormData((prevState)=>({
        ...prevState,
        images: e.target.files
      }))
    }

    // Text/Booleans/Numbers
    if(!e.target.files){
      setFormData((prevState)=>({
        ...prevState,
        [e.target.id]:boolean ?? e.target.value,
      }))
    }

    console.log(formData);
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      <div className="profile">
        <header>
          <p className="pageHeader">Edit a Listing</p>
        </header>

        <main>
          <form onSubmit={onSubmit}>
            <label className="formLabel">Sale / Rent</label>
            <div className="formButtons">
              <button
                type="button"
                className={type === "sale" ? "formButtonActive" : "formButton"}
                id="type"
                value="sale"
                onClick={onMutate}
              >
                Sale
              </button>

              <button
                type="button"
                className={type === "rent" ? "formButtonActive" : "formButton"}
                id="type"
                value="rent"
                onClick={onMutate}
              >
                Rent
              </button>
            </div>

            <label className="formLabel">Name</label>
            <input
              className="formInputName"
              type="text"
              id="name"
              value={name}
              onChange={onMutate}
              // maxLength="32"
              // minLength="10"
              required
              autoComplete="off"
            />

            <div className="formRooms flex">
              <div>
                <label className="formLabel">Bedrooms</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="bedrooms"
                  value={bedrooms}
                  onChange={onMutate}
                  min="1"
                  max="50"
                  required
                />
              </div>
              <div>
                <label className="formLabel">Bathrooms</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="bathrooms"
                  value={bathrooms}
                  onChange={onMutate}
                  min="1"
                  max="50"
                  required
                />
              </div>
            </div>

            <label className="formLabel">Parking spot</label>
            <div className="formButtons">
              <button
                className={parking ? "formButtonActive" : "formButton"}
                type="button"
                id="parking"
                value={true}
                onClick={onMutate}
                min="1"
                max="50"
              >
                Yes
              </button>
              <button
                className={
                  !parking && parking !== null
                    ? "formButtonActive"
                    : "formButton"
                }
                type="button"
                id="parking"
                value={false}
                onClick={onMutate}
              >
                No
              </button>
            </div>

            <label className="formLabel">Furnished</label>
            <div className="formButtons">
              <button
                className={furnished ? "formButtonActive" : "formButton"}
                type="button"
                id="furnished"
                value={true}
                onClick={onMutate}
              >
                Yes
              </button>
              <button
                className={
                  !furnished && furnished !== null
                    ? "formButtonActive"
                    : "formButton"
                }
                type="button"
                id="furnished"
                value={false}
                onClick={onMutate}
              >
                No
              </button>
            </div>

            {/* address input */}
            <label className="formLabel">Address</label>
            <textarea
              className="formInputAddress"
              type="text"
              id="address"
              value={address}
              onChange={onMutate}
              required
            />
            {/* GeoLocationDetails */}
            {!geolocationEnabled && (
              <div className="formLatLng flex">
                <div>
                  <label className="formLabel">Latitude</label>
                  <input
                    className="formInputSmall"
                    type="number"
                    id="latitude"
                    value={latitude}
                    onChange={onMutate}
                    required
                  />
                </div>
                <div>
                  <label className="formLabel">Longitude</label>
                  <input
                    className="formInputSmall"
                    type="number"
                    id="longitude"
                    value={longitude}
                    onChange={onMutate}
                    required
                  />
                </div>
              </div>
            )}

            {/* offers section */}
            <label className="formLabel">Offer</label>
            <div className="formButtons">
              <button
                className={offer ? "formButtonActive" : "formButton"}
                type="button"
                id="offer"
                value={true}
                onClick={onMutate}
              >
                Yes
              </button>
              <button
                className={
                  !offer && offer !== null ? "formButtonActive" : "formButton"
                }
                type="button"
                id="offer"
                value={false}
                onClick={onMutate}
              >
                No
              </button>
            </div>

            {/* Price section */}
            <label className="formLabel">Regular Price</label>
            <div className="formPriceDiv">
              <input
                className="formInputSmall"
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onMutate}
                min="50"
                max="750000000"
                required
              />
              {type === "rent" && <p className="formPriceText">$ / Month</p>}
            </div>
            {/* discounted price */}

            {offer && (
              <>
                <label className="formLabel">Discount Price</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="discountPrice"
                  value={discountPrice}
                  onChange={onMutate}
                  min="50"
                  max="750000000"
                  required={offer}
                />
              </>
            )}

            {/* images section */}
            <label className="formLabel">Images</label>
            <p className="imagesInfo">
              The first image will be the cover (max 6).
            </p>
            <input
              className="formInputFile"
              type="file"
              id="images"
              onChange={onMutate}
              max="6"
              accept=".jpg,.png,.jpeg"
              multiple
              required
            />

            {/* submition section */}
            <button type="submit" className="primaryButton createListingButton">
              Edit Listing
            </button>
          </form>
        </main>
      </div>
    </>
  );
}

export default EditListing;
