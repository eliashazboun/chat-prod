import ImageCached from "./ImageCached";

const UserInfo = ({ name, imgHeight = 60, imgWidth = 60, className, notificationCount }) => {
  

  return (
    <div className={className ? className : '' + ' relative w-full text-center '}>
        <ImageCached name={name} height={imgHeight} width={imgWidth}/>
        <div className="text-lg font-bold ">{name}</div>
        {notificationCount > 0 
          ?<div className="absolute -top-2 -left-3 bg-red-600 p-1 rounded-full text-white min-w-[15px]">
          {notificationCount}
        </div>:''}
    </div>
  );
};

export default UserInfo;
