import React, { useContext, useEffect, useRef, useState } from "react";
// import { Button, Modal, ModalBody } from "reactstrap";
import {
  Button,
  TextField,
  Typography,
  Container,
  Paper,
} from "@material-ui/core";

import { Grid, makeStyles } from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Assignment, Phone, PhoneDisabled } from "@material-ui/icons";

// interface
import { CallItem } from "../data/calls";

//images
import imagePlaceholder from "../assets/images/users/profile-placeholder.png";
import { SocketContext } from "../context/SocketContext";

import { io } from "socket.io-client";
import Peer from "simple-peer";
import { useHistory } from "react-router-dom";


// interface VideoCallModalProps {
//   user: CallItem | null;
//   isOpen: boolean;
//   onClose: () => void;
// }

const VideoCallModal = ({ isOpen, onClose, user }) => {
  const [RoomCode, setRoomCode] = useState("");
  const history = useHistory();

  const submitCode = (e) => {
    e.preventDefault();
    history.push(`/room/${RoomCode}`);
  };

  return (
    <div className=" ">
      {/* Navbar */}
      {/* <Navbar /> */}
      {/* Hero */}
      <div className="relative h-screen ">
        {/* Image */}
        <div className="absolute h-full w-full flex overflow-hidden">
          {/* <img src={conf} className="object-cover  w-full h-full" /> */}
        </div>
        {/* Overlay */}
        <div className="absolute h-full w-full flex overflow-hidden bg-black/60"></div>
        {/* Hero Info */}
        <div className="lg:flex lg:pt-20 flex-col items-center justify-center relative z-10 px-6 md:max-w-[90vw] mx-auto">
          {/* Main */}
          <div className=" flex flex-col items-center justify-center pb-8">
            <h1 className="text-[50px] md:text-[80px] text-white font-bold pt-12">
              Video Chat App
            </h1>
            <p className="text-[26px] text-white  -mt-2">With ZegoCloud</p>
          </div>

          {/* Enter Code */}
          <form
            onSubmit={submitCode}
            className="text-white md:pt-12 flex flex-col items-center justify-center"
          >
            <div className=" flex flex-col justify-center items-center">
              <label className="text-[30px] md:text-[40px] font-bold pt-6">
                Enter Room Code
              </label>
              <input
                type="text"
                required
                placeholder="Enter Room Code"
                value={RoomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="py-1.5 md:py-2 px-4 rounded-full max-w-[14rem] mt-2 text-black md:mt-6 outline-0"
              />
            </div>
            <button
              type="submit"
              className=" bg-blue-500 hover:bg-blue-400 duration-100 ease-out font-bold w-[5rem] md:w-[7rem] rounded-full py-[5px] md:py-[7px] mt-2 md:mt-4 "
            >
              Go
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
