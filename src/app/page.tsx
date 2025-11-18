
import React from "react";
import Loading from "./loading";
import Banner from "@/components/Banner";
import EventList from "@/components/EventList";

const Home = () => {
  return (
    <main className="bg-[#ffffff]">
     <Banner/>
     <EventList/>
      
    </main>
  );
};

export default Home;
