import { FaYoutubeSquare } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { MdMarkEmailRead } from "react-icons/md";
import { FiUserCheck } from "react-icons/fi";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { FaFileImage } from "react-icons/fa";

/**
 * TODO:
 * 1. Go to https://react-icons.github.io/react-icons/
 * 2. Import and export all icons
 */
export const icons = {
  YOUTUBE_WHITE: <FaYoutubeSquare size={20} />,
  TWITTER_WHITE: <FaTwitterSquare size={20} />,
  FACEBOOK_WHITE: <FaFacebookSquare size={20} />,
  SEARCH: <IoIosSearch size={28} />,
  USER: <FiUser size={28} />,
  CART: <IoCartOutline size={28} />,
  ERROR: <MdErrorOutline />,
  CLOSE: <IoMdClose />,
  EMAIL_SUCCESS: <MdMarkEmailRead />,
  USER_CHECK: <FiUserCheck size={28} />,
  LEFT_ARROW: <FaAngleDoubleLeft size={16} />,
  RIGHT_ARROW: <FaAngleDoubleRight size={16} />,
  IMAGE: <FaFileImage size={40} />,
};
