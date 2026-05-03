"use client";
import Image from 'next/image';

function ExploreBtn() {
  return (
    <div className="mt-7 flex justify-center">
      <a
        href="#events"
        id="explore-btn"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => console.log('CLICK')}
      >
        Explore Events
        <Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24} />
      </a>
    </div>
  );
}

export default ExploreBtn;