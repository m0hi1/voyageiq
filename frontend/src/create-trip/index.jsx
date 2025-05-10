import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  SelectBudgetOptions,
  SelectTravelesList,
  buildTravelPrompt,
} from '../constants/options';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GetData } from '../services/AiModal';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { doc, setDoc } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle, // Assuming DialogTitle is also from @/components/ui/dialog or exported by it
} from '@/components/ui/dialog';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
// import { DialogTitle } from '@radix-ui/react-dialog'; // Potentially redundant if available from local ui/dialog
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/services/FirebaseConfig';
import { useNavigate } from 'react-router-dom';

export default function CreateTrip() {
  const dataName = {
    days: 'noOfDays',
    place: 'location',
    budget: 'budget',
    travellers: 'noOfTravellers',
  };
  const [days, setDays] = useState('');
  const [formData, setFormData] = useState([]);
  const [openDailog, setOpenDailog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      setDays(newValue);
      handleInputChange(`${dataName.days}`, newValue);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onGenerateClick = async () => {
    const user = localStorage.getItem('user');

    if (!user) {
      setOpenDailog(true);
      toast.info('Please login first');
      return;
    }

    switch (true) {
      case !formData[dataName.days]:
        toast.info('Please enter no of days');
        return;
      case formData[dataName.days] > 15:
        toast.info('Days should be less than 15.');
        return;
      case !formData[dataName.place]:
        toast.info('Please enter Destination');
        return;
      case !formData[dataName.budget]:
        toast.info('Please enter budget');
        return;
      case !formData[dataName.travellers]:
        toast.info('Please enter no of travellers');
        return;
    }

    setLoading(true);
    const final_prompt = buildTravelPrompt({
      location: formData[dataName.place],
      days: formData[dataName.days],
      groupType: formData[dataName.travellers],
      budgetLevel: formData[dataName.budget],
    });

    const res = await GetData(final_prompt);

    saveTrip(res);

    setLoading(false);

    console.log(res);
  };

  const saveTrip = async tripData => {
    // Add a new document in collection "cities"
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const id = uuidv4();
    await setDoc(doc(db, 'AiTrips', id), {
      id,
      userSelection: formData,
      tripData: JSON.parse(tripData), //similar to tripData: tripData
      userEmail: user?.email,
    });
    setLoading(false);
    navigate('/view-trip/' + id);
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: tokenResponse => getUser(tokenResponse),
    onError: error => console.log(error),
  });

  const getUser = tokenInfo => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: 'Application/json',
          },
        }
      )
      .then(res => {
        console.log(res);
        localStorage.setItem('user', JSON.stringify(res.data));
        setOpenDailog(false);
        toast.success('User Logged in successfully');
        onGenerateClick();
      });
  };

  // useEffect(() => {
  //   console.log("Form Data :", formData);
  // }, [formData]);

  return (
    <div className="sm:px-10 md:px-20 lg:px-10 xl:px-10 px-5 mt-10 sm:mx-5 md:mx-5 lg:mx-45 xl:mx-55 mx-0">
      <h2 className="font-bold text-3xl">Tell us your travel preferences 🏕️</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide us with a few details,and our trip planner will generate a
        customized itinerary based on your preferences
      </p>

      <div className="mt-20 flex flex-col gap-10">
        <div>
          <h2 className="text-xl my-3 font-medium">
            What is your destination of choice
          </h2>
          <Input
            placeholder="eg . Paris"
            onChange={e => {
              let value = e.target.value;
              // setPlace(value);
              handleInputChange(`${dataName.place}`, value);
            }}
            type="text" // using "text" to gain full control over what can be typed
            // value={place}
          />
          {/* <GooglePlacesAutocomplete
            apiKey={import.meta.env.GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (e) => {
                console.log(e);
                setPlace(e);
                handleInputChange("location", e);
              },
            }}
          ></GooglePlacesAutocomplete> */}
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days would you like to spend there
          </h2>
          <Input
            placeholder="eg. 3"
            onChange={handleChange}
            type="text" // using "text" to gain full control over what can be typed
            value={days}
          />
        </div>

        <div>
          <h2 className="text-xl font-medium my-3">What is your budget?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() =>
                  handleInputChange(`${dataName.budget}`, item.title)
                }
                className={`justify-center items-center flex flex-col p-4 border cursor-pointer rounded-lg hover:shadow 
                ${
                  item.title === formData.budget
                    ? 'bg-secondary border-black'
                    : ''
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium my-3">
            Who do you plan on traveling with on your next adventure?
          </h2>
          <div className=" grid grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            {SelectTravelesList.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  handleInputChange(`${dataName.travellers}`, item.people);
                }}
                className={`justify-center items-center flex flex-col p-4 border cursor-pointer rounded-lg hover:shadow
                ${
                  item.people === formData[`${dataName.travellers}`]
                    ? 'bg-secondary border-black'
                    : ''
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
        <div className="my-20 flex justify-end">
          <Button
            className="cursor-pointer"
            disabled={loading}
            onClick={() => {
              onGenerateClick();
            }}
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin h-10 w-10" />
            ) : (
              'Generate Trip'
            )}
          </Button>
        </div>
      </div>
      <Dialog open={openDailog} onOpenChange={setOpenDailog}>
        <DialogContent className="max-w-sm rounded-2xl p-6">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-semibold mb-2">
              Sign in with Google
            </DialogTitle>
            <DialogDescription className="flex flex-col items-center space-y-4 text-sm text-muted-foreground">
              <img src="logo.svg" alt="App Logo" className="h-16 w-16" />
              Access the app securely using your Google account.
              <Button
                onClick={loginWithGoogle}
                className="w-full bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 transition flex items-center justify-center gap-3 py-2 mt-5"
              >
                <FcGoogle className="h-6 w-6" />
                <span className="text-base font-medium">
                  Continue with Google
                </span>
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
