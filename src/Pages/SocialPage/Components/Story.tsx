import React, { useEffect, useState } from 'react';
import { BiPlusCircle } from 'react-icons/bi';
import AddStroy from './sub-components/AddStory';
import { getStories, type StoryType } from '../../../firebase/story';
import ShowStory from './sub-components/ShowStory';

const Status = () => {
  const [Stories, setStories] = useState<StoryType[]>([]);
  const [openAddStory, setOpenAddStory] = useState(false);
  const [showStoryViewer, setShowStoryViewer] = useState(false);

  const getStories_ = async () => {
    const fetchData = await getStories();
    setStories(fetchData.Stories);
  };

  useEffect(() => {
    getStories_();
  }, []);

  return (
    <div className='relative z-10 w-screen h-44 p-2 flex flex-row gap-2 overflow-x-scroll'>
      {/* Add story button */}
      <div onClick={() => setOpenAddStory(true)} className=''>
        <div className='w-35 h-35 flex justify-center items-center gap-1 flex-col text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-[#11111175] rounded-full border-8 shrink-0 border-gray-50 dark:border-[#11111133]'>
          <BiPlusCircle className='text-xl' />
          <p className='text-sm'>أضف قـــــصة</p>
        </div>
      </div>

      {/* Stories list */}
      {Stories?.map((item) => (
        <div
          key={item.id}
          onClick={() => setShowStoryViewer(true)}  // open viewer on click
          className='relative w-full h-40 p-2 flex flex-col items-center'
        >
          <div className='relative flex justify-center items-center w-33 h-33 text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-[#11111175] rounded-full shrink-0 border-gray-50 dark:border-[#11111133]'>
            <div className='absolute top-0 w-full h-full z-0 bg-linear-to-b from-blue-500 via-pink-500 to-orange-500 rounded-full show-fast'></div>
            <img src={item.imageUrl} alt="" className='h-full w-full object-cover z-10 scale-90 rounded-full border-4 border-white' />
          </div>
          <p className='dark:text-white'>{item.UserName}</p>
        </div>
      ))}

      {openAddStory && (
        <AddStroy onClose={() => { setOpenAddStory(false); }} />
      )}

      {showStoryViewer && (
        <ShowStory
          stories={Stories}
          onClose={() => setShowStoryViewer(false)}
        />
      )}
    </div>
  );
};

export default Status;