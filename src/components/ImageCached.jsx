import { getBlob, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { storage } from "../Firebase";
import { Skeleton } from "@mui/material";
import { imageCache } from "../cache";

const ImageCached = ({ name, height, width }) => {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');

  const getImage = async () => {
      setLoading(true)
      const val = await imageCache.get(name);
      if (val) {
        console.log("Retreived From Cache");
        setLoading(false)
        return setUrl(val)
      } else {
        console.log("Retreived From Database");

        try{

          const storageRef = ref(storage, `profilePics/${name}`);
          const blob = await getBlob(storageRef);
  
          var reader = new FileReader();
          reader.readAsDataURL(blob);
  
          reader.onloadend = async function () {
            var base64 = reader.result;
            await imageCache.set(name, base64);
            setLoading(false);

            return setUrl(base64)
          };
        }catch(err){
          setLoading(false);
          console.log('FUCk')
        }

      }
  };

  useEffect(() => {
    const url = getImage()
    setUrl(url)
  }, [])

  return (
    <>
      {loading ? (
        <Skeleton
          variant="circular"
          height={50}
          width={50}
          className="m-auto w-full"
        />
      ) : (
        <img
          loading="lazy"
          src={url}
          className="rounded-full object-cover m-auto"
          height={height}
          width={width}
          alt=""
        />
      )}
    </>
  );
};

export default ImageCached;
